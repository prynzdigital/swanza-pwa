import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MapLink } from "@/components/ui/MapLink";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatDate, formatTime, getInitials } from "@/lib/utils";
import type { BookingStatus } from "@prisma/client";

// Source: wireframes.md §Page 12 — Booking Tracker

export const metadata = {
  title: "Swanza — Booking Status",
  robots: { index: false, follow: false },
};

// Ordered lifecycle stages for the progress timeline
const LIFECYCLE: BookingStatus[] = [
  "ASSIGNED",
  "ACCEPTED",
  "EN_ROUTE",
  "IN_PROGRESS",
  "COMPLETED",
];

const STATUS_LABELS: Partial<Record<BookingStatus, string>> = {
  ASSIGNED: "Cleaner assigned to your job",
  ACCEPTED: "Cleaner has accepted your job",
  EN_ROUTE: "Cleaner is on the way",
  IN_PROGRESS: "Cleaning in progress",
  COMPLETED: "Job completed",
};

// Status color for timeline dots
const STATUS_COLORS: Partial<Record<BookingStatus, string>> = {
  ASSIGNED: "#6C8EEF",
  ACCEPTED: "#4FC3F7",
  EN_ROUTE: "#F5A623",
  IN_PROGRESS: "#00D9BE",
  COMPLETED: "#4CAF7D",
};

function getStatusIndex(status: BookingStatus): number {
  return LIFECYCLE.indexOf(status);
}

export default async function BookingTrackerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!dbUser) redirect("/sign-in");

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: dbUser.id },
    include: {
      serviceType: true,
      cleaner: { include: { user: true } },
    },
  });

  if (!booking) notFound();

  const currentStatusIndex = getStatusIndex(booking.status);
  const cleanerInitials = booking.cleaner?.user
    ? getInitials(booking.cleaner.user.email.split("@")[0])
    : "?";

  return (
    <AppShell role="customer" pageTitle="Booking Status" showBack>
      <div className="max-w-narrow mx-auto px-4 py-6 space-y-6">
        {/* Booking summary */}
        <section
          className="bg-surface-card border border-surface-divider rounded-lg p-4"
          aria-label="Booking summary"
        >
          <p className="text-display-h4 font-semibold text-text-on-dark mb-1">
            {booking.serviceType.name}
          </p>
          <p className="text-sm text-text-muted-dark mb-1">
            {formatDate(booking.scheduledAt)} &bull;{" "}
            {formatTime(booking.scheduledAt)}
          </p>
          <p className="text-sm text-text-muted-dark mb-2">
            {booking.address}
          </p>
          <p
            className="font-mono text-xs text-text-disabled-dark"
            aria-label={`Booking ID: ${booking.id}`}
          >
            #{booking.id}
          </p>
        </section>

        {/* Live Status Timeline */}
        <section aria-label="Live job status timeline" aria-live="polite">
          <h2 className="text-display-h4 font-semibold text-text-on-dark mb-4">
            Live Status
          </h2>

          <ol className="relative space-y-0" aria-label="Job lifecycle">
            {LIFECYCLE.map((status, i) => {
              const isCompleted = i < currentStatusIndex;
              const isCurrent = i === currentStatusIndex;
              const isFuture = i > currentStatusIndex;

              const dotColor = isFuture
                ? "#252B2B"
                : STATUS_COLORS[status] ?? "#252B2B";

              return (
                <li key={status} className="flex gap-4 min-h-[56px]">
                  {/* Timeline track */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`h-3.5 w-3.5 rounded-full flex-shrink-0 mt-0.5 ${
                        isCurrent ? "animate-ring-pulse" : ""
                      }`}
                      style={{ backgroundColor: dotColor }}
                      aria-hidden="true"
                    />
                    {i < LIFECYCLE.length - 1 && (
                      <span
                        className="w-0.5 flex-1 my-1"
                        style={{
                          backgroundColor: isCompleted
                            ? dotColor
                            : "#252B2B",
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Status content */}
                  <div className="pb-4">
                    <StatusBadge
                      status={status}
                      pulsing={isCurrent}
                      className={isFuture ? "opacity-40" : ""}
                    />
                    <p
                      className={`text-sm mt-1 ${
                        isFuture ? "text-text-disabled-dark" : "text-text-muted-dark"
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Cleaner Info Card — shown when assigned or beyond */}
        {booking.cleaner && currentStatusIndex >= 0 && (
          <section
            className="bg-surface-card border border-surface-divider rounded-lg p-4"
            aria-label="Assigned cleaner information"
          >
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar with initials */}
              <div
                className="h-10 w-10 rounded-full bg-primary-dim border border-primary flex items-center justify-center text-primary text-sm font-semibold"
                aria-label={`Cleaner initials: ${cleanerInitials}`}
              >
                {cleanerInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-on-dark">
                  {booking.cleaner.user.email.split("@")[0]}
                </p>
                <StatusBadge status={booking.status} />
              </div>
            </div>
            <MapLink address={booking.address} />
          </section>
        )}

        {/* Support link */}
        <div className="text-center">
          <Button
            variant="ghost-dark"
            size="default"
            className="w-full"
            aria-label="Contact support about this booking"
          >
            {/* [NEEDS CLIENT INPUT: support contact method — link to email or support form] */}
            Need help? Contact support
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
