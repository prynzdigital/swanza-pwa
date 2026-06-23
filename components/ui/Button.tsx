"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// ── Button variants ─────────────────────────────────────────────────────────
// Source: design-system.md §Component Inventory — Button/Primary, Button/Primary-Dark,
// Button/Secondary, Button/Ghost, Button/Destructive
const buttonVariants = cva(
  // Base styles: minimum 44×44px touch target, rounded-sm (6px), font-semibold
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold ring-offset-surface-app transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 min-h-[44px] min-w-[44px] select-none",
  {
    variants: {
      variant: {
        // Button/Primary — light pages. bg primary-light, white text. Contrast 4.5:1 ✓
        default:
          "bg-primary-light text-white hover:bg-primary-light-hover active:bg-[#00665C] active:scale-[0.98] focus-visible:ring-primary-light disabled:bg-[#CBD5D5] disabled:text-text-muted",
        // Button/Primary-Dark — dark shell. bg primary (#00D9BE), DARK text (#0D0F0F). Contrast 10.3:1 ✓
        // CRITICAL: Never white text on teal — 1.7:1 WCAG fail (design-system.md §WCAG)
        "primary-dark":
          "bg-primary text-[#0D0F0F] hover:bg-primary-hover active:bg-[#009E8C] active:scale-[0.98] focus-visible:ring-primary focus-visible:ring-offset-surface-app disabled:bg-surface-card disabled:text-text-disabled-dark",
        // Button/Secondary — outline, adapts to context
        secondary:
          "border border-border bg-transparent text-text-primary hover:border-primary-light hover:text-primary-light active:bg-surface-section-alt focus-visible:ring-primary-light disabled:border-border/50 disabled:text-text-muted",
        // Button/Secondary in dark context
        "secondary-dark":
          "border border-surface-divider bg-transparent text-text-on-dark hover:border-primary hover:text-primary active:bg-surface-card-hover focus-visible:ring-primary focus-visible:ring-offset-surface-app disabled:border-surface-divider/50 disabled:text-text-disabled-dark",
        // Button/Ghost — no border
        ghost:
          "bg-transparent text-text-primary hover:bg-surface-section-alt active:bg-[#E8ECEC] focus-visible:ring-primary-light disabled:text-text-muted",
        // Button/Ghost in dark context
        "ghost-dark":
          "bg-transparent text-text-on-dark hover:bg-surface-card active:bg-surface-card-hover focus-visible:ring-primary focus-visible:ring-offset-surface-app disabled:text-text-disabled-dark",
        // Button/Destructive
        destructive:
          "bg-destructive text-white hover:bg-destructive-hover active:bg-[#CC2929] active:scale-[0.98] focus-visible:ring-destructive disabled:bg-destructive/50",
        // Link-style button
        link: "text-primary-light underline-offset-4 hover:underline focus-visible:ring-primary-light min-h-0 min-w-0",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        icon: "h-11 w-11 p-0",
        "icon-sm": "h-9 w-9 p-0",
        full: "h-11 w-full px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>{loadingText ?? "Loading..."}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
