"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  CalendarPlus,
  CalendarDays,
  User,
  Briefcase,
  Zap,
  TrendingUp,
  BarChart3,
  Users,
} from "lucide-react";

// Source: design-system.md §Nav/AppShell — three role variants
// Fixed to viewport bottom. Uses env(safe-area-inset-bottom) for notched devices.
// Minimum 44×44px per tab. Total height: 60px + safe area.

type Role = "customer" | "cleaner" | "admin";

interface NavTab {
  href: string;
  label: string;
  icon: React.ReactNode;
  matchPrefix?: boolean;
}

const CUSTOMER_TABS: NavTab[] = [
  { href: "/customer/dashboard", label: "Home", icon: <Home className="h-6 w-6" /> },
  { href: "/book", label: "Book", icon: <CalendarPlus className="h-6 w-6" />, matchPrefix: true },
  { href: "/customer/bookings", label: "My Bookings", icon: <CalendarDays className="h-6 w-6" /> },
  { href: "/customer/account", label: "Account", icon: <User className="h-6 w-6" /> },
];

const CLEANER_TABS: NavTab[] = [
  { href: "/cleaner/dashboard", label: "Jobs", icon: <Briefcase className="h-6 w-6" /> },
  { href: "/cleaner/active", label: "Active", icon: <Zap className="h-6 w-6" /> },
  { href: "/cleaner/earnings", label: "Earnings", icon: <TrendingUp className="h-6 w-6" /> },
  { href: "/cleaner/account", label: "Account", icon: <User className="h-6 w-6" /> },
];

const ADMIN_TABS: NavTab[] = [
  { href: "/admin/dashboard", label: "Overview", icon: <BarChart3 className="h-6 w-6" /> },
  { href: "/admin/bookings", label: "Bookings", icon: <CalendarDays className="h-6 w-6" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="h-6 w-6" /> },
  { href: "/admin/revenue", label: "Revenue", icon: <TrendingUp className="h-6 w-6" /> },
];

const TABS_BY_ROLE: Record<Role, NavTab[]> = {
  customer: CUSTOMER_TABS,
  cleaner: CLEANER_TABS,
  admin: ADMIN_TABS,
};

interface BottomNavProps {
  role: Role;
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const tabs = TABS_BY_ROLE[role];

  const isActive = (tab: NavTab): boolean => {
    if (tab.matchPrefix) return pathname.startsWith(tab.href);
    return pathname === tab.href || pathname.startsWith(tab.href + "/");
  };

  return (
    <nav
      aria-label={`${role} navigation`}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-surface-card border-t border-surface-divider",
        "safe-area-inset-bottom",
        // Only show bottom nav on mobile — desktop uses sidebar
        "md:hidden"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
    >
      <div className="flex h-[60px]">
        {tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5",
                "min-h-[44px] min-w-[60px]",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                active
                  ? "text-primary"
                  : "text-icon-on-dark hover:text-text-on-dark"
              )}
              aria-current={active ? "page" : undefined}
              aria-label={tab.label}
            >
              {/* Active indicator dot */}
              {active && (
                <span
                  className="absolute top-1 h-1 w-1 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
              {tab.icon}
              <span className="text-[11px] font-medium leading-none">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
