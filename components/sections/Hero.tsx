import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";

// Source: wireframes.md §[HERO] — Homepage Page 1
// Source: homepage.md §[HERO]
// [CITY] placeholder rendered visually per design spec

interface HeroProps {
  city?: string;
}

export function Hero({ city = "[CITY]" }: HeroProps) {
  return (
    <section
      className="bg-surface-page py-space-3xl"
      aria-label="Hero section"
    >
      <div className="max-w-content mx-auto px-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left column — text content */}
          <div className="order-2 md:order-1">
            {/* H1 — per metadata.md */}
            <h1 className="text-mobile-h1 md:text-display-h1 font-extrabold text-text-primary tracking-tight mb-6">
              Book a Cleaner in{" "}
              <span className="text-primary-light">{city}</span>. Track Them to
              Your Door.
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-lg">
              Upfront pricing. Vetted independent cleaners. Real-time job status
              from the moment you book until the moment the job is done. No
              calls, no surprises.
            </p>

            {/* Primary CTA — Book a Cleaner */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/book">Book a Cleaner</Link>
              </Button>
            </div>

            {/* Trust credential line */}
            {/* QA fix #001: replaced text-text-muted (#7A8C8C, 3.9:1) with text-text-secondary (#4A5A5A, 6.8:1) — text-muted fails WCAG 2.1 AA at text-sm on light backgrounds */}
            <p className="flex items-center gap-2 text-sm text-text-secondary">
              <ShieldCheck
                className="h-4 w-4 text-primary-light flex-shrink-0"
                aria-hidden="true"
              />
              Cleaners reviewed and admin-approved before they enter the job
              pool. Payment via Stripe.
            </p>
          </div>

          {/* Right column — app UI mockup placeholder */}
          {/*
            [NEEDS CLIENT INPUT: Hero image direction per homepage.md]
            Design spec: App UI screenshot showing Booking Tracker "En Route" state
            with cleaner pin on dark map in mobile device frame.
            Developer note: Placeholder shown until real UI screenshot is captured
            from the built app. Replace /hero-app-mockup.png with actual screenshot.
          */}
          <div className="order-1 md:order-2 flex justify-center">
            <div
              className="relative w-full max-w-[320px] aspect-[9/16] md:aspect-auto md:h-[480px] rounded-3xl bg-surface-app border-2 border-surface-divider shadow-2xl overflow-hidden"
              aria-label="App UI mockup showing booking tracker in En Route status"
              role="img"
            >
              {/* Placeholder dark screen simulating the app UI */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-4">
                <div className="w-full rounded-xl bg-surface-card p-4 border border-surface-divider">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted-dark mb-2">
                    Booking Status
                  </p>
                  <div className="flex flex-col gap-2">
                    {["Assigned", "Accepted", "En Route"].map((s, i) => (
                      <div
                        key={s}
                        className={`flex items-center gap-2 ${i < 2 ? "opacity-50" : ""}`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            i === 0
                              ? "bg-status-assigned"
                              : i === 1
                              ? "bg-status-accepted"
                              : "bg-status-en-route animate-ring-pulse"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            i === 2
                              ? "text-status-en-route-text"
                              : "text-text-muted-dark"
                          }`}
                        >
                          {s}
                          {i === 2 && " — Maria G."}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-text-muted-dark text-center">
                  App screenshot placeholder — replaced at launch
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
