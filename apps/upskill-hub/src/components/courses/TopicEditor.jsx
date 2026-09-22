import React, { useState } from "react";
import { Plus, PlayCircle, X, Search, Sparkles, Loader2, Edit3 } from "lucide-react";
import { BrutalCard } from "../ui/BrutalCard";
import { BrutalButton } from "../ui/BrutalButton";

export function TopicEditor({
  currentTopic,
  editIndex = null,
  isSearchingVideo = false,
  isGeneratingSummary = false,
  onUpdateField,
  onGenerateSummary,
  onSaveTopic,
  onCancelEdit,
}) {
  const [showPreview, setShowPreview] = useState(false);

  const cleanVideoId = (input) => {
    let id = input || "";
    if (id.includes("v=")) id = id.split("v=")[1].split("&")[0];
    if (id.includes("youtu.be/")) id = id.split("youtu.be/")[1].split("?")[0];
    return id.substring(0, 11);
  };

  const videoId = cleanVideoId(currentTopic.video_url);

  return (
    <BrutalCard
      className={`border-dashed border-2 border-border transition-colors ${
        editIndex !== null ? "bg-amber-500/5 border-amber-500/50" : "bg-card"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-foreground font-mono">
          {editIndex !== null ? (
            <>
              <Edit3 size={15} className="text-amber-500" />
              <span>Editing Lesson #{editIndex + 1}</span>
            </>
          ) : (
            <>
              <Plus size={15} className="text-[#138601]" />
              <span>Add Custom Lesson Module</span>
            </>
          )}
        </h3>

        <div className="flex items-center gap-2">
          {currentTopic.video_url && (
            <BrutalButton
              size="sm"
              variant="outline"
              disabled={!videoId}
              onClick={() => setShowPreview(true)}
              title="Preview Video"
            >
              <PlayCircle size={14} className="mr-1.5" />
              <span className="text-xs">Preview</span>
            </BrutalButton>
          )}

          {editIndex !== null && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider mb-1 block text-muted-foreground">
            Lesson Title *
          </label>
          <input
            type="text"
            value={currentTopic.title || ""}
            onChange={(e) => onUpdateField("title", e.target.value)}
            placeholder="e.g. Understanding React Hooks & State"
            className="w-full px-3 py-2 text-sm border border-border bg-background rounded-md outline-none focus:border-foreground"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider mb-1 block text-muted-foreground">
            YouTube Video ID / URL *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentTopic.video_url || ""}
              onChange={(e) => onUpdateField("video_url", e.target.value)}
              placeholder="e.g. dQw4w9WgXcQ or YouTube URL"
              className="w-full px-3 py-2 text-sm border border-border bg-background rounded-md outline-none focus:border-foreground font-mono"
            />
            {videoId && (
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-3 py-2 rounded-md bg-secondary border border-border hover:bg-muted text-xs font-semibold cursor-pointer shrink-0"
              >
                Test
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-1 block text-muted-foreground">
              Duration
            </label>
            <input
              type="text"
              value={currentTopic.duration || ""}
              onChange={(e) => onUpdateField("duration", e.target.value)}
              placeholder="e.g. 15:30"
              className="w-full px-3 py-2 text-sm border border-border bg-background rounded-md outline-none focus:border-foreground font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider mb-1 block text-muted-foreground">
              Start (Secs)
            </label>
            <input
              type="number"
              value={currentTopic.start_playing_at ?? 0}
              onChange={(e) => onUpdateField("start_playing_at", Number(e.target.value))}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-border bg-background rounded-md outline-none focus:border-foreground font-mono"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Lesson Study Notes & Summary
          </label>
          <button
            type="button"
            onClick={onGenerateSummary}
            disabled={isGeneratingSummary || !currentTopic.title}
            className="text-xs flex items-center gap-1 text-[#138601] hover:underline font-semibold cursor-pointer disabled:opacity-50"
          >
            {isGeneratingSummary ? (
              <Loader2 className="animate-spin" size={12} />
            ) : (
              <Sparkles size={12} />
            )}
            <span>AI Draft Notes</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={currentTopic.summary_text || ""}
          onChange={(e) => onUpdateField("summary_text", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border bg-background rounded-md outline-none focus:border-foreground resize-none leading-relaxed"
          placeholder="Detailed explanation, code syntax, and concepts taught in this module..."
        />
      </div>

      <BrutalButton
        className="w-full"
        variant="primary"
        disabled={!currentTopic.title?.trim()}
        onClick={onSaveTopic}
      >
        {editIndex !== null ? "Update Lesson Module" : "Save Lesson to Curriculum"}
      </BrutalButton>

      {/* Video Preview Modal */}
      {showPreview && videoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <PlayCircle size={16} className="text-[#138601]" />
                <span>Video Preview Test</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?start=${currentTopic.start_playing_at || 0}&autoplay=1`}
                title="Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="text-xs font-mono text-muted-foreground flex justify-between">
              <span>Video ID: {videoId}</span>
              <span>Start offset: {currentTopic.start_playing_at || 0}s</span>
            </div>
          </div>
        </div>
      )}
    </BrutalCard>
  );
}

export default TopicEditor;
