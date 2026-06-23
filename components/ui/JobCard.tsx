"use client";

import * as React from "react";
import { cn, formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";
import { MapPin } from "lucide-react";
import type { BookingStatus } from "@prisma/client";

// Source: design-system.md §JobCard — Cleaner app, dark shell context

interface JobCardProps {
  jobId: string;
  status: BookingStatus;
  serviceType: string;
  address: string;
  scheduledAt: Date | string;
  payoutAmount: number;
  distanceMiles?: number;
  isNew?: boolean;
  onViewJob?: (id: string) => void;
  onSkip?: (id: string) => void;
  className?: string;
}

export function JobCard({
  jobId,
  status,
  serviceType,
  address,
  scheduledAt,
  payoutAmount,
  distanceMiles,
  isNew = false,
  onViewJob,
  onSkip,
  className,
}: JobCardProps) {
  const date = typeof scheduledAt === "string" ? new Date(scheduledAt) : scheduledAt;

  return (
    <article
      className={cn(
        "relative rounded-lg bg-surface-card border border-surface-divider p-4 transition-all duration-150",
        "hover:bg-surface-card-hover hover:border-primary-dim",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-app",
        className
      )}
    >
      {/* New job indicator dot */}
      {isNew && (
        <span
          aria-label="New job"
          className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-primary"
        />
      )}

      {/* Top row: status + distance */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <StatusBadge status={status} />
        {distanceMiles !== undefined && (
          <span className="flex items-center gap-1 text-xs text-text-muted-dark">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {distanceMiles.toFixed(1)} mi
          </span>
        )}
      </div>

      {/* Service type */}
      <h4 className="text-display-h4 font-semibold text-text-on-dark mb-1">
        {serviceType}
      </h4>

      {/* Address */}
      <p className="text-sm text-text-muted-dark mb-1">{address}</p>

      {/* Date and time */}
      <p className="text-sm text-text-on-dark mb-4">
        {formatDate(date)} &bull; {formatTime(date)}
      </p>

      {/* Payout — monospace as per design-system.md */}
      <p className="font-mono text-2xl font-semibold text-primary mb-4">
        {formatCurrency(payoutAmount)}
      </p>

      {/* Action buttons — minimum 44×44px, 8px gap */}
      <div className="flex gap-2">
        <Button
          variant="primary-dark"
          size="default"
          className="flex-1"
          onClick={() => onViewJob?.(jobId)}
          aria-label={`View job details for ${serviceType} on ${formatDate(date)}`}
        >
          View Job
        </Button>
        {onSkip && (
          <Button
            variant="ghost-dark"
            size="default"
            className="flex-1"
            onClick={() => onSkip(jobId)}
            aria-label={`Skip this job`}
          >
            Skip
          </Button>
        )}
      </div>
    </article>
  );
}
