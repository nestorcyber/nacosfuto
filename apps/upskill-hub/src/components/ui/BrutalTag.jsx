import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const BrutalTag = forwardRef(
  (
    {
      className,
      variant = "default",
      interactive = false,
      selected = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "bg-secondary border-border text-foreground",
      active: "bg-foreground border-foreground text-primary-foreground",
      muted: "bg-muted border-border text-muted-foreground",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 border font-mono text-xs rounded-md transition-all duration-150 select-none",
          variants[variant] || variants.default,
          interactive && "cursor-pointer hover:border-foreground/60",
          selected && "bg-foreground text-primary-foreground border-foreground font-semibold",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

BrutalTag.displayName = "BrutalTag";
export default BrutalTag;
