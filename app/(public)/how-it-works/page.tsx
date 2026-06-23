import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { BookingStatus } from "@prisma/client";

// Source: metadata.md §How It Works
// Source: wireframes.md §Page 2 — How It Works

export const metadata: Metadata = {
  title: "How Swanza Works | Book a Cleaner Online",
  description:
    "See how Swanza connects you with vetted local cleaners. Book online, pay upfront, and track your cleaner in real time — start to finish.",
  // QA fix #012: canonical tag required per seo-strategy.md §8
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://swanza.com"}/how-it-works`,
  },
  openGraph: {
    title: "How Swanza Works | Book a Cleaner Online",
    description:
      "See how Swanza connects you with vetted local cleaners. Book online, pay upfront, and track your cleaner in real time — start to finish.",
  },
};

// Schema.org SoftwareApplication — also applies to this page per seo-strategy.md
const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Swanza",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS (PWA), Android (PWA)",
  description:
    "Book residential cleaning online, pay upfront, and track your cleaner in real time with Swanza.",
};

const CUSTOMER_STEPS = [
  {
    number: "1",
    title: "Choose Your Service",
    body: "Select Standard, Deep, or Move-In/Out cleaning. Tell the app about your space — number of bedrooms and bathrooms.",
  },
  {
    number: "2",
    title: "Book and Pay",
    body: "Choose a date and time from available slots. Review your upfront price — what you see is what you pay. Pay securely via Stripe.",
  },
  {
    number: "3",
    title: "Track Live",
    body: "An approved independent cleaner is assigned. Watch their status update in real time from assignment through completion.",
  },
  {
    number: "4",
    title: "Done",
    body: "Job completed. Payout processed automatically to your cleaner via Stripe Connect. Leave a review to help others choose.",
  },
];

const STATUS_LIFECYCLE: { status: BookingStatus; description: string }[] = [
  {
    status: "ASSIGNED",
    description: "Your booking is confirmed and a cleaner has been assigned to your job. They will acknowledge the assignment shortly.",
  },
  {
    status: "ACCEPTED",
    description: "Your assigned cleaner has accepted the job and committed to showing up at the scheduled time.",
  },
  {
    status: "EN_ROUTE",
    description: "Your cleaner is actively traveling to your address. They are on the way.",
  },
  {
    status: "IN_PROGRESS",
    description: "Your cleaner has arrived and the job is underway. The cleaning is happening now.",
  },
  {
    status: "COMPLETED",
    description: "The job is finished. Your cleaner has marked it complete and the payout is processing automatically.",
  },
];

const CLEANER_STEPS = [
  {
    number: "1",
    title: "Apply and Get Approved",
    body: "Submit your cleaner application. The Swanza operations team reviews your profile. Once approved, your job dashboard goes live.",
  },
  {
    number: "2",
    title: "Accept Jobs",
    body: "Browse available jobs in your area. See the payout amount before you commit. Accept what works for your schedule.",
  },
  {
    number: "3",
    title: "Get Paid",
    body: "Complete the job and mark it done in the app. Your payout is processed automatically via Stripe Connect — no invoicing, no chasing.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Page Intro */}
      <section className="bg-surface-page py-space-2xl">
        <div className="max-w-readable mx-auto px-space-xl text-center">
          <h1 className="text-mobile-h1 md:text-display-h1 font-extrabold text-text-primary tracking-tight mb-6">
            How Swanza Works
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            Swanza handles the entire job lifecycle — from booking and payment
            through cleaner assignment, real-time status updates, and automatic
            payout — so there is no ambiguity for anyone involved at any step.
          </p>
        </div>
      </section>

      {/* For Customers */}
      <section
        className="bg-surface-page py-space-2xl"
        aria-labelledby="for-customers-heading"
      >
        <div className="max-w-content mx-auto px-space-xl">
          <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted mb-2">
            For Customers
          </p>
          <h2
            id="for-customers-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary mb-12 tracking-tight"
          >
            Book a Clean in Minutes
          </h2>

          {/* Step flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {CUSTOMER_STEPS.map((step, i) => (
              <div key={step.number} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-light text-white text-lg font-bold flex-shrink-0">
                    {step.number}
                  </span>
                  {/* Connector line — desktop only */}
                  {i < CUSTOMER_STEPS.length - 1 && (
                    <div
                      className="hidden md:block flex-1 h-0.5 bg-border"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3 className="text-display-h4 font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status Lifecycle Explainer */}
      <section
        className="bg-surface-section-alt py-space-2xl"
        aria-labelledby="status-lifecycle-heading"
      >
        <div className="max-w-content mx-auto px-space-xl">
          <h2
            id="status-lifecycle-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary mb-12 text-center tracking-tight"
          >
            Live Status From Start to Finish
          </h2>

          {/* Desktop: horizontal flow. Mobile: vertical with arrows */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-4 items-start justify-between">
            {STATUS_LIFECYCLE.map((item, i) => (
              <div key={item.status} className="flex flex-col md:flex-1 gap-3">
                <div className="flex items-center gap-2 md:flex-col md:items-start">
                  <StatusBadge status={item.status} />
                  {i < STATUS_LIFECYCLE.length - 1 && (
                    <span
                      className="md:hidden text-text-muted-dark text-xl"
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Cleaners */}
      <section
        className="bg-surface-page py-space-2xl"
        aria-labelledby="for-cleaners-heading"
      >
        <div className="max-w-content mx-auto px-space-xl">
          <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted mb-2">
            For Cleaners
          </p>
          <h2
            id="for-cleaners-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary mb-12 tracking-tight"
          >
            Manage Your Jobs in One Place
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CLEANER_STEPS.map((step, i) => (
              <div key={step.number} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-12 w-12 rounded-full bg-surface-dark-band text-text-on-dark text-lg font-bold flex-shrink-0 border border-surface-divider">
                    {step.number}
                  </span>
                  {i < CLEANER_STEPS.length - 1 && (
                    <div
                      className="hidden md:block flex-1 h-0.5 bg-border"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <h3 className="text-display-h4 font-semibold text-text-primary">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-surface-dark-band py-20">
        <div className="max-w-content mx-auto px-space-xl flex flex-col md:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg">
            <Link href="/sign-up">Book a Cleaner</Link>
          </Button>
          <Button asChild variant="secondary-dark" size="lg">
            <Link href="/become-a-cleaner">Become a Cleaner</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
