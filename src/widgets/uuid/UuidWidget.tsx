import { useEffect, useState } from "preact/hooks";

export const UuidWidget = () => {
  const [uuid, setUuid] = useState("");
  const [copied, setCopied] = useState(false);

  const generateUuid = () => {
    // Simple UUID v4 generator
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
    setUuid(uuid);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!uuid) return;

    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  // Auto-generate UUID on component mount
  useEffect(() => {
    generateUuid();
  }, []);

  return (
    <div class="h-full flex flex-col space-y-4">
      {/* UUID Display */}
      <div class="flex-1 flex flex-col space-y-3">
        <div 
          class="bg-base-200 p-3 rounded-lg cursor-pointer hover:bg-base-300 transition-colors"
          onClick={copyToClipboard}
        >
          <code class="text-xs font-mono break-all text-base-content">{uuid}</code>
        </div>

        <div class="text-xs text-base-content/50 text-center">
          Click UUID to copy
        </div>
      </div>

      {/* Action Buttons */}
      <div class="flex gap-2">
        <button
          onClick={copyToClipboard}
          class={`btn btn-sm flex-1 ${copied ? "btn-success" : "btn-primary"}`}
        >
          {copied ? "Copied!" : "📋 Copy"}
        </button>
        
        <button
          onClick={generateUuid}
          class="btn btn-outline btn-sm flex-1"
        >
          🔄 Regenerate
        </button>
      </div>
    </div>
  );
};
