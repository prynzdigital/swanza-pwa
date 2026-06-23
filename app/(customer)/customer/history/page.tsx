import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { BookingCard } from "@/components/ui/BookingCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar } from "lucide-react";

// Source: wireframes.md §Page 13 — Booking History

export const metadata = {
  title: "Swanza — My Bookings",
  robots: { index: false, follow: false },
};

export default async function BookingHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = "all" } = await searchParams;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!dbUser) redirect("/sign-in");

  // Build filter condition
  // reason: statusFilter type needs to accommodate both undefined and array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let statusFilter: any = undefined;
  if (filter === "upcoming") {
    statusFilter = { in: ["ASSIGNED", "ACCEPTED", "EN_ROUTE", "IN_PROGRESS"] };
  } else if (filter === "completed") {
    statusFilter = "COMPLETED";
  } else if (filter === "cancelled") {
    statusFilter = "CANCELLED";
  }

  const bookings = await prisma.booking.findMany({
    where: {
      customerId: dbUser.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: { scheduledAt: "desc" },
    take: 20,
    include: {
      serviceType: true,
      cleaner: { include: { user: true } },
    },
  });

  const filterTabs = [
    { value: "all", label: "All" },
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <AppShell role="customer" pageTitle="My Bookings">
      <div className="max-w-content mx-auto px-4 py-6 space-y-6">
        {/* Filter tabs */}
        <nav aria-label="Booking filter tabs">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {filterTabs.map((tab) => (
              <Link
                key={tab.value}
                href={`/customer/bookings?filter=${tab.value}`}
                className={`flex-shrink-0 h-11 px-4 flex items-center text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  filter === tab.value
                    ? "text-primary border-b-2 border-primary"
                    : "text-text-muted-dark hover:text-text-on-dark"
                }`}
                aria-current={filter === tab.value ? "true" : undefined}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Booking list */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
            <Calendar
              className="h-10 w-10 text-text-muted-dark"
              aria-hidden="true"
            />
            <p className="text-base text-text-muted-dark">No bookings yet</p>
            <Button asChild variant="primary-dark" size="default">
              <Link href="/book">Book a Clean</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                bookingId={booking.id}
                status={booking.status}
                serviceType={booking.serviceType.name}
                cleanerName={
                  booking.cleaner?.user
                    ? booking.cleaner.user.email.split("@")[0]
                    : undefined
                }
                address={booking.address}
                scheduledAt={booking.scheduledAt}
                totalAmount={booking.totalAmount}
                onViewDetails={(id) => {
                  // Navigation handled client-side
                  void id;
                }}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
