import React from "react";
import { BrutalCard } from "../ui/BrutalCard";

export function CourseLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 animate-pulse">
      {/* Skeleton Banner */}
      <div className="h-24 bg-muted/60 rounded-md border border-border"></div>

      {/* Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <BrutalCard key={i} className="space-y-3">
            <div className="aspect-video bg-muted/70 rounded-md"></div>
            <div className="h-4 bg-muted/80 rounded w-3/4"></div>
            <div className="h-3 bg-muted/50 rounded w-1/2"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-muted/60 rounded"></div>
              <div className="h-6 w-20 bg-muted/60 rounded"></div>
            </div>
          </BrutalCard>
        ))}
      </div>
    </div>
  );
}

export default CourseLoading;
