import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MapLink } from "@/components/ui/MapLink";
import { AdminBookingActions } from "./AdminBookingActions";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";

// Source: wireframes.md §Page 19 — Admin Booking Detail / Assign Cleaner

export const metadata = {
  title: "Swanza Admin — Booking Detail",
  robots: { index: false, follow: false },
};

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      serviceType: true,
      customer: true,
      cleaner: { include: { user: true } },
      payment: true,
    },
  });

  if (!booking) notFound();

  // Fetch approved cleaners for assignment
  const approvedCleaners = await prisma.cleanerProfile.findMany({
    where: { status: "APPROVED" },
    include: { user: true },
  });

  return (
    <AppShell role="admin" pageTitle="Booking Detail" showBack>
      <div className="max-w-narrow mx-auto px-4 py-6 space-y-6">
        {/* Booking header */}
        <div className="flex items-start gap-3">
          <StatusBadge status={booking.status} />
          <p className="font-mono text-xs text-text-muted-dark mt-1">
            #{booking.id.slice(-8)}
          </p>
        </div>

        {/* Booking Details Card */}
        <section
          className="bg-surface-card border border-surface-divider rounded-lg p-4 space-y-3"
          aria-label="Booking details"
        >
          <h2 className="text-display-h3 font-semibold text-text-on-dark">
            {booking.serviceType.name}
          </h2>
          <dl className="space-y-2">
            {[
              ["Date", `${formatDate(booking.scheduledAt)} · ${formatTime(booking.scheduledAt)}`],
              ["Duration", `~${booking.serviceType.durationHours} hours`],
              ["Bedrooms", String(booking.bedroomCount)],
              ["Bathrooms", String(booking.bathroomCount)],
              ["Total Amount", formatCurrency(booking.totalAmount)],
              ["Platform Fee", formatCurrency(booking.totalAmount * 0.2)],
              ["Cleaner Payout", formatCurrency(booking.totalAmount * 0.8)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-sm text-text-muted-dark">{label}</dt>
                <dd className="text-sm font-medium text-text-on-dark font-mono">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="border-t border-surface-divider pt-3">
            <p className="text-[11px] uppercase tracking-wide text-text-muted-dark mb-1">
              Address
            </p>
            <MapLink address={booking.address} />
          </div>
          {booking.notes && (
            <div className="border-t border-surface-divider pt-3">
              <p className="text-[11px] uppercase tracking-wide text-text-muted-dark mb-1">
                Notes
              </p>
              <p className="text-sm text-text-muted-dark">{booking.notes}</p>
            </div>
          )}
        </section>

        {/* Customer Info */}
        <section
          className="bg-surface-card border border-surface-divider rounded-lg p-4"
          aria-label="Customer info"
        >
          <p className="text-[11px] uppercase tracking-wide text-text-muted-dark mb-2">
            Customer
          </p>
          <p className="text-sm font-medium text-text-on-dark">
            {booking.customer.name ?? booking.customer.email}
          </p>
          <p className="text-xs text-text-muted-dark">{booking.customer.email}</p>
        </section>

        {/* Payment Info */}
        {booking.payment && (
          <section
            className="bg-surface-card border border-surface-divider rounded-lg p-4"
            aria-label="Payment info"
          >
            <p className="text-[11px] uppercase tracking-wide text-text-muted-dark mb-2">
              Payment
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-muted-dark">Status</p>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  booking.payment.status === "SUCCEEDED"
                    ? "bg-status-completed/20 text-status-completed"
                    : "bg-warning/20 text-warning"
                }`}
              >
                {booking.payment.status}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-text-muted-dark">Stripe PI</p>
              <p className="font-mono text-xs text-text-muted-dark">
                {booking.payment.stripePaymentIntentId.slice(-12)}
              </p>
            </div>
          </section>
        )}

        {/* Admin Actions (assign / override) — client component */}
        <AdminBookingActions
          booking={{
            id: booking.id,
            status: booking.status,
            cleanerId: booking.cleanerId ?? null,
            cleanerEmail: booking.cleaner?.user.email ?? null,
          }}
          approvedCleaners={approvedCleaners.map((c) => ({
            id: c.id,
            email: c.user.email,
            name: c.user.name,
          }))}
        />
      </div>
    </AppShell>
  );
}
