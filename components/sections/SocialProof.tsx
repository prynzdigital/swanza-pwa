import React from "react";
import { Star, ShieldCheck, Lock, CheckCircle } from "lucide-react";

// Source: wireframes.md §[SOCIAL PROOF] — Homepage
// Source: homepage.md §[SOCIAL PROOF]
// [NEEDS CLIENT INPUT: real testimonials required — placeholders shown]

const TESTIMONIAL_PLACEHOLDER = {
  stars: 5,
  quote:
    "[NEEDS CLIENT INPUT: real customer review text — 1–2 sentences, specific and genuine]",
  name: "[First Name]",
  location: "[Neighborhood]",
};

const TRUST_BADGES = [
  {
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    label: "Background-Checked Cleaners",
    note: "[NEEDS CLIENT INPUT: confirm background check process]",
  },
  {
    icon: <CheckCircle className="h-5 w-5" aria-hidden="true" />,
    label: "Admin-Approved Cleaner Pool",
  },
  {
    icon: <Lock className="h-5 w-5" aria-hidden="true" />,
    label: "Stripe-Secured Payments",
  },
] satisfies Array<{ icon: React.ReactNode; label: string; note?: string }>;

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`} role="img">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < count ? "fill-warning text-warning" : "text-border"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function SocialProof() {
  return (
    <section
      className="bg-surface-section-alt py-space-2xl"
      aria-labelledby="social-proof-heading"
    >
      <div className="max-w-content mx-auto px-space-xl">
        <h2
          id="social-proof-heading"
          className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary text-center mb-12 tracking-tight"
        >
          What Customers Are Saying
        </h2>

        {/* Testimonial cards — 3-column desktop, stacked mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="bg-surface-white border border-border rounded-lg p-6 shadow-sm"
            >
              <StarRating count={TESTIMONIAL_PLACEHOLDER.stars} />
              <blockquote className="mt-3 text-base text-text-secondary italic leading-relaxed">
                &ldquo;{TESTIMONIAL_PLACEHOLDER.quote}&rdquo;
              </blockquote>
              <footer className="mt-4 text-sm font-medium text-text-primary">
                &mdash; {TESTIMONIAL_PLACEHOLDER.name},{" "}
                {TESTIMONIAL_PLACEHOLDER.location}
              </footer>
            </article>
          ))}
        </div>

        {/* Trust badge row */}
        <div className="flex flex-wrap justify-center gap-6">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-sm text-text-secondary"
            >
              <span className="text-primary-light">{badge.icon}</span>
              <span>{badge.label}</span>
              {badge.note && (
                <span className="sr-only">{badge.note}</span>
              )}
            </div>
          ))}
        </div>

        {/* [NEEDS CLIENT INPUT] visible note for staging — remove at launch */}
        <p className="mt-8 text-xs text-warning text-center bg-warning/10 rounded-md px-4 py-2 border border-warning/30 max-w-2xl mx-auto">
          [NEEDS CLIENT INPUT: Replace placeholder testimonials with 3–5 real
          customer reviews. Format: quote text, first name, neighborhood. Also
          confirm background check process and insurance status for trust badges.]
        </p>
      </div>
    </section>
  );
}
