import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Wind, SprayCan, Truck, CheckCircle } from "lucide-react";
// Note: lucide-react does not export Broom — using Wind as substitute for Standard Clean icon

// Source: metadata.md §Services
// Source: wireframes.md §Page 3 — Services
// Source: services.md — verbatim copy

export const metadata: Metadata = {
  title: "Residential Cleaning in [CITY] | Swanza",
  description:
    "Professional residential cleaning in [CITY]. Flat-rate pricing, vetted cleaners, and real-time job tracking. Book online in under 5 minutes.",
  // QA fix #012: canonical tag required per seo-strategy.md §8
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://swanza.com"}/services`,
  },
  openGraph: {
    title: "Residential Cleaning in [CITY] | Swanza",
    description:
      "Professional residential cleaning in [CITY]. Flat-rate pricing, vetted cleaners, and real-time job tracking.",
  },
};

// Schema.org Service — seo-strategy.md §Schema Strategy — Secondary Schema
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Residential Cleaning",
  provider: {
    "@type": "Organization",
    name: "Swanza",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://swanza.com",
  },
  // areaServed: [NEEDS CLIENT INPUT: Q1 — target city]
  // offers: [NEEDS CLIENT INPUT: Q8 — pricing model and price points]
  description:
    "Professional residential cleaning services including standard, deep, and move-in/move-out cleaning.",
};

const STANDARD_INCLUDED = [
  "Wipe down countertops, stovetop, and exterior of appliances",
  "Clean sink and faucet",
  "Clean exterior of cabinets",
  "Mop or sweep floors",
  "Scrub toilet, sink, and tub/shower",
  "Wipe mirrors and fixtures",
  "Dust surfaces, shelves, and baseboards",
  "Vacuum carpets and rugs",
  "Mop hard floors",
  "Empty trash cans",
  "Wipe light switches and door handles",
  "Tidy visible surfaces",
];

const DEEP_INCLUDED = [
  ...STANDARD_INCLUDED,
  "Clean inside microwave",
  "Degrease stovetop grates and burner areas",
  "Wipe inside and outside of oven door",
  "Wipe inside of cabinets",
  "Clean refrigerator exterior and handles",
  "Scrub tile grout",
  "Clean behind and around toilet",
  "Descale showerheads and faucets",
  "Wipe down window sills and ledges",
  "Clean ceiling fans and light fixtures",
  "Vacuum under and behind furniture",
  "Wipe door frames and interior doors",
];

const MOVE_INCLUDED = [
  "Everything in the Deep Clean",
  "Full interior of all cabinets and drawers",
  "Inside oven and refrigerator (if vacant)",
  "Inside all closets",
  "Window interiors (where safely accessible)",
  "Scrub all bathroom tile and grout",
  "Clean and wipe all baseboards",
  "Remove surface grime from walls (spot clean)",
  "Final floor clean throughout",
];

const FAQ_ITEMS = [
  {
    q: "What's the difference between a Standard and Deep Clean?",
    a: "A Standard Clean covers all the regular surfaces — counters, floors, bathrooms, dusting — and is designed for maintained homes on a regular schedule. A Deep Clean goes further: inside cabinets, behind appliances, grout scrubbing, ceiling fans. If you haven't had a professional clean in a few months, start with a Deep Clean.",
  },
  {
    q: "Do I need to provide cleaning supplies?",
    a: "[NEEDS CLIENT INPUT: confirm whether Swanza cleaners bring their own supplies and equipment, or whether customers are expected to provide anything. This is a common customer objection and must be answered definitively before launch.]",
  },
  {
    q: "How long will the cleaning take?",
    a: "Duration depends on your home size and service type. The app will provide an estimated time range during the booking flow. [NEEDS CLIENT INPUT: confirm whether estimated duration is displayed in the app during booking — and if so, add example ranges here, e.g., \"A standard 2-bedroom clean typically takes 2–3 hours.\"]",
  },
  {
    q: "Will I get the same cleaner every time?",
    a: "Swanza's system assigns an approved independent cleaner based on availability and your location. For recurring bookings, the app will attempt to match you with the same cleaner where possible. [NEEDS CLIENT INPUT: confirm whether preferred-cleaner matching is a feature in MVP scope — if not, soften this answer.]",
  },
  {
    q: "Can I add extra tasks to my booking?",
    a: "[NEEDS CLIENT INPUT: confirm which add-on services (oven interior, refrigerator interior, windows, laundry, etc.) are in MVP scope. Once confirmed, list them here with pricing or booking instructions.]",
  },
  {
    q: "What if I'm not happy with the clean?",
    a: "[NEEDS CLIENT INPUT: confirm Swanza's re-clean policy or satisfaction guarantee — this is a key customer objection. Without a concrete answer, use: \"Contact us within 24 hours of your booking completion and our team will work with you to make it right.\"]",
  },
];

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Page Intro */}
      <section className="bg-surface-page py-space-2xl">
        <div className="max-w-content mx-auto px-space-xl">
          <h1 className="text-mobile-h1 md:text-display-h1 font-extrabold text-text-primary tracking-tight mb-6 max-w-readable">
            Residential Cleaning Services in{" "}
            <span className="text-primary-light">[CITY]</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-readable leading-relaxed mb-8">
            Residential cleaning service in [CITY] — booked online in minutes,
            with upfront pricing and a vetted independent cleaner assigned before
            you ever pay. No calls. No negotiating. No wondering whether anyone is
            coming.
          </p>
          <p className="text-base text-text-secondary max-w-readable leading-relaxed mb-8">
            Every service below is available through the Swanza app. Pick the one
            that fits your situation, see your price, and book.
          </p>
          <Button asChild size="default">
            <Link href="/sign-up">Book a Cleaner</Link>
          </Button>
        </div>
      </section>

      {/* Standard Cleaning */}
      <section className="bg-surface-white py-space-2xl" id="standard">
        <div className="max-w-content mx-auto px-space-xl">
          <ServiceCard
            icon={<Wind className="h-10 w-10" />}
            name="Standard Cleaning"
            description="A thorough top-to-bottom clean for homes that are maintained regularly."
            problemStatement="Life is busy. A standard clean resets your home on a regular schedule — weekly, bi-weekly, or monthly — without you managing the logistics."
            included={STANDARD_INCLUDED}
            whoItsFor="Homeowners and renters who want a reliable recurring clean. Ideal for maintained homes that need a consistent reset, not a renovation."
            ctaLabel="Book a Standard Clean"
            ctaHref="/sign-up"
          />
        </div>
      </section>

      {/* Deep Cleaning */}
      <section className="bg-surface-section-alt py-space-2xl" id="deep">
        <div className="max-w-content mx-auto px-space-xl">
          <ServiceCard
            icon={<SprayCan className="h-10 w-10" />}
            name="Deep Cleaning"
            description="A detailed, intensive clean that covers everything a standard clean doesn't reach."
            problemStatement="Some homes need more than a refresh. If your home hasn't been professionally cleaned in a while — or you want a full reset before setting up a recurring schedule — a deep clean is where to start."
            included={DEEP_INCLUDED}
            whoItsFor="Customers booking their first clean on Swanza, homes that haven't been professionally cleaned in 3+ months, or anyone who wants a thorough baseline before starting a recurring schedule."
            ctaLabel="Book a Deep Clean"
            ctaHref="/sign-up"
            badge="Most Thorough"
            altBackground
          />
          <p className="mt-4 text-sm italic text-text-secondary text-center max-w-readable mx-auto">
            <strong className="not-italic font-semibold">Recommended pairing:</strong> Book a Deep Clean first, then set up a Standard Clean recurring schedule.
          </p>
        </div>
      </section>

      {/* Move-In / Move-Out Cleaning */}
      <section className="bg-surface-white py-space-2xl" id="move">
        <div className="max-w-content mx-auto px-space-xl">
          <ServiceCard
            icon={<Truck className="h-10 w-10" />}
            name="Move-In / Move-Out Cleaning"
            description="A full clean of an empty property — before you move in, or before you hand back the keys."
            problemStatement="Moving is already stressful. Cleaning an empty apartment or house from top to bottom — under the sink, inside the oven, behind the fridge — is the last thing you want to be doing on move-out day."
            included={MOVE_INCLUDED}
            whoItsFor="Renters preparing for a lease end inspection. Homeowners closing on a sale. New tenants or owners who want to start fresh before moving in."
            ctaLabel="Book a Move-In / Move-Out Clean"
            ctaHref="/sign-up"
          />
          <p className="mt-4 pl-4 border-l-4 border-primary-light text-sm italic text-text-secondary max-w-readable mx-auto">
            <strong className="not-italic font-semibold">Timing note:</strong> Book as early as possible — move-out and move-in dates are often fixed, and slot availability may be limited.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-surface-section-alt py-space-2xl" id="pricing">
        <div className="max-w-readable mx-auto px-space-xl text-center">
          <h2 className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-6">
            What Does It Cost?
          </h2>
          <p className="text-base text-text-secondary leading-relaxed mb-6">
            Swanza shows you the exact price for your clean before you pay —
            during the booking flow, based on your service type, home size, and
            date. No quotes over the phone. No post-job billing adjustments. The
            price you see when you confirm is the price you pay.
          </p>

          {/* Pricing placeholder — waiting on client input */}
          <div className="bg-surface-white border border-border rounded-lg p-6 mb-6 max-w-2xl mx-auto">
            <p className="text-sm text-warning font-medium mb-3">
              [NEEDS CLIENT INPUT: Q8 — Pricing model and price points pending
              client confirmation. Pricing table will appear here once confirmed.]
            </p>
            <p className="text-base text-text-secondary leading-relaxed">
              Pricing is calculated in the app at the time of booking. Select
              your service, enter your address and home details, and your price
              appears before the payment screen — no hidden steps, no surprises.
            </p>
          </div>

          <Button asChild variant="ghost" size="default">
            <Link href="/sign-up">See Your Price</Link>
          </Button>
        </div>
      </section>

      {/* Booking Flow Description */}
      <section className="bg-surface-page py-space-2xl">
        <div className="max-w-content mx-auto px-space-xl">
          <h2 className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-12 text-center">
            Here&rsquo;s How Booking Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                n: "1",
                t: "Select Your Service",
                b: "Choose Standard, Deep, or Move-In/Out. Tell the app about your space (number of bedrooms/bathrooms).",
              },
              {
                n: "2",
                t: "Pick a Date and Time",
                b: "See available slots based on cleaner availability in your area. Choose what works for you.",
              },
              {
                n: "3",
                t: "Review Your Price and Pay",
                b: "Your exact price appears before the payment screen. Pay securely via Stripe. You'll receive a booking confirmation immediately — with your cleaner's assigned status.",
              },
            ].map((step) => (
              <div key={step.n} className="flex flex-col gap-4">
                <span className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-light text-white text-lg font-bold">
                  {step.n}
                </span>
                <h3 className="text-display-h4 font-semibold text-text-primary">
                  {step.t}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.b}
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm text-text-secondary text-center mb-8">
            Once confirmed, you can track the job status live:{" "}
            <strong>Assigned → Accepted → En Route → In Progress → Completed.</strong>
          </p>

          <div className="text-center">
            <Button asChild size="default">
              <Link href="/sign-up">Book a Cleaner</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service FAQ */}
      <section className="bg-surface-white py-space-2xl">
        <div className="max-w-readable mx-auto px-space-xl">
          <h2 className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-8 text-center">
            Common Questions
          </h2>

          <dl className="space-y-6">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border-b border-border pb-6 last:border-0">
                <dt className="text-display-h4 font-semibold text-text-primary mb-3">
                  {item.q}
                </dt>
                <dd className="text-base text-text-secondary leading-relaxed">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
