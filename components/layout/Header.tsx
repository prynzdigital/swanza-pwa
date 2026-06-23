"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

// Source: wireframes.md — Public Nav/PublicHeader
// Sticky header, light background. Desktop nav + mobile hamburger.
// "Book a Cleaner" is always the dominant primary CTA.

const NAV_LINKS = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 bg-surface-page border-b border-border">
      <div className="max-w-content mx-auto px-space-xl h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-xl font-extrabold text-text-primary tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light rounded-sm"
          aria-label="Swanza — go to homepage"
        >
          Swanza
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-6"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light rounded-sm px-1",
                pathname === link.href
                  ? "text-primary-light"
                  : "text-text-secondary hover:text-text-primary"
              )}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {!isSignedIn && (
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
          )}
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
          <Button asChild size="default">
            <Link href="/book">Book a Cleaner</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center h-11 w-11 rounded-sm text-text-primary hover:bg-surface-section-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-surface-page border-t border-border z-50"
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          <nav className="flex flex-col px-space-md py-space-md gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center h-11 px-4 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-surface-section-alt text-primary-light"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-section-alt"
                )}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border my-2" />
            {!isSignedIn && (
              <Link
                href="/sign-in"
                className="flex items-center h-11 px-4 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-section-alt"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
            {isSignedIn && (
              <div className="flex items-center px-4 h-11">
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
            <Button asChild size="full" className="mt-2">
              <Link href="/book" onClick={() => setMobileOpen(false)}>
                Book a Cleaner
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
