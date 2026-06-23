"use client";

import * as React from "react";
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";
import type { BookingStatus } from "@prisma/client";

// Source: design-system.md §BookingCard — Customer app, dark shell context

interface BookingCardProps {
  bookingId: string;
  status: BookingStatus;
  serviceType: string;
  cleanerName?: string;
  address: string;
  scheduledAt: Date | string;
  totalAmount: number;
  onViewDetails?: (id: string) => void;
  className?: string;
}

// Active statuses show a colored left border indicator
const ACTIVE_STATUSES: BookingStatus[] = [
  "ASSIGNED",
  "ACCEPTED",
  "EN_ROUTE",
  "IN_PROGRESS",
];

const ACTIVE_STATUS_BORDER: Partial<Record<BookingStatus, string>> = {
  ASSIGNED: "border-l-4 border-l-status-assigned",
  ACCEPTED: "border-l-4 border-l-status-accepted",
  EN_ROUTE: "border-l-4 border-l-status-en-route",
  IN_PROGRESS: "border-l-4 border-l-status-in-progress",
};

export function BookingCard({
  bookingId,
  status,
  serviceType,
  cleanerName,
  address,
  scheduledAt,
  totalAmount,
  onViewDetails,
  className,
}: BookingCardProps) {
  const date = typeof scheduledAt === "string" ? new Date(scheduledAt) : scheduledAt;
  const isActive = ACTIVE_STATUSES.includes(status);
  const borderClass = isActive ? ACTIVE_STATUS_BORDER[status] : "";

  return (
    <article
      className={cn(
        "rounded-lg bg-surface-card border border-surface-divider p-4 transition-all duration-150",
        "hover:bg-surface-card-hover",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-app",
        borderClass,
        isActive && "overflow-hidden",
        className
      )}
    >
      {/* Top row: status + date */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <StatusBadge status={status} />
        <time
          dateTime={date.toISOString()}
          className="text-xs text-text-muted-dark"
        >
          {formatDate(date)}
        </time>
      </div>

      {/* Service type */}
      <h4 className="text-display-h4 font-semibold text-text-on-dark mb-1">
        {serviceType}
      </h4>

      {/* Cleaner name */}
      {cleanerName && (
        <p className="text-sm text-text-muted-dark mb-1">{cleanerName}</p>
      )}

      {/* Address */}
      <p className="text-sm text-text-muted-dark mb-3">{address}</p>

      {/* Price — monospace */}
      <p className="font-mono text-lg font-semibold text-text-on-dark mb-4">
        {formatCurrency(totalAmount)}
      </p>

      <Button
        variant="ghost-dark"
        size="sm"
        onClick={() => onViewDetails?.(bookingId)}
        aria-label={`View details for ${serviceType} booking on ${formatDate(date)}`}
      >
        View Details
      </Button>
    </article>
  );
}
