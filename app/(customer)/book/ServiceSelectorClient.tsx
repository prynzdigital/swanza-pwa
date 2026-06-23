"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ServiceType } from "@prisma/client";
import { Minus, Plus } from "lucide-react";

// Source: wireframes.md §Page 8 — Book Step 1 (client component for interactivity)

interface ServiceSelectorClientProps {
  serviceTypes: ServiceType[];
}

export function ServiceSelectorClient({
  serviceTypes,
}: ServiceSelectorClientProps) {
  const router = useRouter();
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);

  const handleContinue = () => {
    if (!selectedServiceId) return;
    // Store selection in URL params for the next step
    const params = new URLSearchParams({
      serviceTypeId: selectedServiceId,
      bedrooms: bedrooms.toString(),
      bathrooms: bathrooms.toString(),
    });
    router.push(`/book/schedule?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Service radio group */}
      <fieldset>
        <legend className="sr-only">Select a cleaning service</legend>
        <div className="space-y-3" role="radiogroup">
          {serviceTypes.map((service) => (
            <label
              key={service.id}
              className={cn(
                "flex items-start gap-4 min-h-16 p-4 rounded-lg border-2 cursor-pointer transition-all",
                "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface-app",
                selectedServiceId === service.id
                  ? "border-primary bg-primary-dim"
                  : "border-surface-divider bg-surface-card hover:border-surface-card-hover"
              )}
            >
              <input
                type="radio"
                name="serviceType"
                value={service.id}
                checked={selectedServiceId === service.id}
                onChange={() => setSelectedServiceId(service.id)}
                className="mt-1 h-4 w-4 text-primary focus:ring-primary focus:ring-offset-surface-app"
                aria-describedby={`service-desc-${service.id}`}
              />
              <div className="flex-1">
                <p className="text-display-h4 font-semibold text-text-on-dark">
                  {service.name}
                </p>
                <p
                  id={`service-desc-${service.id}`}
                  className="text-sm text-text-muted-dark mt-0.5"
                >
                  {service.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Bedroom stepper */}
      <div>
        <label
          htmlFor="bedrooms"
          className="block text-sm font-semibold text-text-on-dark mb-2"
        >
          Bedrooms
        </label>
        <div className="flex items-center gap-4" role="group" aria-labelledby="bedrooms-label">
          <button
            type="button"
            onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
            className="flex items-center justify-center h-11 w-11 rounded-md bg-surface-card border border-surface-divider text-text-on-dark hover:bg-surface-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Decrease bedroom count"
            disabled={bedrooms <= 1}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span
            id="bedrooms"
            className="font-mono text-xl text-text-on-dark w-8 text-center"
            aria-live="polite"
            aria-atomic="true"
          >
            {bedrooms}
          </span>
          <button
            type="button"
            onClick={() => setBedrooms(Math.min(10, bedrooms + 1))}
            className="flex items-center justify-center h-11 w-11 rounded-md bg-surface-card border border-surface-divider text-text-on-dark hover:bg-surface-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Increase bedroom count"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Bathroom stepper */}
      <div>
        <label
          htmlFor="bathrooms"
          className="block text-sm font-semibold text-text-on-dark mb-2"
        >
          Bathrooms
        </label>
        <div className="flex items-center gap-4" role="group">
          <button
            type="button"
            onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
            className="flex items-center justify-center h-11 w-11 rounded-md bg-surface-card border border-surface-divider text-text-on-dark hover:bg-surface-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Decrease bathroom count"
            disabled={bathrooms <= 1}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span
            id="bathrooms"
            className="font-mono text-xl text-text-on-dark w-8 text-center"
            aria-live="polite"
            aria-atomic="true"
          >
            {bathrooms}
          </span>
          <button
            type="button"
            onClick={() => setBathrooms(Math.min(8, bathrooms + 1))}
            className="flex items-center justify-center h-11 w-11 rounded-md bg-surface-card border border-surface-divider text-text-on-dark hover:bg-surface-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Increase bathroom count"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Continue button */}
      <Button
        variant="primary-dark"
        size="full"
        onClick={handleContinue}
        disabled={!selectedServiceId}
        aria-disabled={!selectedServiceId}
      >
        Continue
      </Button>
    </div>
  );
}
