import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidStatusTransition } from "@/lib/booking-logic";
import { z } from "zod";
import type { BookingStatus } from "@prisma/client";

// GET /api/bookings/[id] — fetch single booking
// PATCH /api/bookings/[id] — update booking status

const BookingStatusEnum = z.enum([
  "PENDING_PAYMENT",
  "PAYMENT_CONFIRMED", // QA fix #008: new intermediate status
  "ASSIGNED",
  "ACCEPTED",
  "EN_ROUTE",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

const UpdateSchema = z.object({
  status: BookingStatusEnum,
  adminOverride: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // QA fix #006: resolve caller's DB user and role for ownership check
  const caller = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { cleanerProfile: true, customerProfile: true },
  });

  if (!caller) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      serviceType: true,
      cleaner: { include: { user: true } },
      payment: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // QA fix #006: enforce ownership — only the booking's customer, assigned cleaner, or an admin may read it
  const isAdmin = caller.role === "ADMIN";
  const isBookingCustomer =
    caller.role === "CUSTOMER" && booking.customerId === caller.id;
  const isAssignedCleaner =
    caller.role === "CLEANER" &&
    caller.cleanerProfile != null &&
    booking.cleanerId === caller.cleanerProfile.id;

  if (!isAdmin && !isBookingCustomer && !isAssignedCleaner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(booking);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.format() },
      { status: 422 }
    );
  }

  const { status: newStatus, adminOverride = false } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { cleanerProfile: true },
  });

  const isAdmin = user?.role === "ADMIN";

  const booking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Permission check: cleaner can only update their own bookings
  if (!isAdmin && user?.cleanerProfile?.id !== booking.cleanerId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Validate transition (admins can always override)
  const valid = adminOverride
    ? isAdmin
    : isValidStatusTransition(booking.status as BookingStatus, newStatus, isAdmin);

  if (!valid) {
    return NextResponse.json(
      { error: `Invalid status transition: ${booking.status} → ${newStatus}` },
      { status: 422 }
    );
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: newStatus },
  });

  return NextResponse.json({ bookingId: updated.id, status: updated.status });
}
