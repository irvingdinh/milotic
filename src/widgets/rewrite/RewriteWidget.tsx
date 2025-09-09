import { useStore } from "@nanostores/preact";
import { useState } from "preact/hooks";

import { authStore } from "../../stores/auth-store.ts";

export const RewriteWidget = () => {
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

    setIsSubmitting(true);
    setError("");
    setResult(""); // Clear previous result

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
        // Try to get error message from response body
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(
          errorText || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      // Handle streaming plaintext response
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

          // Decode the chunk and append to accumulated result
          const chunk = decoder.decode(value, { stream: true });
          accumulatedResult += chunk;

          // Update the result in real-time as chunks arrive
          setResult(accumulatedResult);
        }
      } finally {
        reader.releaseLock();
      }

      // Ensure we have some result
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

  const clearResult = () => {
    setResult("");
    setError("");
  };

  const isDisabled = authLoading || !user || isSubmitting || !text.trim();

  return (
    <div class="container mx-auto max-w-4xl px-6 py-8">
      <form onSubmit={onSubmit} class="space-y-6">
        <div class="form-control">
          <label class="label" htmlFor="rewrite-input">
            <span class="label-text font-semibold">Enter text to rewrite:</span>
          </label>
          <textarea
            id="rewrite-input"
            value={text}
            onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
            placeholder="Enter the text you want to rewrite..."
            rows={6}
            class="textarea textarea-bordered textarea-lg w-full resize-y"
          />
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            disabled={isDisabled}
            class={`btn ${isDisabled ? "btn-disabled" : "btn-primary"}`}
          >
            {isSubmitting && (
              <span class="loading loading-spinner loading-sm"></span>
            )}
            {isSubmitting ? "Rewriting..." : "Rewrite Text"}
          </button>

          {result && (
            <button
              type="button"
              onClick={clearResult}
              class="btn btn-outline btn-secondary"
            >
              Clear Result
            </button>
          )}
        </div>

        {authLoading && (
          <div class="alert alert-info">
            <span class="loading loading-spinner loading-sm"></span>
            Authenticating...
          </div>
        )}

        {error && (
          <div class="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </form>

      {result && (
        <>
          <div class="divider my-8"></div>

          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">Rewritten Text:</h3>
              <div class="bg-base-200 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap break-words">
                {result}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
