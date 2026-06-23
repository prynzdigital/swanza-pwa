import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Eye, DollarSign } from "lucide-react";

// Source: metadata.md §About
// Source: wireframes.md §Page 5 — About
// Source: about.md — verbatim copy

export const metadata: Metadata = {
  title: "About Swanza | [CITY] Cleaning Marketplace",
  description:
    "Swanza is a [CITY] cleaning platform built for real-time job management. We connect vetted cleaners with customers who expect reliability.",
  robots: { index: true, follow: true },
  // QA fix #012: canonical tag required per seo-strategy.md §8
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://swanza.com"}/about`,
  },
  openGraph: {
    title: "About Swanza | [CITY] Cleaning Marketplace",
    description:
      "Swanza is a [CITY] cleaning platform built for real-time job management. We connect vetted cleaners with customers who expect reliability.",
  },
};

const PROBLEMS = [
  {
    title: "Unreliable Cleaner Discovery",
    problem:
      "Most people find cleaners the same way they did ten years ago: a friend's recommendation, a Craigslist post, or a platform where vetting is inconsistent. There is no reliable way to know who is showing up at your home before they arrive.",
    response:
      "Every independent cleaner on the platform is reviewed and admin-approved before they can accept a single job. Customers see a verified cleaner profile, not an anonymous listing.",
  },
  {
    title: "Opaque Pricing",
    problem:
      "The national platforms show you a number, then adjust it later. Local cleaners quote verbally and invoice by text. Neither model gives customers confidence that the price they agreed to is the price they'll pay.",
    response:
      "Your price is displayed during the booking flow — before the payment screen. What you confirm is what you pay. No calls, no adjustments.",
  },
  {
    title: "No Accountability After Booking",
    problem:
      "Once you book, you wait. You do not know if the cleaner accepted the job, where they are, or whether they are coming. If something goes wrong, there is no operational layer to intervene.",
    response:
      "Every job has a live status track — Assigned, Accepted, En Route, In Progress, Completed — visible to the customer in real time. An operations team monitors active bookings and can intervene manually if a job needs reassignment.",
  },
];

const TRUST_COMMITMENTS = [
  {
    icon: <CheckCircle className="h-6 w-6" aria-hidden="true" />,
    title: "Approved Cleaners Only",
    body: "Every independent cleaner on Swanza completes an admin review process before entering the job pool. We do not allow unchecked sign-ups to take bookings.",
    note: "[NEEDS CLIENT INPUT: confirm and specify the vetting steps — e.g., identity verification, background check provider, skills review, reference check.]",
  },
  {
    icon: <Eye className="h-6 w-6" aria-hidden="true" />,
    title: "Real-Time Visibility",
    body: "From the moment your booking is confirmed, you can see your job's live status. You will always know where things stand — no waiting, no guessing.",
  },
  {
    icon: <DollarSign className="h-6 w-6" aria-hidden="true" />,
    title: "No Surprise Fees",
    body: "Your price is locked at the moment you confirm your booking. We do not add charges after the fact. If anything changes, you will know before any payment is processed.",
  },
];

const PLATFORM_VALUES = [
  {
    number: "1",
    label: "Transparency over polish.",
    body: "We show you the price before you pay and the status before you ask. No information is hidden behind a customer service call.",
  },
  {
    number: "2",
    label: "Both sides matter.",
    body: "A platform that exploits cleaners cannot deliver reliable service to customers. We build for both roles because that is the only way the platform works.",
  },
  {
    number: "3",
    label: "Operations, not algorithms alone.",
    body: "Swanza has an admin layer that can intervene in any job. Automated systems fail at edge cases. We do not disappear when something goes wrong.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Intro */}
      <section className="bg-surface-page py-space-2xl">
        <div className="max-w-readable mx-auto px-space-xl">
          <h1 className="text-mobile-h1 md:text-display-h1 font-extrabold text-text-primary tracking-tight mb-6">
            The Cleaning Platform Built for Transparency
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-4">
            The cleaning platform built for transparency sits at the intersection
            of two groups who have both been let down by the way local cleaning
            services usually work: customers who book and then wonder if anyone is
            actually coming, and independent cleaning professionals who work hard
            but can't get consistent jobs or reliable pay.
          </p>
          <p className="text-lg text-text-secondary leading-relaxed">
            Swanza is built to solve that — on both sides.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section
        className="bg-surface-white py-space-2xl"
        aria-labelledby="origin-story-heading"
      >
        <div className="max-w-readable mx-auto px-space-xl">
          <h2
            id="origin-story-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-8"
          >
            Why We Built This
          </h2>
          <div className="space-y-5 text-base text-text-secondary leading-relaxed">
            <p>
              Finding a reliable cleaner has no business being as hard as it is.
              You either chase referrals, scroll through listings with no
              accountability layer, or use a national app that treats cleaners as
              interchangeable and you as a booking ID. When something goes wrong
              — a no-show, a price change, a dispute — there is nowhere to go.
            </p>
            <p>
              The problem on the other side is just as real. Independent cleaning
              professionals want consistent work. They do not want to manage their
              own marketing, negotiate prices over text, and wait on checks that
              may or may not arrive. They want to do the work and get paid.
              Simple.
            </p>
            <p>
              Swanza was built to close both gaps at once. A platform that
              handles the entire job lifecycle — from booking and payment through
              cleaner assignment, real-time status updates, and automatic payout
              — so there is no ambiguity for anyone involved at any step.
            </p>
            <p>
              We are starting in residential cleaning because it is where the gap
              is most visible and most solvable. More service categories will
              follow.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement — pull quote */}
      <section
        className="bg-surface-section-alt py-space-2xl"
        aria-labelledby="mission-heading"
      >
        <div className="max-w-readable mx-auto px-space-xl">
          <figure className="border-l-4 border-primary-light pl-6">
            <blockquote>
              <h2
                id="mission-heading"
                className="text-mobile-h2 md:text-[32px] font-bold italic text-text-primary leading-snug"
              >
                Swanza exists to make every cleaning booking reliable,
                transparent, and fair — for the customer booking it and the
                professional completing it.
              </h2>
            </blockquote>
          </figure>
        </div>
      </section>

      {/* Problems We're Fixing */}
      <section
        className="bg-surface-page py-space-2xl"
        aria-labelledby="problems-heading"
      >
        <div className="max-w-content mx-auto px-space-xl">
          <h2
            id="problems-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-12 text-center"
          >
            The Problems We&rsquo;re Fixing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROBLEMS.map((p) => (
              <article key={p.title}>
                <h3 className="text-display-h3 font-semibold text-text-primary mb-3">
                  {p.title}
                </h3>
                <p className="text-base text-text-secondary leading-relaxed mb-4">
                  {p.problem}
                </p>
                <p className="text-base text-text-secondary leading-relaxed pl-4 border-l-4 border-primary-light">
                  <strong className="font-semibold text-text-primary">
                    Swanza&rsquo;s response:{" "}
                  </strong>
                  {p.response}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        className="bg-surface-white py-space-2xl"
        aria-labelledby="team-heading"
      >
        <div className="max-w-readable mx-auto px-space-xl">
          <h2
            id="team-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-8"
          >
            The People Behind Swanza
          </h2>
          <div className="bg-surface-section-alt border border-border rounded-lg p-6">
            <p className="text-sm text-warning font-medium">
              [NEEDS CLIENT INPUT: founder names, titles, and brief bios (2–3
              sentences each). Include: what led each person to build Swanza, and
              any relevant professional background (operations, tech, cleaning
              industry, etc.). No placeholder stock photos — name + title + bio
              format per wireframes.md]
            </p>
          </div>
        </div>
      </section>

      {/* Trust Commitments */}
      <section
        className="bg-surface-section-alt py-space-2xl"
        aria-labelledby="commitments-heading"
      >
        <div className="max-w-content mx-auto px-space-xl">
          <h2
            id="commitments-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-12 text-center"
          >
            What We Commit To
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRUST_COMMITMENTS.map((c) => (
              <div key={c.title} className="flex flex-col gap-3">
                <span className="text-primary-light">{c.icon}</span>
                <h3 className="text-display-h4 font-semibold text-text-primary">
                  {c.title}
                </h3>
                <p className="text-base text-text-secondary leading-relaxed">
                  {c.body}
                </p>
                {c.note && (
                  <p className="text-xs text-warning bg-warning/10 rounded-md px-3 py-2 border border-warning/30">
                    {c.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Values */}
      <section
        className="bg-surface-page py-space-2xl"
        aria-labelledby="values-heading"
      >
        <div className="max-w-readable mx-auto px-space-xl">
          <h2
            id="values-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-12 text-center"
          >
            How We Operate
          </h2>
          <ol className="space-y-8" role="list">
            {PLATFORM_VALUES.map((v) => (
              <li key={v.number} className="flex gap-6 items-start">
                <span
                  className="font-mono text-5xl font-bold text-primary-light leading-none flex-shrink-0"
                  aria-hidden="true"
                >
                  {v.number}
                </span>
                <div>
                  <h3 className="text-display-h3 font-semibold text-text-primary mb-2">
                    {v.label}
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed">
                    {v.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Page CTA — understated, two outbound paths */}
      <section className="bg-surface-white py-space-2xl">
        <div className="max-w-readable mx-auto px-space-xl text-center">
          <p className="text-base text-text-secondary leading-relaxed mb-8">
            Swanza is available now in [CITY] for residential cleaning. If you
            need a cleaner, you can book in minutes. If you are a cleaning
            professional, you can apply to join the platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="default">
              <Link href="/services">See Our Services</Link>
            </Button>
            <Button asChild variant="secondary" size="default">
              <Link href="/become-a-cleaner">Join as a Cleaner</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
