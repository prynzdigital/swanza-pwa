import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ValueProps } from "@/components/sections/ValueProps";
import { SocialProof } from "@/components/sections/SocialProof";
import { CleanerRecruitment } from "@/components/sections/CleanerRecruitment";
import { CTABand } from "@/components/sections/CTABand";
import { Shield, Tag, Activity, Lock } from "lucide-react";

// Source: metadata.md §Homepage
// [CITY] placeholder used until Q1 (target city) is resolved

export const metadata: Metadata = {
  title: "Book a Cleaner in [CITY] | Swanza",
  description:
    "Book residential cleaning in [CITY] in minutes. Upfront pricing, vetted cleaners, real-time tracking. Pay securely online.",
  // QA fix #012: canonical tag required per seo-strategy.md §8
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://swanza.com"}/`,
  },
  openGraph: {
    title: "Book a Cleaner in [CITY] | Swanza",
    description:
      "Book residential cleaning in [CITY] in minutes. Upfront pricing, vetted cleaners, real-time tracking.",
  },
};

// Schema.org SoftwareApplication JSON-LD
// Source: seo-strategy.md §Schema Strategy — Primary Schema
const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Swanza",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS (PWA), Android (PWA)",
  description:
    "Swanza is a residential cleaning marketplace PWA. Book vetted independent cleaners online, pay upfront, and track your cleaner in real time.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://swanza.com",
  // offers: [NEEDS CLIENT INPUT: service pricing for offers schema]
  // aggregateRating: add after launch with real review data
};

const TRUST_BADGES = [
  {
    icon: <Shield className="h-6 w-6 text-primary-light" aria-hidden="true" />,
    label: "Vetted Cleaners",
    description: "Every independent cleaner is reviewed and admin-approved before taking jobs",
  },
  {
    icon: <Tag className="h-6 w-6 text-primary-light" aria-hidden="true" />,
    label: "Upfront Pricing",
    description: "See your exact price before you pay. No surprise fees.",
  },
  {
    icon: <Activity className="h-6 w-6 text-primary-light" aria-hidden="true" />,
    label: "Real-Time Tracking",
    description: "Track your cleaner from assignment to completion, like a delivery app",
  },
  {
    icon: <Lock className="h-6 w-6 text-primary-light" aria-hidden="true" />,
    label: "Secure Payment",
    description: "Payments processed by Stripe. Your card data never touches our servers.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />

      {/* [HERO] */}
      <Hero city="[CITY]" />

      {/* [TRUST BADGES] */}
      <section
        className="bg-surface-section-alt py-8"
        aria-label="Trust indicators"
      >
        <div className="max-w-content mx-auto px-space-xl">
          <ul
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            role="list"
          >
            {TRUST_BADGES.map((badge) => (
              <li
                key={badge.label}
                className="flex flex-col items-center text-center gap-2"
              >
                {badge.icon}
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* [HOW IT WORKS] */}
      <HowItWorks />

      {/* [VALUE PROPS] */}
      <ValueProps />

      {/* [SOCIAL PROOF] */}
      <SocialProof />

      {/* [CLEANER RECRUITMENT] — Secondary funnel, distinct dark section */}
      <CleanerRecruitment />

      {/* [FINAL CTA BAND] — Customer-facing, closes the page loop */}
      <CTABand variant="customer" />
    </>
  );
}
