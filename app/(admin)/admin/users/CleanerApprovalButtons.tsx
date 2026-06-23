"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { CleanerStatus } from "@prisma/client";

interface CleanerApprovalButtonsProps {
  cleanerId: string;
  currentStatus: CleanerStatus;
}

export function CleanerApprovalButtons({
  cleanerId,
  currentStatus,
}: CleanerApprovalButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (newStatus: CleanerStatus) => {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/cleaners/${cleanerId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      const data = await response.json() as { error?: string };
      setError(data.error ?? "Update failed.");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {currentStatus === "PENDING" && (
        <>
          <Button
            variant="primary-dark"
            size="sm"
            onClick={() => void updateStatus("APPROVED")}
            loading={loading}
            loadingText="..."
            aria-label="Approve cleaner"
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => void updateStatus("SUSPENDED")}
            disabled={loading}
            aria-label="Suspend cleaner"
          >
            Suspend
          </Button>
        </>
      )}
      {currentStatus === "APPROVED" && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => void updateStatus("SUSPENDED")}
          loading={loading}
          aria-label="Suspend cleaner"
        >
          Suspend
        </Button>
      )}
      {currentStatus === "SUSPENDED" && (
        <Button
          variant="secondary-dark"
          size="sm"
          onClick={() => void updateStatus("APPROVED")}
          loading={loading}
          aria-label="Reinstate cleaner"
        >
          Reinstate
        </Button>
      )}
      {error && (
        <p className="text-xs text-destructive w-full" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
