import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Source: design-system.md §Form/BookingStep — StepIndicator
// 4 dots. Active: primary-light filled. Completed: status-completed green with checkmark.
// Future: border empty circle.

interface BookingStepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
  className?: string;
}

const STEP_LABELS = ["Service", "Address & Schedule", "Review", "Payment"];

export function BookingStepIndicator({
  currentStep,
  className,
}: BookingStepIndicatorProps) {
  return (
    <nav aria-label="Booking steps" className={cn("", className)}>
      <ol className="flex items-center justify-between" role="list">
        {STEP_LABELS.map((label, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isFuture = stepNumber > currentStep;

          return (
            <li
              key={stepNumber}
              className="flex flex-col items-center gap-1.5 flex-1"
            >
              {/* Step circle */}
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all",
                  isCompleted &&
                    "bg-status-completed border-status-completed text-white",
                  isActive &&
                    "bg-primary-light border-primary-light text-white",
                  isFuture && "bg-transparent border-border text-text-muted"
                )}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${stepNumber}: ${label}${isCompleted ? " — completed" : isActive ? " — current" : ""}`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <span className="text-sm font-semibold" aria-hidden="true">
                    {stepNumber}
                  </span>
                )}
              </div>

              {/* Step label — hidden on mobile to save space */}
              <span
                className={cn(
                  "hidden sm:block text-xs font-medium text-center leading-tight",
                  isActive && "text-primary-light",
                  isCompleted && "text-status-completed",
                  isFuture && "text-text-muted"
                )}
              >
                {label}
              </span>

              {/* Connecting line — between steps */}
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={cn(
                    "absolute h-0.5 top-4",
                    "left-[calc(50%+16px)] right-[calc(-50%+16px)]",
                    isCompleted ? "bg-status-completed" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
