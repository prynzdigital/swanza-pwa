"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BottomNav } from "./BottomNav";
import { UserButton } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";

// Source: design-system.md Â§Nav/TopBar + Â§Nav/AppShell
// Dark shell for all authenticated views.
// TopBar: 56px fixed top. BottomNav: 60px fixed bottom (mobile only).
// Desktop: sidebar replaces bottom nav.

type Role = "customer" | "cleaner" | "admin";

interface AppShellProps {
  role: Role;
  pageTitle?: string;
  showBack?: boolean;
  children: React.ReactNode;
}

const ROLE_LABELS: Record<Role, string> = {
  customer: "Customer",
  cleaner: "Cleaner",
  admin: "Admin",
};

export function AppShell({
  role,
  pageTitle,
  showBack = false,
  children,
}: AppShellProps) {
  const router = useRouter();
  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen bg-surface-app dark-shell">
      {/* TopBar â€” fixed, 56px + safe area top */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "bg-surface-card border-b border-surface-divider",
          "h-14 flex items-center px-4 gap-3"
        )}
        style={{ paddingTop: "env(safe-area-inset-top, 0)" }}
      >
        {/* Left: back button or wordmark */}
        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center h-11 w-11 rounded-sm text-text-on-dark hover:bg-surface-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-app -ml-2"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href={`/${role}/dashboard`}
            className="text-lg font-extrabold text-text-on-dark tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            aria-label="Swanza â€” go to dashboard"
          >
            Swanza
          </Link>
        )}

        {/* Center: page title */}
        {pageTitle && (
          <h1 className="flex-1 text-center text-base font-semibold text-text-on-dark truncate">
            {pageTitle}
          </h1>
        )}

        {/* Right: role pill + avatar */}
        <div className="ml-auto flex items-center gap-2">
          <span
            className={cn(
              "text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md",
              isAdmin
                ? "bg-warning text-[#2A1800]"
                : "bg-surface-divider text-text-muted-dark"
            )}
          >
            {ROLE_LABELS[role]}
          </span>
          <UserButton />
        </div>
      </header>

      {/* Main content area â€” offset for top bar, bottom padding for bottom nav on mobile */}
      <main
        className={cn(
          "pt-14 pb-20 md:pb-0", // top bar offset + bottom nav clearance on mobile
          "min-h-screen"
        )}
        id="main-content"
      >
        {children}
      </main>

      {/* Bottom nav â€” mobile only */}
      <BottomNav role={role} />
    </div>
  );
}
