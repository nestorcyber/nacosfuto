import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

export const BrutalButton = forwardRef(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium border cursor-pointer rounded-md transition-all duration-200 select-none";

    const variants = {
      default:
        "bg-card text-foreground border-border hover:bg-secondary hover:border-foreground/30",
      primary:
        "bg-foreground text-primary-foreground border-foreground hover:bg-foreground/90",
      outline:
        "bg-transparent text-foreground border-foreground hover:bg-secondary",
      ghost:
        "bg-transparent text-foreground border-transparent hover:bg-secondary",
      success:
        "bg-[hsl(142,72%,45%)] text-white border-transparent hover:bg-[hsl(142,72%,40%)]",
      secondary:
        "bg-secondary text-foreground border-border hover:bg-secondary/70 hover:border-foreground/30",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-2.5 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant] || variants.default,
          sizes[size] || sizes.md,
          "active:scale-[0.98]",
          (disabled || isLoading) && "opacity-50 cursor-not-allowed hover:bg-card",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

BrutalButton.displayName = "BrutalButton";
export default BrutalButton;
