import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Source: wireframes.md §[FINAL CTA BAND] — Homepage
// Source: homepage.md §[FINAL CTA BAND]
// Background: surface-section-alt. Customer-facing only.
// Mirrors hero CTA to close the page loop.

interface CTABandProps {
  variant?: "customer" | "dual";
}

export function CTABand({ variant = "customer" }: CTABandProps) {
  return (
    <section
      className="bg-surface-section-alt py-space-3xl"
      aria-labelledby="cta-band-heading"
    >
      <div className="max-w-content mx-auto px-space-xl text-center">
        <h2
          id="cta-band-heading"
          className="text-mobile-h2 md:text-display-h2 font-bold text-text-primary tracking-tight mb-4"
        >
          Your next clean is three taps away.
        </h2>

        <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8">
          Pick a service, see your price, pay securely. A vetted independent
          cleaner takes it from there.
        </p>

        {variant === "dual" ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/sign-up">Book a Cleaner</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/become-a-cleaner">Become a Cleaner</Link>
            </Button>
          </div>
        ) : (
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/sign-up">Book a Cleaner</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
