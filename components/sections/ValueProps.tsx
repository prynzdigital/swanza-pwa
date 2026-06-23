import React from "react";
import { UserCheck, DollarSign, Activity } from "lucide-react";

// Source: wireframes.md §[VALUE PROPS] — Homepage
// Source: homepage.md §[VALUE PROPS]

const VALUE_PROPS = [
  {
    icon: <UserCheck className="h-8 w-8" aria-hidden="true" />,
    title: "Cleaners Who Actually Show Up",
    body: "Every independent cleaner on Swanza is reviewed and admin-approved before they can take a single job. No unknown strangers — a qualified professional, verified before arrival.",
    note: "[NEEDS CLIENT INPUT: confirm specific vetting steps (background check, ID verification, skills review) to replace with precise language]",
  },
  {
    icon: <DollarSign className="h-8 w-8" aria-hidden="true" />,
    title: "You Know the Price Before You Pay",
    body: "Swanza shows you a firm price estimate during booking — before your card is charged. What you see is what you pay. No calls, no quotes, no after-the-fact charges.",
  },
  {
    icon: <Activity className="h-8 w-8" aria-hidden="true" />,
    title: "Real-Time Status, End to End",
    body: "Forget wondering whether anyone is coming. Once your booking is confirmed, your cleaner's status updates live — the same way you track a rideshare or a food delivery. Assigned. En Route. In Progress. Done.",
  },
] satisfies Array<{ icon: React.ReactNode; title: string; body: string; note?: string }>;

export function ValueProps() {
  return (
    <section
      className="bg-surface-white py-space-2xl"
      aria-labelledby="value-props-heading"
    >
      <div className="max-w-content mx-auto px-space-xl">
        <h2
          id="value-props-heading"
          className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary text-center mb-12 tracking-tight"
        >
          Built for People Who Expect More Than a Phone Call
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
              {/* Client input note rendered as accessible hidden comment */}
              {prop.note && (
                <p className="mt-3 text-xs text-warning bg-warning/10 rounded-md px-3 py-2 border border-warning/30">
                  {prop.note}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
