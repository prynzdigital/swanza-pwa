import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Source: metadata.md §FAQ
// Source: wireframes.md §Page 6 — FAQ
// Source: faq.md — verbatim copy

export const metadata: Metadata = {
  title: "Cleaning Service FAQ | Swanza",
  description:
    "Answers to common questions about booking a cleaner, pricing, vetting, cancellations, and how Swanza works for both customers and cleaners.",
  // QA fix #012: canonical tag required per seo-strategy.md §8
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://swanza.com"}/faq`,
  },
  openGraph: {
    title: "Cleaning Service FAQ | Swanza",
    description:
      "Answers to common questions about booking a cleaner, pricing, vetting, cancellations, and how Swanza works for both customers and cleaners.",
  },
};

const CUSTOMER_FAQS = [
  {
    q: "Is the cleaner actually vetted before they come to my home?",
    a: "Yes. Every independent cleaner on Swanza goes through an admin review and approval process before they can accept any jobs. A cleaner who has not been approved does not appear in the job pool and cannot be assigned to a booking. [NEEDS CLIENT INPUT: specify the exact vetting steps — e.g., identity verification, background check provider, experience review, in-person or virtual interview.]",
  },
  {
    q: "How does pricing work? Will the price change after I book?",
    a: "No. Swanza shows you the exact price for your clean during the booking flow — before you ever reach the payment screen. The price you confirm is the price you pay. There are no post-job adjustments, no \"we'll invoice you for extra time,\" and no calls asking for more. Pricing is calculated based on your service type, home size, and booking date. [NEEDS CLIENT INPUT: once the pricing model is confirmed, add a sentence here explaining the logic.]",
  },
  {
    q: "What if no one shows up?",
    a: "Swanza's status tracking is designed specifically to eliminate this anxiety. Once your booking is confirmed, you can see your job's live status update in real time: Assigned → Accepted → En Route → In Progress → Completed. If your cleaner's status does not progress as expected, our operations team monitors active bookings and can manually reassign an approved cleaner. You are never left guessing.",
  },
  {
    q: "Is my payment information safe?",
    a: "Yes. Swanza processes all payments through Stripe — the same payment infrastructure used by Uber, Lyft, DoorDash, and millions of other platforms worldwide. Your card details are never stored on Swanza's servers. All transactions are handled entirely within Stripe's secure payment environment.",
  },
  {
    q: "I've had bad experiences with cleaning platforms before. Why is Swanza different?",
    a: "The platforms that frustrated you most likely had thin vetting, opaque pricing, and no operational layer between you and the cleaner. When something went wrong, there was nowhere to turn. Swanza is built around three specific problems: unreliable cleaner discovery, opaque pricing, and no accountability after booking. Every cleaner is admin-approved before taking jobs. Your price is shown before payment. Your job status updates in real time. And there is an operations team actively monitoring active bookings — not just an algorithm. That said, Swanza is a new platform. We cannot promise perfection. What we can commit to is that when something goes wrong, you will be able to reach us and we will act on it.",
  },
  {
    q: "Can I book the same cleaner every time?",
    a: "Swanza's system assigns an approved independent cleaner based on availability and your location. For recurring bookings, the app will attempt to match you with the same cleaner where schedule and availability allow. [NEEDS CLIENT INPUT: confirm whether preferred-cleaner matching is a feature in MVP scope. If not available at launch, update this answer.]",
  },
  {
    q: "Can I cancel or reschedule a booking?",
    a: "[NEEDS CLIENT INPUT: define the cancellation and rescheduling policy before launch. At minimum, specify: (1) the cancellation window, (2) what happens to the payment if cancelled inside the window, and (3) how to reschedule.]",
  },
  {
    q: "What services do you offer?",
    a: "At launch, Swanza offers three residential cleaning services: Standard Cleaning, Deep Cleaning, and Move-In/Move-Out Cleaning. Additional service categories and add-ons are on the roadmap. See the full details for each service on the Services page.",
    link: { label: "Services page", href: "/services" },
  },
];

const CLEANER_FAQS = [
  {
    q: "How do I join Swanza as a cleaner?",
    a: "Visit the Become a Cleaner page and click \"Join as a Cleaner.\" You will create an account, complete your profile (experience, availability, service area), and submit your application for review. Once the Swanza operations team approves your account, you will receive a notification and your job dashboard will go live. The application is mobile-friendly and designed to take less than 10 minutes to complete.",
    link: { label: "Become a Cleaner", href: "/become-a-cleaner" },
  },
  {
    q: "What does the approval process involve?",
    a: "Every cleaner application is reviewed by the Swanza operations team before approval. The review confirms that your profile is complete and that you meet the platform's standards. [NEEDS CLIENT INPUT: specify the approval process steps — e.g., identity verification, background check, experience requirements, any interview or skills assessment. Also confirm the expected approval turnaround time.]",
  },
  {
    q: "How much will I earn per job?",
    a: "Your earnings for each job are displayed before you accept it. You will see the job details — service type, location, and your payout amount — before you make any commitment. There are no hidden deductions after job completion. Payouts are processed automatically via Stripe Connect after each completed job. [NEEDS CLIENT INPUT: specify the payout schedule and confirm the platform take-rate so cleaner earnings expectations can be set honestly. Also confirm cancellation protection.]",
  },
  {
    q: "How flexible is the schedule?",
    a: "You control your availability. Set the days and times you are available in your cleaner profile, and Swanza will only route job offers to you within those windows. You can update your availability at any time through the app. You can also accept or reject individual job offers — you are not required to accept every job that comes in. [NEEDS CLIENT INPUT: confirm whether there is a minimum acceptance rate requirement or any consequence for frequent job rejections.]",
  },
  {
    q: "Will there actually be enough jobs?",
    a: "[NEEDS CLIENT INPUT: this is the most critical objection for the cleaner funnel at launch. Swanza must give an honest answer here — do not over-promise. Options include: (a) describing the launch market and expected demand ramp, (b) committing to a minimum job volume per week per cleaner if that is feasible, or (c) being transparent: \"We are actively building customer demand in [CITY]. We will only approve as many cleaners as we can keep busy.\"]",
  },
];

const GENERAL_FAQS = [
  {
    q: "Where does Swanza operate?",
    a: "Swanza is currently available in [CITY]. [NEEDS CLIENT INPUT: Q1 and Q9 — target city/cities for MVP launch and service radius/geographic boundaries. Once confirmed, update this answer with the specific city name and coverage area.]",
  },
  {
    q: "Is Swanza insured?",
    a: "[NEEDS CLIENT INPUT: confirm Swanza's insurance position before launch. This is a direct customer trust question. Options to confirm with client: (a) Swanza carries platform-level general liability insurance, (b) Swanza requires cleaners to carry their own insurance as a condition of approval, (c) neither at MVP — in which case, answer honestly and do not claim coverage that does not exist.]",
  },
  {
    q: "What happens if there is a problem with my booking?",
    a: "Contact Swanza support at [NEEDS CLIENT INPUT: support email address] within 24 hours of your booking's scheduled end time. Describe the issue and our operations team will review it. [NEEDS CLIENT INPUT: confirm the dispute resolution process — e.g., what qualifies for a rebook vs. a refund, the timeline for resolution, and whether there is an in-app dispute tool or purely email-based support at MVP launch.]",
  },
  {
    q: "How does Swanza make money?",
    a: "Swanza earns a platform fee on each booking — a percentage of the total booking value. The remainder goes to the independent cleaner who completed the job via automatic Stripe Connect payout. [NEEDS CLIENT INPUT: confirm whether disclosing the take-rate publicly is desired.]",
  },
  {
    q: "Are the cleaners Swanza employees?",
    a: "Swanza connects customers with independent cleaners — cleaning professionals who operate independently and manage their own work through the platform. [NEEDS CLIENT INPUT: Q10 — the worker classification question is unresolved. Once legal structure is confirmed (W-2, 1099, or another arrangement), this answer must be updated to accurately reflect the employment relationship. This is a legally sensitive question — do not finalize until confirmed with counsel.]",
  },
];

// FAQPage schema — seo-strategy.md §Schema Strategy — Tertiary Schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    ...CUSTOMER_FAQS.slice(0, 5).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.replace(/\[NEEDS CLIENT INPUT:[^\]]*\]/g, "").trim(),
      },
    })),
  ],
};

function FAQSection({
  id,
  heading,
  items,
  altBg = false,
}: {
  id: string;
  heading: string;
  items: typeof CUSTOMER_FAQS;
  altBg?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-space-2xl ${altBg ? "bg-surface-section-alt" : "bg-surface-white"}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="max-w-readable mx-auto px-space-xl">
        <h2
          id={`${id}-heading`}
          className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-8"
        >
          {heading}
        </h2>
        <dl className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="border-b border-border pb-6 last:border-0">
              <dt className="text-display-h4 font-semibold text-text-primary mb-3">
                {item.q}
              </dt>
              <dd className="text-base text-text-secondary leading-relaxed">
                {item.a}
                {"link" in item && item.link && (
                  <>
                    {" "}
                    <Link
                      href={item.link.href}
                      className="text-primary-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light rounded-sm"
                    >
                      {item.link.label}
                    </Link>
                    .
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Page Intro */}
      <section className="bg-surface-page py-space-2xl">
        <div className="max-w-readable mx-auto px-space-xl">
          <h1 className="text-mobile-h1 md:text-display-h1 font-extrabold text-text-primary tracking-tight mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Questions about booking a clean, signing up as a cleaner, or how
            Swanza works? Find answers below. If something isn&rsquo;t covered,
            contact us at{" "}
            <span className="text-warning">
              [NEEDS CLIENT INPUT: support email address]
            </span>
            .
          </p>
        </div>
      </section>

      {/* Jump links */}
      <nav
        aria-label="FAQ sections"
        className="bg-surface-white border-b border-border sticky top-16 z-30"
      >
        <div className="max-w-readable mx-auto px-space-xl">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {[
              { href: "#customers", label: "For Customers" },
              { href: "#cleaners", label: "For Cleaners" },
              { href: "#general", label: "General" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex-shrink-0 px-4 h-11 flex items-center text-[13px] font-medium uppercase tracking-wide text-text-secondary hover:text-primary-light hover:bg-surface-section-alt rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* FAQ Sections */}
      <FAQSection id="customers" heading="For Customers" items={CUSTOMER_FAQS} />
      <FAQSection
        id="cleaners"
        heading="For Cleaners"
        items={CLEANER_FAQS}
        altBg
      />
      <FAQSection id="general" heading="General" items={GENERAL_FAQS} />

      {/* Page CTA Band */}
      <section className="bg-surface-dark-band py-20">
        <div className="max-w-content mx-auto px-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Customer CTA */}
            <div className="text-center md:text-left">
              <p className="text-base text-text-muted-dark mb-4">
                Ready to book?
              </p>
              <Button asChild size="lg" className="w-full md:w-auto">
                <Link href="/sign-up">Book a Cleaner</Link>
              </Button>
            </div>

            {/* Divider — desktop only */}
            <div
              className="hidden md:block absolute left-1/2 h-16 w-px bg-surface-divider"
              aria-hidden="true"
            />

            {/* Cleaner CTA */}
            <div className="text-center md:text-left">
              <p className="text-base text-text-muted-dark mb-4">
                Ready to join?
              </p>
              <Button
                asChild
                variant="secondary-dark"
                size="lg"
                className="w-full md:w-auto"
              >
                <Link href="/become-a-cleaner">Become a Cleaner</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
