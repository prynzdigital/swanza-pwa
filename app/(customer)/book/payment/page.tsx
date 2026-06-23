import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BookingStepIndicator } from "@/components/booking/BookingStepIndicator";
import { StripePaymentFormClient } from "./StripePaymentFormClient";
import { formatCurrency } from "@/lib/utils";

// Source: wireframes.md §Page 11 — Book Step 4: Payment
// Stripe Elements embedded — card data handled by Stripe, never touches Swanza servers.

export const metadata = {
  title: "Swanza — Secure Payment",
  robots: { index: false, follow: false },
};

export default async function BookPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{
    serviceTypeId?: string;
    bedrooms?: string;
    bathrooms?: string;
    address?: string;
    scheduledAt?: string;
    notes?: string;
    totalAmount?: string;
  }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const params = await searchParams;
  const { serviceTypeId, address, scheduledAt, totalAmount } = params;

  if (!serviceTypeId || !address || !scheduledAt || !totalAmount) {
    redirect("/book");
  }

  const amount = parseFloat(totalAmount);

  return (
    <AppShell role="customer" pageTitle="Payment" showBack>
      <div className="max-w-narrow mx-auto px-4 py-6 space-y-6">
        <BookingStepIndicator currentStep={4} />

        <h2 className="text-mobile-h2 font-bold text-text-on-dark">
          Secure Payment
        </h2>

        {/* Price reminder */}
        <p className="text-sm text-text-muted-dark">
          {/* Service name would come from DB but we keep it simple here */}
          Residential Cleaning &mdash;{" "}
          <span className="font-mono font-semibold text-text-on-dark">
            {formatCurrency(amount)}
          </span>
        </p>

        <StripePaymentFormClient
          bookingParams={params as Record<string, string>}
          totalAmount={amount}
        />
      </div>
    </AppShell>
  );
}
