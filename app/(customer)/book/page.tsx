import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { BookingStepIndicator } from "@/components/booking/BookingStepIndicator";
import { ServiceSelectorClient } from "./ServiceSelectorClient";

// Source: wireframes.md §Page 8 — Book Step 1: Select Service

export const metadata = {
  title: "Swanza — Select a Service",
  robots: { index: false, follow: false },
};

export default async function BookServicePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Fetch available service types from DB
  const serviceTypes = await prisma.serviceType.findMany({
    orderBy: { basePrice: "asc" },
  });

  return (
    <AppShell role="customer" pageTitle="Book a Clean" showBack>
      <div className="max-w-narrow mx-auto px-4 py-6 space-y-6">
        {/* Step Indicator */}
        <BookingStepIndicator currentStep={1} />

        <h2 className="text-mobile-h2 font-bold text-text-on-dark">
          Select a Service
        </h2>

        <ServiceSelectorClient serviceTypes={serviceTypes} />
      </div>
    </AppShell>
  );
}
