import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Briefcase, TrendingUp, FileX } from "lucide-react";

// Source: wireframes.md §[CLEANER RECRUITMENT] — Homepage
// Source: homepage.md §[CLEANER RECRUITMENT]
// Full-width dark band section. Secondary funnel — must NOT compete visually
// with the primary "Book a Cleaner" CTA above.

const CLEANER_VALUE_PROPS = [
  {
    icon: <Briefcase className="h-6 w-6" aria-hidden="true" />,
    title: "Steady Job Flow",
    body: "Stop relying on word of mouth and slow weeks. Swanza routes verified jobs to you based on your availability and service area.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" aria-hidden="true" />,
    title: "Earnings You Can See",
    body: "Know what you earn before you accept a job. Your earnings dashboard updates in real time — no waiting for a check, no manual invoicing.",
  },
  {
    icon: <FileX className="h-6 w-6" aria-hidden="true" />,
    title: "Zero Paperwork",
    body: "No scheduling back-and-forth. No invoicing. No chasing clients. Accept jobs, complete them, and get paid automatically via Stripe Connect. That’s it.",
  },
] as const;

export function CleanerRecruitment() {
  return (
    <section
      className="bg-surface-dark-band py-space-3xl"
      aria-labelledby="cleaner-recruitment-heading"
    >
      <div className="max-w-[900px] mx-auto px-space-xl">
        {/* Section headline */}
        <h2
          id="cleaner-recruitment-heading"
          className="text-mobile-h2 md:text-display-h2 font-bold text-text-on-dark text-center mb-4 tracking-tight"
        >
          Earn on Your Own Schedule. No Paperwork. No Chasing.
        </h2>

        {/* Subheadline */}
        <p className="text-base md:text-lg text-text-muted-dark text-center max-w-2xl mx-auto mb-12">
          Swanza connects independent cleaning professionals with consistent
          local jobs, clear earnings visibility, and automatic Stripe payouts
          &mdash; so you can focus on the work.
        </p>

        {/* 3-column value props — stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {CLEANER_VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="flex flex-col gap-3">
              <span className="text-primary">{prop.icon}</span>
              <h3 className="text-display-h4 font-semibold text-text-on-dark">
                {prop.title}
              </h3>
              <p className="text-sm text-text-muted-dark leading-relaxed">
                {prop.body}
              </p>
            </div>
          ))}
        </div>

        {/* Secondary CTA — outline style, NOT primary teal fill */}
        <div className="flex flex-col items-center gap-4">
          <Button
            variant="secondary-dark"
            size="lg"
            asChild
            className="w-full md:w-auto"
          >
            <Link href="/become-a-cleaner">Become a Cleaner</Link>
          </Button>

          {/* Supporting trust line */}
          <p className="text-sm text-text-muted-dark text-center">
            Payouts via Stripe Connect. Earnings visible before every job.
            Simple mobile app.
          </p>
        </div>
      </div>
    </section>
  );
}
