import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { BookingStatus } from "@prisma/client";

// Source: wireframes.md §Page 18 — Admin Dashboard / Overview

export const metadata = {
  title: "Swanza Admin — Dashboard",
  robots: { index: false, follow: false },
};

const STATUS_TILE_STYLES: Record<string, string> = {
  ASSIGNED: "#1A2040",
  ACCEPTED: "#0A2535",
  EN_ROUTE: "#2A1C00",
  IN_PROGRESS: "#00312C",
  COMPLETED: "#0A2018",
};

const STATUS_TILE_TEXT: Record<string, string> = {
  ASSIGNED: "#B8C8FF",
  ACCEPTED: "#B0E8FF",
  EN_ROUTE: "#FFD580",
  IN_PROGRESS: "#80EDE4",
  COMPLETED: "#A8E6C2",
};

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch status counts
  const statusCounts = await prisma.booking.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  // Recent bookings
  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      serviceType: true,
      customer: true,
      cleaner: { include: { user: true } },
    },
  });

  const unassignedCount = statusCounts.find(
    (s) => s.status === "ASSIGNED" && !s._count
  )?._count.id ?? 0;

  const statusMap = Object.fromEntries(
    statusCounts.map((s) => [s.status, s._count.id])
  ) as Record<BookingStatus, number>;

  const DISPLAYED_STATUSES: BookingStatus[] = [
    "ASSIGNED",
    "ACCEPTED",
    "EN_ROUTE",
    "IN_PROGRESS",
    "COMPLETED",
  ];

  return (
    <AppShell role="admin" pageTitle="Operations Overview">
      <div className="max-w-content mx-auto px-4 py-6 space-y-8">
        {/* Overview header */}
        <div>
          <h1 className="text-mobile-h2 font-bold text-text-on-dark">
            Operations Overview
          </h1>
          <p className="text-sm text-text-muted-dark">
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Unassigned alert */}
        {unassignedCount > 0 && (
          <div
            className="bg-warning/20 border border-warning/50 rounded-lg p-4 flex items-center justify-between gap-4"
            role="alert"
          >
            <p className="text-sm font-semibold text-warning">
              {unassignedCount} booking
              {unassignedCount !== 1 ? "s" : ""} awaiting cleaner assignment
            </p>
            <Button asChild variant="primary-dark" size="sm">
              <Link href="/admin/bookings">Assign Now</Link>
            </Button>
          </div>
        )}

        {/* Status Count Tiles */}
        <section aria-labelledby="status-tiles-heading">
          <h2 id="status-tiles-heading" className="sr-only">
            Job status overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {DISPLAYED_STATUSES.map((s) => (
              <div
                key={s}
                className="rounded-lg p-4 text-center"
                style={{
                  backgroundColor: STATUS_TILE_STYLES[s],
                  color: STATUS_TILE_TEXT[s],
                }}
                role="status"
                aria-label={`${s.replace("_", " ")}: ${statusMap[s] ?? 0} jobs`}
              >
                <StatusBadge status={s} />
                <p className="font-mono text-3xl font-bold mt-2">
                  {statusMap[s] ?? 0}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Bookings */}
        <section aria-labelledby="recent-bookings-admin-heading">
          <div className="flex items-center justify-between mb-4">
            <h2
              id="recent-bookings-admin-heading"
              className="text-display-h3 font-semibold text-text-on-dark"
            >
              Recent Bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              View All →
            </Link>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm" aria-label="Recent bookings">
              <thead>
                <tr className="border-b border-surface-divider">
                  {["Booking ID", "Service", "Date", "Customer", "Cleaner", "Status", "Amount"].map((col) => (
                    <th
                      key={col}
                      className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-text-muted-dark"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-surface-divider hover:bg-surface-card-hover transition-colors"
                  >
                    <td className="px-3 py-3 font-mono text-xs text-text-muted-dark">
                      #{b.id.slice(-8)}
                    </td>
                    <td className="px-3 py-3 text-text-on-dark">
                      {b.serviceType.name}
                    </td>
                    <td className="px-3 py-3 text-text-muted-dark">
                      {formatDate(b.scheduledAt)}
                    </td>
                    <td className="px-3 py-3 text-text-muted-dark">
                      {b.customer.email}
                    </td>
                    <td className="px-3 py-3 text-text-muted-dark">
                      {b.cleaner?.user.email ?? (
                        <span className="text-warning">Unassigned</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-3 py-3 font-mono font-semibold text-text-on-dark text-right">
                      {formatCurrency(b.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="bg-surface-card border border-surface-divider rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <StatusBadge status={b.status} />
                  <span className="font-mono text-sm font-semibold text-text-on-dark">
                    {formatCurrency(b.totalAmount)}
                  </span>
                </div>
                <p className="text-sm font-medium text-text-on-dark">
                  {b.serviceType.name}
                </p>
                <p className="text-xs text-text-muted-dark">
                  {formatDate(b.scheduledAt)} &bull; {formatTime(b.scheduledAt)}
                </p>
                <Button asChild variant="ghost-dark" size="sm">
                  <Link href={`/admin/bookings/${b.id}`}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
