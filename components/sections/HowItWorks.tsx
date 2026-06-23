import React from "react";
import { Search, CreditCard, MapPin } from "lucide-react";

// Source: wireframes.md §[HOW IT WORKS] — Homepage
// Source: homepage.md §[HOW IT WORKS]

const STEPS = [
  {
    number: "1",
    icon: <Search className="h-8 w-8" aria-hidden="true" />,
    title: "Choose Your Service",
    body: "Select residential cleaning and tell us about your space. Pick the service type that fits.",
  },
  {
    number: "2",
    icon: <CreditCard className="h-8 w-8" aria-hidden="true" />,
    title: "Book and Pay",
    body: "Choose a date and time. Review your upfront price. Pay securely via Stripe — no hidden fees, no post-job billing surprises.",
  },
  {
    number: "3",
    icon: <MapPin className="h-8 w-8" aria-hidden="true" />,
    title: "Track and Relax",
    body: "An approved independent cleaner is assigned. Watch their status update in real time:",
    statusLine: "Assigned → Accepted → En Route → In Progress → Completed",
  },
] satisfies Array<{ number: string; icon: React.ReactNode; title: string; body: string; statusLine?: string }>;

export function HowItWorks() {
  return (
    <section
      className="bg-surface-page py-space-2xl"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-content mx-auto px-space-xl">
        <h2
          id="how-it-works-heading"
          className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary text-center mb-12 tracking-tight"
        >
          How Swanza Works
        </h2>

        {/* Desktop: 3-column. Mobile: stacked with horizontal rule dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8">
          {STEPS.map((step, i) => (
            <div key={step.number}>
              {/* Mobile divider */}
              {i > 0 && (
                <hr
                  className="md:hidden border-border mb-8"
                  aria-hidden="true"
                />
              )}

              <div className="flex flex-col items-start gap-4">
                {/* Step number circle + icon */}
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-light text-white text-lg font-bold flex-shrink-0"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <span className="text-primary-light">{step.icon}</span>
                </div>

                <h3 className="text-display-h4 font-semibold text-text-primary">
                  {step.title}
                </h3>

                <p className="text-base text-text-secondary leading-relaxed">
                  {step.body}
                </p>

                {step.statusLine && (
                  // QA fix #001: replaced text-text-muted (#7A8C8C, 3.9:1) with text-text-secondary (#4A5A5A, 6.8:1) — text-muted fails WCAG 2.1 AA at text-xs on light backgrounds
                  <p className="text-xs text-text-secondary font-medium tracking-wide">
                    {step.statusLine}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
