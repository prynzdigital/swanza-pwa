import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Briefcase, TrendingUp, FileX } from "lucide-react";

// Source: metadata.md §Become a Cleaner
// Source: wireframes.md §Page 4 — Become a Cleaner

export const metadata: Metadata = {
  title: "Cleaning Jobs in [CITY] | Join Swanza",
  description:
    "Get consistent cleaning jobs in [CITY]. Accept on your terms, see earnings upfront, and get paid automatically via Stripe. No paperwork.",
  // QA fix #012: canonical tag required per seo-strategy.md §8
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://swanza.com"}/become-a-cleaner`,
  },
  openGraph: {
    title: "Cleaning Jobs in [CITY] | Join Swanza",
    description:
      "Get consistent cleaning jobs in [CITY]. Accept on your terms, see earnings upfront, and get paid automatically via Stripe. No paperwork.",
  },
};

const VALUE_PROPS = [
  {
    icon: <Briefcase className="h-8 w-8" aria-hidden="true" />,
    title: "Steady Job Flow",
    body: "Stop relying on word of mouth and slow weeks. Swanza routes verified jobs to you based on your availability and service area.",
  },
  {
    icon: <TrendingUp className="h-8 w-8" aria-hidden="true" />,
    title: "Earnings You Can See",
    body: "Know what you earn before you accept a job. Your earnings dashboard updates in real time — no waiting for a check, no manual invoicing.",
  },
  {
    icon: <FileX className="h-8 w-8" aria-hidden="true" />,
    title: "Zero Paperwork",
    body: "No scheduling back-and-forth. No invoicing. No chasing clients. Accept jobs, complete them, and get paid automatically via Stripe Connect. That's it.",
  },
] as const;

const HOW_IT_WORKS_STEPS = [
  {
    number: "1",
    title: "Apply and Get Approved",
    body: "Visit this page and click \"Join as a Cleaner.\" You will create an account, complete your profile (experience, availability, service area), and submit your application for review. Once the Swanza operations team approves your account, you will receive a notification and your job dashboard will go live. The application is mobile-friendly and designed to take less than 10 minutes to complete.",
  },
  {
    number: "2",
    title: "Accept Jobs",
    body: "Browse available jobs in your area. You will see the job details — service type, location, and your payout amount — before you make any commitment. Accept what works for your schedule. You control your availability.",
  },
  {
    number: "3",
    title: "Get Paid",
    body: "Complete the job and mark it done in the app. Your payout is processed automatically via Stripe Connect after each completed job. No invoicing, no chasing, no paperwork.",
  },
];

const CLEANER_FAQ = [
  {
    q: "How do I join Swanza as a cleaner?",
    a: "Visit this page and click \"Join as a Cleaner.\" You will create an account, complete your profile (experience, availability, service area), and submit your application for review. Once the Swanza operations team approves your account, you will receive a notification and your job dashboard will go live. The application is mobile-friendly and designed to take less than 10 minutes to complete.",
  },
  {
    q: "What does the approval process involve?",
    a: "Every cleaner application is reviewed by the Swanza operations team before approval. The review confirms that your profile is complete and that you meet the platform's standards. [NEEDS CLIENT INPUT: specify the approval process steps — e.g., identity verification, background check, experience requirements, any interview or skills assessment. Also confirm the expected approval turnaround time.]",
  },
  {
    q: "How much will I earn per job?",
    a: "Your earnings for each job are displayed before you accept it. You will see the job details — service type, location, and your payout amount — before you make any commitment. There are no hidden deductions after job completion. Payouts are processed automatically via Stripe Connect after each completed job. [NEEDS CLIENT INPUT: specify the payout schedule and confirm the platform take-rate so cleaner earnings expectations can be set honestly.]",
  },
  {
    q: "How flexible is the schedule?",
    a: "You control your availability. Set the days and times you are available in your cleaner profile, and Swanza will only route job offers to you within those windows. You can update your availability at any time through the app. You can also accept or reject individual job offers — you are not required to accept every job that comes in. [NEEDS CLIENT INPUT: confirm whether there is a minimum acceptance rate requirement or any consequence for frequent job rejections.]",
  },
];

export default function BecomeACleanerPage() {
  return (
    <>
      {/* Hero — dark band to mirror cleaner app aesthetic */}
      <section
        className="bg-surface-dark-band py-space-3xl"
        aria-labelledby="cleaner-hero-heading"
      >
        <div className="max-w-content mx-auto px-space-xl">
          <h1
            id="cleaner-hero-heading"
            className="text-mobile-h1 md:text-display-h1 font-extrabold text-text-on-dark tracking-tight mb-6 max-w-readable"
          >
            Get Steady Cleaning Jobs in{" "}
            <span className="text-primary">[CITY]</span>
          </h1>
          <p className="text-lg text-text-muted-dark leading-relaxed mb-8 max-w-xl">
            Accept on your terms, see earnings upfront, and get paid
            automatically via Stripe Connect — no paperwork, no chasing clients.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/sign-up">Join as a Cleaner</Link>
          </Button>
          <p className="mt-4 text-sm text-text-muted-dark">
            Payouts via Stripe Connect. Earnings visible before every job.
            Simple mobile app.
          </p>
        </div>
      </section>

      {/* Cleaner Value Props */}
      <section
        className="bg-surface-page py-space-2xl"
        aria-labelledby="cleaner-value-heading"
      >
        <div className="max-w-content mx-auto px-space-xl">
          <h2
            id="cleaner-value-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-12 text-center"
          >
            Why Cleaners Choose Swanza
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUE_PROPS.map((prop) => (
              <article
                key={prop.title}
                className="bg-surface-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md hover:border-primary-light transition-all duration-200"
              >
                <span className="text-primary-light mb-4 block">{prop.icon}</span>
                <h3 className="text-display-h3 font-semibold text-text-primary mb-3">
                  {prop.title}
                </h3>
                <p className="text-base text-text-secondary leading-relaxed">
                  {prop.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — Cleaner Flow */}
      <section
        className="bg-surface-section-alt py-space-2xl"
        aria-labelledby="cleaner-steps-heading"
      >
        <div className="max-w-content mx-auto px-space-xl">
          <h2
            id="cleaner-steps-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-12 text-center"
          >
            How It Works for Cleaners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div key={step.number} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-12 w-12 rounded-full bg-surface-dark-band text-text-on-dark text-lg font-bold flex-shrink-0 border border-surface-divider">
                    {step.number}
                  </span>
                  {i < HOW_IT_WORKS_STEPS.length - 1 && (
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

      {/* Cleaner FAQ Preview */}
      <section
        className="bg-surface-white py-space-2xl"
        aria-labelledby="cleaner-faq-heading"
      >
        <div className="max-w-readable mx-auto px-space-xl">
          <h2
            id="cleaner-faq-heading"
            className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-8 text-center"
          >
            Common Questions from Cleaners
          </h2>
          <dl className="space-y-6">
            {CLEANER_FAQ.map((item, i) => (
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
          <div className="text-center mt-8">
            <Link
              href="/faq#cleaners"
              className="text-sm font-medium text-primary-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light rounded-sm"
            >
              More questions? See our full FAQ →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA — dark band */}
      <section className="bg-surface-dark-band py-space-3xl text-center">
        <div className="max-w-content mx-auto px-space-xl">
          <h2 className="text-mobile-h2 md:text-display-h2 font-bold text-text-on-dark tracking-tight mb-4">
            Ready to Start Taking Jobs?
          </h2>
          <p className="text-base text-text-muted-dark mb-8">
            Apply takes less than 10 minutes.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/sign-up">Apply Now</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
