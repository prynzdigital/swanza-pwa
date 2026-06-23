import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BookingStepIndicator } from "@/components/booking/BookingStepIndicator";
import { AddressScheduleFormClient } from "./AddressScheduleFormClient";

// Source: wireframes.md §Page 9 — Book Step 2: Address + Schedule

export const metadata = {
  title: "Swanza — Enter Address",
  robots: { index: false, follow: false },
};

export default async function BookSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{
    serviceTypeId?: string;
    bedrooms?: string;
    bathrooms?: string;
  }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { serviceTypeId, bedrooms, bathrooms } = await searchParams;

  if (!serviceTypeId) {
    redirect("/book");
  }

  return (
    <AppShell role="customer" pageTitle="Book" showBack>
      <div className="max-w-narrow mx-auto px-4 py-6 space-y-6">
        <BookingStepIndicator currentStep={2} />

        <h2 className="text-mobile-h2 font-bold text-text-on-dark">
          Where and When?
        </h2>

        <AddressScheduleFormClient
          serviceTypeId={serviceTypeId}
          bedrooms={parseInt(bedrooms ?? "2")}
          bathrooms={parseInt(bathrooms ?? "1")}
        />
      </div>
    </AppShell>
  );
}
