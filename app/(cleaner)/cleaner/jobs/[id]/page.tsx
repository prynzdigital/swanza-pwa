import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriceEstimate } from "@/components/ui/PriceEstimate";
import { MapLink } from "@/components/ui/MapLink";
import { JobActionButtons } from "./JobActionButtons";
import { formatDate, formatTime } from "@/lib/utils";

// Source: wireframes.md §Page 15 — Job Detail + Accept/Reject
// Source: wireframes.md §Page 16 — Active Job / Status Update

export const metadata = {
  title: "Swanza — Job Details",
  robots: { index: false, follow: false },
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { cleanerProfile: true },
  });

  if (!user?.cleanerProfile) redirect("/cleaner/dashboard");

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      cleanerId: user.cleanerProfile.id,
    },
    include: { serviceType: true },
  });

  if (!booking) notFound();

  const payoutAmount = booking.totalAmount * 0.8; // 80% payout to cleaner
  const isActiveJob = ["ACCEPTED", "EN_ROUTE", "IN_PROGRESS"].includes(
    booking.status
  );

  return (
    <AppShell
      role="cleaner"
      pageTitle={isActiveJob ? "Active Job" : "Job Details"}
      showBack
    >
      <div className="max-w-narrow mx-auto px-4 py-6 space-y-6">
        {/* Status badge */}
        <div className="flex items-center gap-3">
          <StatusBadge
            status={booking.status}
            pulsing={isActiveJob}
          />
          {!isActiveJob && (
            <p className="text-sm text-text-muted-dark">New Job Offer</p>
          )}
        </div>

        {/* Job details */}
        <section
          className="bg-surface-card border border-surface-divider rounded-lg p-4 space-y-4"
          aria-label="Job details"
        >
          <h2 className="text-display-h3 font-semibold text-text-on-dark">
            {booking.serviceType.name}
          </h2>

          <dl className="space-y-2">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-muted-dark">Date</dt>
              <dd className="text-sm text-text-on-dark font-medium">
                {formatDate(booking.scheduledAt)} &bull;{" "}
                {formatTime(booking.scheduledAt)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-muted-dark">Est. Duration</dt>
              <dd className="text-sm text-text-on-dark font-medium">
                ~{booking.serviceType.durationHours} hours
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-muted-dark">Bedrooms</dt>
              <dd className="text-sm text-text-on-dark font-medium">
                {booking.bedroomCount}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-text-muted-dark">Bathrooms</dt>
              <dd className="text-sm text-text-on-dark font-medium">
                {booking.bathroomCount}
              </dd>
            </div>
          </dl>

          <div className="border-t border-surface-divider pt-4">
            <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted-dark mb-2">
              Location
            </p>
            <MapLink address={booking.address} />
          </div>

          {booking.notes && (
            <div className="border-t border-surface-divider pt-4">
              <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted-dark mb-2">
                Access Notes
              </p>
              <p className="text-sm text-text-muted-dark">{booking.notes}</p>
            </div>
          )}
        </section>

        {/* Payout display */}
        <PriceEstimate
          label="Your Payout"
          amount={payoutAmount}
          dark
        />

        {/* Action buttons — client component for interactivity */}
        <JobActionButtons
          bookingId={booking.id}
          currentStatus={booking.status}
          cleanerId={user.cleanerProfile.id}
        />
      </div>
    </AppShell>
  );
}
