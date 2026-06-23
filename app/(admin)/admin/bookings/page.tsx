import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import type { BookingStatus } from "@prisma/client";

// Source: wireframes.md §Page 19 — Admin Bookings Table + Assign Modal

export const metadata = {
  title: "Swanza Admin — All Bookings",
  robots: { index: false, follow: false },
};

const STATUSES: (BookingStatus | "ALL")[] = [
  "ALL",
  "ASSIGNED",
  "ACCEPTED",
  "EN_ROUTE",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filterStatus = (status ?? "ALL") as BookingStatus | "ALL";

  const bookings = await prisma.booking.findMany({
    where:
      filterStatus === "ALL"
        ? {}
        : { status: filterStatus as BookingStatus },
    orderBy: { createdAt: "desc" },
    include: {
      serviceType: true,
      customer: true,
      cleaner: { include: { user: true } },
    },
  });

  return (
    <AppShell role="admin" pageTitle="Bookings">
      <div className="max-w-content mx-auto px-4 py-6 space-y-6">
        <h1 className="text-mobile-h2 font-bold text-text-on-dark">
          Bookings
        </h1>

        {/* Status filter tabs */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
          role="tablist"
          aria-label="Filter bookings by status"
        >
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/bookings${s === "ALL" ? "" : `?status=${s}`}`}
              role="tab"
              aria-selected={filterStatus === s}
              className={`flex-shrink-0 min-h-[44px] flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                filterStatus === s
                  ? "bg-primary text-surface-app"
                  : "bg-surface-card text-text-muted-dark hover:text-text-on-dark"
              }`}
            >
              {s === "ALL" ? "All" : s.replace("_", " ")}
            </Link>
          ))}
        </div>

        <p className="text-sm text-text-muted-dark">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
        </p>

        {/* Table — desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm" aria-label="Bookings">
            <thead>
              <tr className="border-b border-surface-divider">
                {[
                  "ID",
                  "Service",
                  "Date",
                  "Customer",
                  "Cleaner",
                  "Status",
                  "Amount",
                  "Actions",
                ].map((col) => (
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
              {bookings.map((b) => (
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
                    <br />
                    <span className="text-xs">{formatTime(b.scheduledAt)}</span>
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
                  <td className="px-3 py-3">
                    <Button asChild variant="ghost-dark" size="sm">
                      <Link href={`/admin/bookings/${b.id}`}>Manage</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="md:hidden space-y-3">
          {bookings.map((b) => (
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
              <p className="text-xs text-text-muted-dark truncate">
                {b.cleaner?.user.email ?? (
                  <span className="text-warning">No cleaner assigned</span>
                )}
              </p>
              <Button asChild variant="ghost-dark" size="sm">
                <Link href={`/admin/bookings/${b.id}`}>Manage</Link>
              </Button>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted-dark">No bookings match this filter.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
