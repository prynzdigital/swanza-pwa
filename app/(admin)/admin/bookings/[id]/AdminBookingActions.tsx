"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { BookingStatus } from "@prisma/client";

// Source: wireframes.md §Page 19 — Assign Cleaner Modal + Admin Override
// Admin can: (1) assign cleaner to any booking, (2) override booking status

interface AdminBookingActionsProps {
  booking: {
    id: string;
    status: BookingStatus;
    cleanerId: string | null;
    cleanerEmail: string | null;
  };
  approvedCleaners: Array<{
    id: string;
    email: string;
    name: string | null;
  }>;
}

export function AdminBookingActions({
  booking,
  approvedCleaners,
}: AdminBookingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCleanerId, setSelectedCleanerId] = useState(
    booking.cleanerId ?? ""
  );
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(
    booking.status
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"assign" | "override" | null>(null);

  const handleAssign = async () => {
    if (!selectedCleanerId) return;
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/bookings/${booking.id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cleanerId: selectedCleanerId }),
    });

    if (!response.ok) {
      const data = await response.json() as { error?: string };
      setError(data.error ?? "Assignment failed.");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
    setShowConfirm(false);
  };

  const handleOverride = async () => {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selectedStatus, adminOverride: true }),
    });

    if (!response.ok) {
      const data = await response.json() as { error?: string };
      setError(data.error ?? "Override failed.");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
    setShowConfirm(false);
  };

  const ALL_STATUSES: BookingStatus[] = [
    "ASSIGNED",
    "ACCEPTED",
    "EN_ROUTE",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

  return (
    <section className="space-y-6" aria-label="Admin actions">
      <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted-dark">
        Admin Actions
      </p>

      {/* Assign Cleaner */}
      <div className="bg-surface-card border border-surface-divider rounded-lg p-4 space-y-3">
        <p className="text-sm font-semibold text-text-on-dark">
          {booking.cleanerId ? "Reassign Cleaner" : "Assign Cleaner"}
        </p>
        {booking.cleanerEmail && (
          <p className="text-xs text-text-muted-dark">
            Current: {booking.cleanerEmail}
          </p>
        )}
        <div>
          <label htmlFor="cleaner-select" className="sr-only">
            Select cleaner
          </label>
          <select
            id="cleaner-select"
            value={selectedCleanerId}
            onChange={(e) => setSelectedCleanerId(e.target.value)}
            className="w-full min-h-[44px] px-3 py-2 rounded-md border border-border bg-surface-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            <option value="">Select a cleaner...</option>
            {approvedCleaners.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name ?? c.email}
              </option>
            ))}
          </select>
        </div>
        {showConfirm && confirmAction === "assign" ? (
          <div className="space-y-2">
            <p className="text-sm text-text-muted-dark">
              Are you sure you want to assign this job to{" "}
              <strong className="text-text-on-dark">
                {approvedCleaners.find((c) => c.id === selectedCleanerId)?.email}
              </strong>
              ?
            </p>
            <div className="flex gap-2">
              <Button
                variant="primary-dark"
                size="sm"
                onClick={handleAssign}
                loading={loading}
              >
                Confirm
              </Button>
              <Button
                variant="ghost-dark"
                size="sm"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="primary-dark"
            size="sm"
            onClick={() => { setConfirmAction("assign"); setShowConfirm(true); }}
            disabled={!selectedCleanerId}
          >
            {booking.cleanerId ? "Reassign" : "Assign"}
          </Button>
        )}
      </div>

      {/* Status Override */}
      <div className="bg-surface-card border border-surface-divider rounded-lg p-4 space-y-3">
        <p className="text-sm font-semibold text-text-on-dark">
          Override Status
        </p>
        <div>
          <label htmlFor="status-override" className="sr-only">
            Override status
          </label>
          <select
            id="status-override"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as BookingStatus)}
            className="w-full min-h-[44px] px-3 py-2 rounded-md border border-border bg-surface-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        {showConfirm && confirmAction === "override" ? (
          <div className="space-y-2">
            <p className="text-sm text-text-muted-dark">
              Override status to{" "}
              <strong className="text-text-on-dark">{selectedStatus}</strong>?
              This bypasses normal lifecycle validation.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleOverride}
                loading={loading}
              >
                Override
              </Button>
              <Button
                variant="ghost-dark"
                size="sm"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="secondary-dark"
            size="sm"
            onClick={() => { setConfirmAction("override"); setShowConfirm(true); }}
            disabled={selectedStatus === booking.status}
          >
            Override Status
          </Button>
        )}
      </div>

      {error && (
        <div role="alert" className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </div>
      )}
    </section>
  );
}
