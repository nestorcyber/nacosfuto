import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const BrutalCard = forwardRef(
  ({ className, interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card border border-border p-4 rounded-md transition-all duration-200",
          interactive &&
            "hover:border-foreground/40 hover:shadow-sm cursor-pointer active:scale-[0.99]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BrutalCard.displayName = "BrutalCard";
export default BrutalCard;
