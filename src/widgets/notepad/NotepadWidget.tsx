import { useEffect, useState } from "preact/hooks";

export const NotepadWidget = () => {
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSave, setAutoSave] = useState(true);

  const LOCAL_STORAGE_KEY = "milotic-notepad-content";

  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || content === "") return;

    const saveTimeout = setTimeout(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, content);
      setLastSaved(new Date());
    }, 1000); // Auto-save after 1 second of no typing

    return () => clearTimeout(saveTimeout);
  }, [content, autoSave]);

  const handleContentChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setContent(target.value);
  };

  const saveNow = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, content);
    setLastSaved(new Date());
  };

  const clearContent = () => {
    setContent("");
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setLastSaved(null);
  };

  const copyContent = async () => {
    if (!content.trim()) return;

    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return "Not saved";
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffSeconds < 60) {
      return `Saved ${diffSeconds}s ago`;
    } else if (diffMinutes < 60) {
      return `Saved ${diffMinutes}m ago`;
    } else {
      return lastSaved.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  };

  return (
    <div class="h-full flex flex-col space-y-3">
      {/* Textarea for note content */}
      <div class="flex-1 flex flex-col">
        <textarea
          class="textarea textarea-bordered w-full h-full resize-none text-sm leading-relaxed"
          placeholder="Start typing your notes..."
          value={content}
          onInput={handleContentChange}
        />
      </div>

      {/* Status and controls */}
      <div class="flex flex-col space-y-2">
        {/* Auto-save toggle and status */}
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center space-x-2">
            <label class="flex items-center space-x-1 cursor-pointer">
              <input
                type="checkbox"
                class="checkbox checkbox-xs"
                checked={autoSave}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setAutoSave(target.checked);
                }}
              />
              <span class="text-base-content/70">Auto-save</span>
            </label>
          </div>
          <span class="text-base-content/50">
            {formatLastSaved()}
          </span>
        </div>

        {/* Action buttons */}
        <div class="flex gap-2">
          <button
            onClick={saveNow}
            class="btn btn-primary btn-xs flex-1"
            disabled={!content.trim()}
          >
            💾 Save Now
          </button>
          
          <button
            onClick={copyContent}
            class="btn btn-outline btn-xs flex-1"
            disabled={!content.trim()}
          >
            📋 Copy
          </button>
          
          <button
            onClick={clearContent}
            class="btn btn-error btn-xs flex-1"
            disabled={!content.trim()}
          >
            🗑️ Clear
          </button>
        </div>

        {/* Character count */}
        <div class="text-xs text-base-content/40 text-center">
          {content.length} characters
        </div>
      </div>
    </div>
  );
};
