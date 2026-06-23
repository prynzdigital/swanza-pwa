import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { BookingStepIndicator } from "@/components/booking/BookingStepIndicator";
import { PriceEstimate } from "@/components/ui/PriceEstimate";
import { Button } from "@/components/ui/Button";
import { calculateBookingPrice } from "@/lib/booking-logic";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import Link from "next/link";

// Source: wireframes.md §Page 10 — Book Step 3: Price Estimate + Confirm

export const metadata = {
  title: "Swanza — Confirm Booking",
  robots: { index: false, follow: false },
};

export default async function BookConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{
    serviceTypeId?: string;
    bedrooms?: string;
    bathrooms?: string;
    address?: string;
    scheduledAt?: string;
    notes?: string;
  }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const {
    serviceTypeId,
    bedrooms: bedroomsStr,
    bathrooms: bathroomsStr,
    address,
    scheduledAt,
    notes,
  } = await searchParams;

  if (!serviceTypeId || !address || !scheduledAt) {
    redirect("/book");
  }

  const serviceType = await prisma.serviceType.findUnique({
    where: { id: serviceTypeId },
  });

  if (!serviceType) redirect("/book");

  const bedrooms = parseInt(bedroomsStr ?? "2");
  const bathrooms = parseInt(bathroomsStr ?? "1");
  const totalPrice = calculateBookingPrice(
    serviceType.basePrice,
    bedrooms,
    bathrooms
  );
  const scheduledDate = new Date(scheduledAt);

  const breakdown = [
    { label: `${serviceType.name} (${bedrooms}BR/${bathrooms}BA)`, value: formatCurrency(totalPrice) },
    { label: "Platform fee", value: "included" },
    { label: formatDate(scheduledDate), value: formatTime(scheduledDate) },
  ];

  return (
    <AppShell role="customer" pageTitle="Review" showBack>
      <div className="max-w-narrow mx-auto px-4 py-6 space-y-6">
        <BookingStepIndicator currentStep={3} />

        <h2 className="text-mobile-h2 font-bold text-text-on-dark">
          Review Your Booking
        </h2>

        {/* Booking summary card */}
        <section
          className="bg-surface-card border border-surface-divider rounded-lg p-4 space-y-2"
          aria-label="Booking summary"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-display-h4 font-semibold text-text-on-dark">
                {serviceType.name}
              </p>
              <p className="text-sm text-text-muted-dark">
                {bedrooms} bedrooms &bull; {bathrooms} bathrooms
              </p>
              <p className="text-sm text-text-muted-dark">{address}</p>
              <p className="text-sm text-text-muted-dark">
                {formatDate(scheduledDate)} &bull; {formatTime(scheduledDate)}
              </p>
              {notes && (
                <p className="text-sm text-text-muted-dark italic">
                  Notes: {notes}
                </p>
              )}
            </div>
            <Link
              href={`/book/schedule?serviceTypeId=${serviceTypeId}&bedrooms=${bedrooms}&bathrooms=${bathrooms}`}
              className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm flex-shrink-0"
            >
              Edit
            </Link>
          </div>
        </section>

        {/* Price Estimate */}
        <PriceEstimate
          label="Your Price"
          amount={totalPrice}
          breakdown={breakdown}
          confirmed
          dark
        />

        {/* Action buttons */}
        <div className="space-y-3">
          <form
            action={`/book/payment`}
            method="GET"
          >
            {/* Pass all params through hidden inputs */}
            <input type="hidden" name="serviceTypeId" value={serviceTypeId} />
            <input type="hidden" name="bedrooms" value={bedrooms} />
            <input type="hidden" name="bathrooms" value={bathrooms} />
            <input type="hidden" name="address" value={address} />
            <input type="hidden" name="scheduledAt" value={scheduledAt} />
            {notes && <input type="hidden" name="notes" value={notes} />}
            <input type="hidden" name="totalAmount" value={totalPrice} />

            <Button type="submit" variant="primary-dark" size="full">
              Confirm and Pay
            </Button>
          </form>

          <p className="text-xs text-text-muted-dark text-center">
            You&rsquo;ll be taken to secure payment powered by Stripe.
          </p>

          <Button
            variant="ghost-dark"
            size="full"
            onClick={undefined}
            asChild
          >
            <Link href={`/book/schedule?serviceTypeId=${serviceTypeId}&bedrooms=${bedrooms}&bathrooms=${bathrooms}`}>
              &larr; Back
            </Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
