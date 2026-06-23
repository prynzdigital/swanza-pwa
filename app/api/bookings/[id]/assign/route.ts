import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// POST /api/bookings/[id]/assign — admin only: assign a cleaner to a booking

const AssignSchema = z.object({
  cleanerId: z.string().min(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AssignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "cleanerId is required" }, { status: 422 });
  }

  const { cleanerId } = parsed.data;

  const booking = await prisma.booking.findUnique({
    where: { id },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const cleanerProfile = await prisma.cleanerProfile.findUnique({
    where: { id: cleanerId },
  });
  if (!cleanerProfile || cleanerProfile.status !== "APPROVED") {
    return NextResponse.json(
      { error: "Cleaner not found or not approved" },
      { status: 404 }
    );
  }

  // Admin override: brief §Critical Business Logic rule 3 — admin bypass is intentional.
  // QA fix #011: isCleanerAvailable() check removed entirely for admin assigns.
  // Admins can manually assign any cleaner regardless of system availability rules.

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      cleanerId,
      status: "ASSIGNED",
    },
  });

  return NextResponse.json({ bookingId: updated.id, cleanerId });
}
