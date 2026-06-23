import * as React from "react";
import { cn } from "@/lib/utils";
import { MapPin, ArrowRight } from "lucide-react";

// Source: design-system.md §MapLink
// Opens native maps on iOS/Android PWA via Google Maps URL scheme.
// Minimum 44px height touch target — full width on mobile.

interface MapLinkProps {
  address: string;
  className?: string;
}

export function MapLink({ address, className }: MapLinkProps) {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 min-h-[44px] w-full px-4 py-3 rounded-md",
        "text-text-on-dark transition-colors duration-150",
        "hover:text-primary border-b border-transparent hover:border-primary",
        "active:opacity-80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-app",
        className
      )}
      aria-label={`Open ${address} in Maps`}
    >
      <MapPin
        className="h-5 w-5 text-primary flex-shrink-0"
        aria-hidden="true"
      />
      <span className="flex-1 text-sm">{address}</span>
      <ArrowRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
    </a>
  );
}
