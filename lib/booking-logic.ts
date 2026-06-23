import { prisma } from "./prisma";
import type { BookingStatus } from "@prisma/client";

/**
 * Check whether a cleaner has an overlapping booking at the given time.
 * "Overlap" means any booking within scheduledAt ± durationHours.
 *
 * @param cleanerId - CleanerProfile.id (not User.id)
 * @param scheduledAt - proposed booking start time
 * @param durationHours - service duration (from ServiceType.durationHours)
 * @returns true if the cleaner IS available (no conflict), false if conflicted
 */
export async function isCleanerAvailable(
  cleanerId: string,
  scheduledAt: Date,
  durationHours: number
): Promise<boolean> {
  const proposedStart = scheduledAt;
  const proposedEnd = new Date(
    scheduledAt.getTime() + durationHours * 60 * 60 * 1000
  );

  // Find any existing booking for this cleaner that overlaps the proposed window
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      cleanerId,
      status: {
        // Only active bookings create a conflict; cancelled/completed do not
        in: [
          "ASSIGNED",
          "ACCEPTED",
          "EN_ROUTE",
          "IN_PROGRESS",
        ] satisfies BookingStatus[],
      },
      AND: [
        // The existing booking starts before our proposed window ends
        { scheduledAt: { lt: proposedEnd } },
      ],
    },
    include: {
      serviceType: { select: { durationHours: true } },
    },
  });

  if (!conflictingBooking) return true;

  // Check if the existing booking's end time overlaps with our start time
  const existingEnd = new Date(
    conflictingBooking.scheduledAt.getTime() +
      conflictingBooking.serviceType.durationHours * 60 * 60 * 1000
  );

  // Overlap exists if existing booking ends after proposed booking starts
  return existingEnd <= proposedStart;
}

/**
 * Validate that a booking status transition is permitted.
 *
 * Rules:
 * - Only the assigned cleaner can advance their own job status
 *   (except Admin, who can set any status — handled at API level)
 * - Valid transitions:
 *   PENDING_PAYMENT   → CANCELLED (only, while unpaid)
 *   PAYMENT_CONFIRMED → ASSIGNED (system only, when admin assigns a cleaner — QA fix #008)
 *   PAYMENT_CONFIRMED → CANCELLED (admin cancel before assignment)
 *   ASSIGNED          → ACCEPTED (cleaner)
 *   ASSIGNED          → CANCELLED (admin)
 *   ACCEPTED          → EN_ROUTE (cleaner)
 *   ACCEPTED          → CANCELLED (admin)
 *   EN_ROUTE          → IN_PROGRESS (cleaner)
 *   IN_PROGRESS       → COMPLETED (cleaner)
 *   Any               → CANCELLED (admin, or customer if before ACCEPTED)
 */
export function isValidStatusTransition(
  current: BookingStatus,
  next: BookingStatus,
  isAdmin: boolean = false
): boolean {
  // Admins can set any status
  if (isAdmin) return true;

  const validTransitions: Partial<Record<BookingStatus, BookingStatus[]>> = {
    PENDING_PAYMENT: ["CANCELLED"],
    // QA fix #008: PAYMENT_CONFIRMED is the state after payment but before cleaner assignment
    PAYMENT_CONFIRMED: ["ASSIGNED", "CANCELLED"],
    ASSIGNED: ["ACCEPTED", "CANCELLED"],
    ACCEPTED: ["EN_ROUTE", "CANCELLED"],
    EN_ROUTE: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETED"],
    COMPLETED: [], // terminal state
    CANCELLED: [], // terminal state
  };

  return validTransitions[current]?.includes(next) ?? false;
}

/**
 * Get the human-readable label for the next status action button.
 * Used in the cleaner Active Job view.
 */
export function getNextStatusActionLabel(current: BookingStatus): string | null {
  const labels: Partial<Record<BookingStatus, string>> = {
    ACCEPTED: "I'm On My Way",
    EN_ROUTE: "I've Arrived — Starting Now",
    IN_PROGRESS: "Mark as Complete",
  };
  return labels[current] ?? null;
}

/**
 * Get the next logical booking status for a cleaner action.
 */
export function getNextStatus(current: BookingStatus): BookingStatus | null {
  const transitions: Partial<Record<BookingStatus, BookingStatus>> = {
    ASSIGNED: "ACCEPTED",
    ACCEPTED: "EN_ROUTE",
    EN_ROUTE: "IN_PROGRESS",
    IN_PROGRESS: "COMPLETED",
  };
  return transitions[current] ?? null;
}

/**
 * Calculate price estimate for a booking.
 * [NEEDS CLIENT INPUT: Q8 — actual pricing model and price points]
 * Current implementation uses placeholder flat-rate logic.
 */
export function calculateBookingPrice(
  basePrice: number,
  bedroomCount: number,
  bathroomCount: number
): number {
  // Placeholder pricing formula until Q8 is resolved:
  // base + (extra bedrooms above 1) * $20 + (extra bathrooms above 1) * $15
  const extraBedrooms = Math.max(0, bedroomCount - 1);
  const extraBathrooms = Math.max(0, bathroomCount - 1);
  const total = basePrice + extraBedrooms * 20 + extraBathrooms * 15;
  return Math.round(total * 100) / 100;
}
