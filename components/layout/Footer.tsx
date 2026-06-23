import React from "react";
import Link from "next/link";

// Source: wireframes.md — Public Footer
// Background: surface-dark-band (#0D1414). Text: text-on-dark.
// Tagline: "Book. Track. Done."

const FOOTER_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/become-a-cleaner", label: "Become a Cleaner" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-surface-dark-band text-text-on-dark"
      aria-label="Site footer"
    >
      <div className="max-w-content mx-auto px-space-xl py-space-2xl">
        {/* Desktop: two-column layout */}
        <div className="hidden md:flex items-start justify-between gap-8 mb-space-lg">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-extrabold text-text-on-dark tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              aria-label="Swanza — go to homepage"
            >
              Swanza
            </Link>
            <p className="text-sm text-text-muted-dark mt-2">
              Book. Track. Done.
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation" className="flex gap-6 flex-wrap justify-end">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-muted-dark hover:text-text-on-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile: stacked layout */}
        <div className="md:hidden mb-space-lg">
          <Link
            href="/"
            className="text-xl font-extrabold text-text-on-dark tracking-tight block mb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            aria-label="Swanza — go to homepage"
          >
            Swanza
          </Link>
          <p className="text-sm text-text-muted-dark mb-space-md">
            Book. Track. Done.
          </p>
          <nav
            aria-label="Footer navigation"
            className="flex flex-col gap-1"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm text-text-muted-dark hover:text-text-on-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface-divider pt-space-md flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-muted-dark">
            &copy; {currentYear} Swanza. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-xs text-text-muted-dark hover:text-text-on-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-text-muted-dark hover:text-text-on-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
