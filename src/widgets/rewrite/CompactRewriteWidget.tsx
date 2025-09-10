import { useStore } from "@nanostores/preact";
import { useState } from "preact/hooks";

import { authStore } from "../../stores/auth-store.ts";

export const CompactRewriteWidget = () => {
  const { user, loading: authLoading } = useStore(authStore);
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: Event) => {
    e.preventDefault();

    if (!user) {
      setError("Please wait for authentication to complete");
      return;
    }

    if (!text.trim()) {
      setError("Please enter some text to rewrite");
      return;
    }

    if (text.length > 1000) {
      setError("Text exceeds 1000 character limit");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setResult("");

    try {
      const idToken = await user.getIdToken();

      const response = await fetch("/api/v1/applications/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: idToken,
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          errorText || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResult = "";

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          accumulatedResult += chunk;
          setResult(accumulatedResult);
        }
      } finally {
        reader.releaseLock();
      }

      if (!accumulatedResult.trim()) {
        setResult("No rewritten text received");
      }
    } catch (err) {
      console.error("Rewrite request failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to rewrite text. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearAll = () => {
    setText("");
    setResult("");
    setError("");
  };

  const isDisabled = authLoading || !user || isSubmitting || !text.trim();

  return (
    <div className="h-full flex flex-col space-y-3">
      <form onSubmit={onSubmit} className="flex-1 flex flex-col space-y-3">
        <div className="flex-1 flex flex-col">
          <textarea
            value={text}
            onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
            placeholder="Enter text to rewrite..."
            className="textarea textarea-bordered textarea-sm w-full flex-1 resize-none text-sm"
            rows={4}
            maxLength={1000}
          />
          <div className="text-xs text-base-content/60 mt-1 text-right">
            {text.length}/1000 characters
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isDisabled}
            className={`btn btn-sm flex-1 ${isDisabled ? "btn-disabled" : "btn-primary"}`}
          >
            {isSubmitting && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
            {isSubmitting ? "Rewriting..." : "Rewrite"}
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="btn btn-sm btn-outline btn-secondary"
          >
            Clear
          </button>
        </div>

        {authLoading && (
          <div className="alert alert-info alert-sm">
            <span className="loading loading-spinner loading-xs"></span>
            <span className="text-xs">Authenticating...</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error alert-sm">
            <span className="text-xs">{error}</span>
          </div>
        )}
      </form>

      {result && (
        <div className="flex-1 bg-base-200 p-3 rounded-lg overflow-y-auto">
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
