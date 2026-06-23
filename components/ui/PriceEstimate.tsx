import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

// Source: design-system.md §PriceEstimate
// Used in: booking flow Step 3 (light context), JobCard cleaner payout view (dark context)

interface PriceBreakdownRow {
  label: string;
  value: string;
}

interface PriceEstimateProps {
  label?: string;
  amount: number | null; // null = loading state
  breakdown?: PriceBreakdownRow[];
  confirmed?: boolean;
  dark?: boolean;
  className?: string;
}

export function PriceEstimate({
  label = "Your Price",
  amount,
  breakdown,
  confirmed = false,
  dark = false,
  className,
}: PriceEstimateProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-6",
        dark ? "bg-surface-card border border-surface-divider" : "bg-surface-white border border-border",
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Label */}
      <p
        className={cn(
          "text-[13px] font-medium uppercase tracking-wide mb-2",
          dark ? "text-text-muted-dark" : "text-text-muted"
        )}
      >
        {label}
      </p>

      {/* Amount — loading or actual value */}
      {amount === null ? (
        // Skeleton shimmer — matches design-system.md §Skeleton Screen Treatment
        <div className="space-y-2">
          <div className="skeleton-shimmer h-10 w-32 rounded-md" />
          <div className="skeleton-shimmer h-4 w-48 rounded-md" />
          <div className="skeleton-shimmer h-4 w-40 rounded-md" />
        </div>
      ) : (
        <>
          {/* Price — JetBrains Mono 32px per design spec */}
          <p
            className={cn(
              "font-mono text-4xl font-semibold mb-4 tracking-tight",
              dark ? "text-primary" : "text-text-primary"
            )}
          >
            {formatCurrency(amount)}
          </p>

          {/* Breakdown rows */}
          {breakdown && breakdown.length > 0 && (
            <dl className="space-y-1 mb-4">
              {breakdown.map((row, i) => (
                <div key={i} className="flex justify-between items-center">
                  <dt
                    className={cn(
                      "font-mono text-sm",
                      dark ? "text-text-muted-dark" : "text-text-muted"
                    )}
                  >
                    {row.label}
                  </dt>
                  <dd
                    className={cn(
                      "font-mono text-sm font-medium",
                      dark ? "text-text-on-dark" : "text-text-primary"
                    )}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Confirmed state note */}
          <div
            className={cn(
              "flex items-center gap-1.5 text-[13px] mt-2",
              confirmed ? "text-status-completed" : dark ? "text-text-muted-dark" : "text-text-muted"
            )}
          >
            {confirmed && (
              <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            )}
            <span>
              {confirmed
                ? "Price locked at confirmation. No post-job charges."
                : "Price calculated at booking. No hidden fees."}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
