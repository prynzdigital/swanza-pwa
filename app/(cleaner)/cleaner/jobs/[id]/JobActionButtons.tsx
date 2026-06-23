"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriceEstimate } from "@/components/ui/PriceEstimate";
import { getNextStatusActionLabel } from "@/lib/booking-logic";
import type { BookingStatus } from "@prisma/client";

// Source: wireframes.md §Page 15 + 16 — Job action buttons (client component)
// Rule: One button shown at a time based on current status. Prevents accidental multi-skip.

interface JobActionButtonsProps {
  bookingId: string;
  currentStatus: BookingStatus;
  cleanerId: string;
}

export function JobActionButtons({
  bookingId,
  currentStatus,
  cleanerId: _cleanerId, // reserved for future use
}: JobActionButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<BookingStatus>(currentStatus);
  const [completed, setCompleted] = useState(false);

  const nextActionLabel = getNextStatusActionLabel(status);

  const updateStatus = async (targetStatus: BookingStatus) => {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: targetStatus }),
    });

    if (!response.ok) {
      const data = await response.json() as { error?: string };
      setError(data.error ?? "Failed to update status. Please try again.");
      setLoading(false);
      return;
    }

    setStatus(targetStatus);
    setLoading(false);

    if (targetStatus === "COMPLETED") {
      setCompleted(true);
    }
  };

  const handleAccept = () => updateStatus("ACCEPTED");
  const handleDecline = () => {
    router.push("/cleaner/dashboard");
  };
  const handleNextStatus = () => {
    const statusMap: Partial<Record<BookingStatus, BookingStatus>> = {
      ACCEPTED: "EN_ROUTE",
      EN_ROUTE: "IN_PROGRESS",
      IN_PROGRESS: "COMPLETED",
    };
    const next = statusMap[status];
    if (next) void updateStatus(next);
  };

  // Completed state
  if (completed) {
    return (
      <div className="space-y-4 text-center">
        <StatusBadge status="COMPLETED" />
        <h3 className="text-display-h3 font-semibold text-text-on-dark">
          Job Completed
        </h3>
        <p className="text-sm text-text-muted-dark">
          Payout will be processed automatically.
        </p>
        <Button
          variant="ghost-dark"
          size="full"
          onClick={() => router.push("/cleaner/dashboard")}
        >
          &larr; Back to Jobs
        </Button>
      </div>
    );
  }

  // ASSIGNED — show Accept + Decline
  if (status === "ASSIGNED") {
    return (
      <div className="space-y-3">
        {error && (
          <div role="alert" className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <Button
          variant="primary-dark"
          size="full"
          onClick={handleAccept}
          loading={loading}
          loadingText="Accepting..."
        >
          Accept Job
        </Button>
        <Button
          variant="destructive"
          size="full"
          onClick={handleDecline}
          disabled={loading}
        >
          Decline
        </Button>
      </div>
    );
  }

  // Active job — show single next-step button
  if (nextActionLabel) {
    return (
      <div className="space-y-3">
        <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted-dark">
          Update Job Status
        </p>
        {error && (
          <div role="alert" className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        <Button
          variant="primary-dark"
          size="full"
          onClick={handleNextStatus}
          loading={loading}
          loadingText="Updating..."
        >
          {nextActionLabel} &rarr;
        </Button>
      </div>
    );
  }

  return null;
}
