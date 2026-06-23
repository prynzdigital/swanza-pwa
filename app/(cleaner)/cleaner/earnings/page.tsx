import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

// Source: wireframes.md §Page 17 — Earnings

export const metadata = {
  title: "Swanza — My Earnings",
  robots: { index: false, follow: false },
};

export default async function EarningsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      cleanerProfile: {
        include: {
          bookings: {
            where: { status: "COMPLETED" },
            orderBy: { updatedAt: "desc" },
            include: { serviceType: true },
          },
          payouts: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  if (!user?.cleanerProfile) redirect("/cleaner/dashboard");

  const { cleanerProfile } = user;
  const completedBookings = cleanerProfile.bookings;

  const totalEarnings = completedBookings.reduce(
    (sum, b) => sum + b.totalAmount * 0.8,
    0
  );
  // Pending = no payouts found yet (payouts only created via webhook on transfer.created)
  const pendingPayout = 0; // [TODO: track pending payouts when Stripe Connect is configured]
  void cleanerProfile.payouts; // payouts field reserved for future use

  return (
    <AppShell role="cleaner" pageTitle="My Earnings">
      <div className="max-w-content mx-auto px-4 py-6 space-y-6">
        {/* Earnings Summary Card */}
        <section
          className="bg-surface-card border border-surface-divider rounded-lg p-6"
          aria-label="Earnings summary"
        >
          <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted-dark mb-2">
            Total Earnings
          </p>
          <p className="font-mono text-4xl font-bold text-primary mb-4">
            {formatCurrency(totalEarnings)}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-muted-dark uppercase tracking-wide mb-1">
                This Week
              </p>
              <p className="font-mono text-lg font-semibold text-text-on-dark">
                {formatCurrency(0)}
                {/* [TODO: filter by week] */}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted-dark uppercase tracking-wide mb-1">
                Pending Payout
              </p>
              <p className="font-mono text-lg font-semibold text-text-on-dark">
                {formatCurrency(pendingPayout)}
              </p>
            </div>
          </div>
        </section>

        {/* Earnings List */}
        <section aria-labelledby="earnings-list-heading">
          <h2
            id="earnings-list-heading"
            className="text-display-h4 font-semibold text-text-on-dark mb-4"
          >
            Completed Jobs
          </h2>

          {completedBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <TrendingUp
                className="h-10 w-10 text-text-muted-dark"
                aria-hidden="true"
              />
              <p className="text-base text-text-muted-dark">
                No earnings yet. Complete jobs to see payouts here.
              </p>
            </div>
          ) : (
            <ul className="space-y-0" role="list">
              {completedBookings.map((booking, i) => (
                <li
                  key={booking.id}
                  className={`flex items-center justify-between min-h-[44px] py-3 ${
                    i < completedBookings.length - 1
                      ? "border-b border-surface-divider"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <StatusBadge status="COMPLETED" />
                    <div>
                      <p className="text-sm font-medium text-text-on-dark">
                        {formatDate(booking.updatedAt)} &mdash;{" "}
                        {booking.serviceType.name}
                      </p>
                      <p className="text-xs text-text-muted-dark">
                        {booking.address}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-sm font-semibold text-text-on-dark ml-4 flex-shrink-0">
                    {formatCurrency(booking.totalAmount * 0.8)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Payout info */}
        <p className="text-sm text-text-muted-dark">
          Payouts are processed via Stripe Connect after each completed job.{" "}
          {/* [NEEDS CLIENT INPUT: confirm payout timing — e.g., "Earnings are transferred to your bank account within 2 business days of job completion"] */}
        </p>
      </div>
    </AppShell>
  );
}
