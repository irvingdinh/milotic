import { useStore } from "@nanostores/preact";
import { useState } from "preact/hooks";

import { ForwardIcon } from "../../components/Icons/ForwardIcon.tsx";
import { XIcon } from "../../components/Icons/XIcon.tsx";
import { authStore } from "../../stores/auth-store.ts";

// Types
interface RewriteResponse {
  body: ReadableStream<Uint8Array> | null;
  ok: boolean;
  status: number;
  statusText: string;
  text: () => Promise<string>;
}

// Constants
const API_ENDPOINT = "/api/v1/applications/rewrite";
const MIN_TEXT_LENGTH = 13;
const ERROR_MESSAGES = {
  NO_USER: "Please wait for authentication to complete",
  EMPTY_TEXT: "Please enter some text to rewrite",
  EMPTY_RESPONSE: "Response body is empty",
  NO_RESULT: "No rewritten text received",
  GENERIC: "Failed to rewrite text. Please try again.",
  UNKNOWN: "Unknown error",
} as const;

export const RewriteWidget = () => {
  // State management
  const { user } = useStore(authStore);
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Derived state
  const isSubmittable = !isLoading && text.length > MIN_TEXT_LENGTH;
  const hasResult = Boolean(result);

  // Validation helpers
  const validateSubmission = (): boolean => {
    if (!user) {
      setError(ERROR_MESSAGES.NO_USER);
      return false;
    }

    if (!text.trim()) {
      setError(ERROR_MESSAGES.EMPTY_TEXT);
      return false;
    }

    return true;
  };

  // API helpers
  const makeRewriteRequest = async (idToken: string): Promise<RewriteResponse> => {
    return fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: idToken,
      },
      body: JSON.stringify({
        text: text.trim(),
      }),
    }) as Promise<RewriteResponse>;
  };

  const handleErrorResponse = async (response: RewriteResponse): Promise<never> => {
    const errorText = await response.text().catch(() => ERROR_MESSAGES.UNKNOWN);
    throw new Error(
      errorText || `HTTP ${response.status}: ${response.statusText}`
    );
  };

  const processStreamingResponse = async (response: RewriteResponse): Promise<string> => {
    if (!response.body) {
      throw new Error(ERROR_MESSAGES.EMPTY_RESPONSE);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedResult = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedResult += chunk;
        setResult(accumulatedResult);
      }
    } finally {
      reader.releaseLock();
    }

    return accumulatedResult;
  };

  // Event handlers
  const handleSubmit = async (e: Event): Promise<void> => {
    e.preventDefault();

    if (!validateSubmission()) return;

    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const idToken = await user!.getIdToken();
      const response = await makeRewriteRequest(idToken);

      if (!response.ok) {
        await handleErrorResponse(response);
      }

      const accumulatedResult = await processStreamingResponse(response);

      if (!accumulatedResult.trim()) {
        setResult(ERROR_MESSAGES.NO_RESULT);
      }
    } catch (err) {
      console.error("Rewrite request failed:", err);
      setError(
        err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearResult = (e: Event): void => {
    e.preventDefault();
    setResult("");
    setError("");
    setIsLoading(false);
  };

  const handleTextChange = (e: Event): void => {
    setText((e.target as HTMLTextAreaElement).value);
  };

  // Component renderers
  const renderActionButton = () => {
    if (hasResult) {
      return (
        <button
          type="button"
          className="btn btn-square btn-sm"
          disabled={isLoading}
          onClick={handleClearResult}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <XIcon className="h-5 w-5" />
          )}
        </button>
      );
    }

    return (
      <button
        type="submit"
        className="btn btn-square btn-sm"
        disabled={!isSubmittable}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <ForwardIcon className="h-5 w-5" />
        )}
      </button>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <div className="mt-2">
        <div
          role="alert"
          className="alert alert-error alert-soft rounded-lg"
        >
          <span>{error}</span>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (hasResult) {
      return <div className="mt-4">{result}</div>;
    }

    return (
      <div className="mt-4">
        <textarea
          value={text}
          onInput={handleTextChange}
          placeholder="Enter the text you want to rewrite..."
          rows={6}
          disabled={isLoading}
          className="textarea w-full"
        />
      </div>
    );
  };

  // Main render
  return (
    <div className="card card-border card-sm bg-base-100">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-medium">AI Rewrite</h2>
            <div>{renderActionButton()}</div>
          </div>

          {renderError()}
          {renderContent()}
        </form>
      </div>
    </div>
  );
};
