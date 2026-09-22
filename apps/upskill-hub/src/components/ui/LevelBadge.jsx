import React from "react";
import { cn } from "../../lib/utils";

const levelConfig = {
  amateur: { className: "bg-muted text-muted-foreground", label: "Amateur" },
  beginner: { className: "bg-secondary text-foreground", label: "Beginner" },
  intermediate: { className: "bg-secondary text-foreground font-medium", label: "Intermediate" },
  professional: { className: "bg-foreground text-primary-foreground font-medium", label: "Professional" },
};

export function LevelBadge({ level = "beginner" }) {
  const clean = (level || "beginner").toLowerCase();
  const config = levelConfig[clean] || levelConfig.beginner;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 border border-border font-mono text-xs rounded-md uppercase tracking-wider",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

export default LevelBadge;
