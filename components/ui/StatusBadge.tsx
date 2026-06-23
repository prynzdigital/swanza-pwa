import * as React from "react";
import { cn } from "@/lib/utils";
import type { BookingStatus } from "@prisma/client";

// ── Status Badge ─────────────────────────────────────────────────────────────
// Source: design-system.md §StatusBadge
// MANDATORY: Label text ALWAYS accompanies color. Never color alone (WCAG 1.4.1).
// All 5 job lifecycle variants implemented.

interface StatusConfig {
  label: string;
  chipBg: string;
  labelColor: string;
  dotColor: string;
}

const STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    chipBg: "#1A1D1D",
    labelColor: "#8A9B9B",
    dotColor: "#445252",
  },
  // QA fix #008: new intermediate status — paid but awaiting cleaner assignment
  PAYMENT_CONFIRMED: {
    label: "Payment Confirmed",
    chipBg: "#0D1A2E",
    labelColor: "#93C5FD",
    dotColor: "#3B82F6",
  },
  ASSIGNED: {
    label: "Assigned",
    chipBg: "#1A2040",
    labelColor: "#B8C8FF",
    dotColor: "#6C8EEF",
  },
  ACCEPTED: {
    label: "Accepted",
    chipBg: "#0A2535",
    labelColor: "#B0E8FF",
    dotColor: "#4FC3F7",
  },
  EN_ROUTE: {
    label: "En Route",
    chipBg: "#2A1C00",
    labelColor: "#FFD580",
    dotColor: "#F5A623",
  },
  IN_PROGRESS: {
    label: "In Progress",
    chipBg: "#00312C",
    labelColor: "#80EDE4",
    dotColor: "#00D9BE",
  },
  COMPLETED: {
    label: "Completed",
    chipBg: "#0A2018",
    labelColor: "#A8E6C2",
    dotColor: "#4CAF7D",
  },
  CANCELLED: {
    label: "Cancelled",
    chipBg: "#2A1010",
    labelColor: "#FFAAAA",
    dotColor: "#FF4D4D",
  },
};

interface StatusBadgeProps {
  status: BookingStatus;
  className?: string;
  /** Show pulsing animation on current active status */
  pulsing?: boolean;
  /** Interactive variant — adds hover border */
  interactive?: boolean;
}

export function StatusBadge({
  status,
  className,
  pulsing = false,
  interactive = false,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      aria-label={`Job status: ${config.label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 min-h-7 text-[13px] font-medium transition-all",
        interactive && "hover:ring-1 cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-offset-1",
        className
      )}
      style={{
        backgroundColor: config.chipBg,
        color: config.labelColor,
      }}
    >
      {/* Color dot — paired with label text per WCAG 1.4.1 */}
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full flex-shrink-0",
          pulsing && "animate-ring-pulse"
        )}
        style={{ backgroundColor: config.dotColor }}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };
export type { StatusConfig };
