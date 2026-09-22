import React, { useState } from "react";
import { Check, ArrowLeft, Clock } from "lucide-react";
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

  // Extract clean YouTube video ID from URL or raw ID
  const videoId = React.useMemo(() => {
    if (!topic?.video_url) return "W6NZfCO5SIk";
    const str = String(topic.video_url).trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
    const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : "W6NZfCO5SIk";
  }, [topic?.video_url]);

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

      {/* Video Container - Fitted full frame 16:9 aspect ratio */}
      <BrutalCard className="p-0 overflow-hidden border border-border shadow-md bg-black">
        <div className="w-full aspect-video relative bg-black">
          <iframe
            key={`${videoId}-${startSeconds}`}
            src={`https://www.youtube.com/embed/${videoId}?start=${startSeconds}&autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
            title={topic.title}
            className="w-full h-full border-0 block"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="eager"
          />
        </div>
      </BrutalCard>

      {/* Lesson Details */}
      <BrutalCard className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-[#0056D2] font-semibold">
                Lesson #{topic.order_index || 1}
              </span>
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
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-[#0056D2] text-white rounded">
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
