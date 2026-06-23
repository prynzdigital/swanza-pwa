import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { BookingCard } from "@/components/ui/BookingCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar } from "lucide-react";

// Source: wireframes.md §Page 7 — Customer Dashboard
// Tab title per metadata.md: "Swanza — My Dashboard"

export const metadata = {
  title: "Swanza — My Dashboard",
  robots: { index: false, follow: false },
};

export default async function CustomerDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const firstName = clerkUser?.firstName ?? "there";

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      bookingsAsCustomer: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          serviceType: true,
          cleaner: { include: { user: true } },
        },
      },
    },
  });

  const bookings = dbUser?.bookingsAsCustomer ?? [];
  const activeBooking = bookings.find((b) =>
    ["ASSIGNED", "ACCEPTED", "EN_ROUTE", "IN_PROGRESS"].includes(b.status)
  );

  // Hour of day for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AppShell role="customer" pageTitle="Home">
      <div className="max-w-content mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <section>
          <h1 className="text-mobile-h2 font-bold text-text-on-dark">
            {greeting}, {firstName}
          </h1>
        </section>

        {/* Active booking card — if any */}
        {activeBooking && (
          <section aria-labelledby="active-booking-heading">
            <h2
              id="active-booking-heading"
              className="text-[13px] font-medium uppercase tracking-wide text-text-muted-dark mb-3"
            >
              Active Booking
            </h2>
            <BookingCard
              bookingId={activeBooking.id}
              status={activeBooking.status}
              serviceType={activeBooking.serviceType.name}
              cleanerName={
                activeBooking.cleaner?.user
                  ? `${activeBooking.cleaner.user.email.split("@")[0]}`
                  : undefined
              }
              address={activeBooking.address}
              scheduledAt={activeBooking.scheduledAt}
              totalAmount={activeBooking.totalAmount}
            />
            <div className="mt-3">
              <Button asChild variant="primary-dark" size="default">
                <Link href={`/customer/bookings/${activeBooking.id}`}>
                  Track Booking
                </Link>
              </Button>
            </div>
          </section>
        )}

        {/* Quick Book */}
        <section
          className="bg-surface-card border border-surface-divider rounded-lg p-4"
          aria-labelledby="quick-book-heading"
        >
          <h2
            id="quick-book-heading"
            className="text-display-h4 font-semibold text-text-on-dark mb-3"
          >
            Book a Clean
          </h2>
          <Button asChild variant="primary-dark" size="full">
            <Link href="/book">Book Now</Link>
          </Button>
        </section>

        {/* Recent Bookings */}
        <section aria-labelledby="recent-bookings-heading">
          <div className="flex items-center justify-between mb-3">
            <h2
              id="recent-bookings-heading"
              className="text-display-h4 font-semibold text-text-on-dark"
            >
              Recent Bookings
            </h2>
            <Link
              href="/customer/bookings"
              className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              See all
            </Link>
          </div>

          {bookings.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <Calendar
                className="h-10 w-10 text-text-muted-dark"
                aria-hidden="true"
              />
              <p className="text-base text-text-muted-dark">No bookings yet</p>
              <Button asChild variant="primary-dark" size="default">
                <Link href="/book">Book your first clean</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.slice(0, 3).map((booking) => (
                <BookingCard
                  key={booking.id}
                  bookingId={booking.id}
                  status={booking.status}
                  serviceType={booking.serviceType.name}
                  address={booking.address}
                  scheduledAt={booking.scheduledAt}
                  totalAmount={booking.totalAmount}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
