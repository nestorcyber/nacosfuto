import React, { useState } from "react";
import { Check, ArrowLeft, Clock, Sparkles } from "lucide-react";
import { BrutalButton } from "../ui/BrutalButton";
import { BrutalCard } from "../ui/BrutalCard";

export function CoursePlayer({
  topic,
  isCompleted = false,
  onMarkComplete,
  onBack,
}) {
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkComplete = async () => {
    setIsMarking(true);
    try {
      await onMarkComplete();
    } finally {
      setIsMarking(false);
    }
  };

  const startSeconds = Math.max(0, Math.floor(Number(topic.start_playing_at) || 0));

  return (
    <div className="space-y-6">
      {/* Back to syllabus button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Back to Course Outline</span>
      </button>

      {/* Video Container */}
      <BrutalCard className="p-0 overflow-hidden border border-border shadow-md">
        <div className="aspect-video w-full bg-black">
          <iframe
            key={`${topic.video_url}-${startSeconds}`}
            src={`https://www.youtube.com/embed/${topic.video_url}?start=${startSeconds}&autoplay=1`}
            title={topic.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </BrutalCard>

      {/* Lesson Details */}
      <BrutalCard className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#138601] font-semibold">
                Lesson #{topic.order_index || 1}
              </span>
              {topic.is_ai_generated && (
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono bg-foreground text-primary-foreground rounded">
                  <Sparkles size={10} className="mr-1" />
                  AI Curated
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {topic.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded">
              <Clock size={13} />
              <span>{topic.duration || "15:00"}</span>
            </span>

            {isCompleted ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-[#138601] text-white rounded">
                <Check size={14} />
                <span>Completed</span>
              </span>
            ) : (
              <BrutalButton
                variant="success"
                size="sm"
                onClick={handleMarkComplete}
                isLoading={isMarking}
              >
                <Check size={14} className="mr-1.5" />
                <span>Mark as Complete</span>
              </BrutalButton>
            )}
          </div>
        </div>

        <div className="h-px bg-border my-2" />

        {/* Written Lesson Summary & Concepts */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
            Lesson Notes & Study Guide
          </h2>
          <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line bg-secondary/30 p-4 rounded-md border border-border/60">
            {topic.summary_text || "No written notes available for this module."}
          </div>
        </div>
      </BrutalCard>
    </div>
  );
}

export default CoursePlayer;
