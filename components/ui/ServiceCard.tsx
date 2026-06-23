import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Check } from "lucide-react";
import Link from "next/link";

// Source: design-system.md §ServiceCard
// Used on public /services page — light context

interface ServiceCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  problemStatement?: string;
  included: string[];
  whoItsFor: string;
  ctaLabel: string;
  ctaHref?: string;
  badge?: string; // e.g., "Most Thorough"
  className?: string;
  altBackground?: boolean;
}

export function ServiceCard({
  icon,
  name,
  description,
  problemStatement,
  included,
  whoItsFor,
  ctaLabel,
  ctaHref = "/sign-up",
  badge,
  className,
  altBackground = false,
}: ServiceCardProps) {
  return (
    <article
      className={cn(
        "rounded-lg border border-border bg-surface-white shadow-sm hover:border-primary-light hover:shadow-md transition-all duration-200 p-10 max-w-card mx-auto w-full focus-within:ring-2 focus-within:ring-primary-light",
        altBackground && "bg-surface-section-alt",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <span
            className="text-primary-light flex-shrink-0"
            aria-hidden="true"
          >
            {icon}
          </span>
          <h3 className="text-display-h3 font-semibold text-text-primary">
            {name}
          </h3>
        </div>
        {badge && (
          <span className="text-[11px] font-semibold uppercase tracking-wide bg-surface-section-alt text-text-secondary border border-border rounded-md px-2.5 py-1 flex-shrink-0">
            {badge}
          </span>
        )}
      </div>

      <p className="text-body-lg text-text-primary mb-3">{description}</p>

      {problemStatement && (
        <p className="text-body text-text-secondary mb-6">{problemStatement}</p>
      )}

      {/* Included items checklist */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-text-primary mb-3">
          What&rsquo;s Included
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5" role="list">
          {included.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-text-secondary"
            >
              <Check
                className="h-4 w-4 text-status-completed flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Who it's for */}
      <p className="italic text-sm text-text-secondary mb-6">
        <strong className="not-italic font-semibold text-text-primary">
          Who it&rsquo;s for:{" "}
        </strong>
        {whoItsFor}
      </p>

      <Button asChild size="default" className="w-full sm:w-auto">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </article>
  );
}
