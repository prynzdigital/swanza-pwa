import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-light/10 text-primary-light",
        secondary:
          "border-transparent bg-surface-section-alt text-text-secondary",
        destructive:
          "border-transparent bg-destructive/10 text-destructive",
        outline: "border-border text-text-primary",
        warning:
          "border-transparent bg-warning/20 text-[#7A4A00]",
        success:
          "border-transparent bg-status-completed/20 text-status-completed",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
