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
          "Authorization": idToken,
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        // Try to get error message from response body
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
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
      setError(err instanceof Error ? err.message : "Failed to rewrite text. Please try again.");
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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="rewrite-input" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Enter text to rewrite:
          </label>
          <textarea
            id="rewrite-input"
            value={text}
            onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
            placeholder="Enter the text you want to rewrite..."
            rows={6}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              const target = e.target as HTMLTextAreaElement;
              if (target) target.style.borderColor = "#3b82f6";
            }}
            onBlur={(e) => {
              const target = e.target as HTMLTextAreaElement;
              if (target) target.style.borderColor = "#e2e8f0";
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <button
            type="submit"
            disabled={isDisabled}
            style={{
              padding: "12px 24px",
              backgroundColor: isDisabled ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isDisabled ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {isSubmitting ? "Rewriting..." : "Rewrite Text"}
          </button>

          {result && (
            <button
              type="button"
              onClick={clearResult}
              style={{
                padding: "12px 24px",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
            >
              Clear Result
            </button>
          )}
        </div>

        {authLoading && (
          <div style={{ color: "#6b7280", marginBottom: "16px" }}>
            Authenticating...
          </div>
        )}

        {error && (
          <div style={{
            padding: "12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            color: "#dc2626",
            marginBottom: "16px",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}
      </form>

      {result && (
        <>
          <hr style={{ margin: "24px 0", border: "none", borderTop: "1px solid #e2e8f0" }} />
          
          <div>
            <h3 style={{ marginBottom: "12px", color: "#374151", fontSize: "18px" }}>
              Rewritten Text:
            </h3>
            <div style={{
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {result}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
