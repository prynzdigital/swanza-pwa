import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateBookingPrice } from "@/lib/booking-logic";
import { z } from "zod";

// POST /api/bookings — create booking (called after payment intent created, before Stripe confirms)
// All booking creation is triggered by the payment flow.

// QA fix #009: totalAmount removed from the accepted schema — it must never be trusted from the client.
// Server recalculates price from serviceTypeId + bedrooms + bathrooms using calculateBookingPrice().
const CreateBookingSchema = z.object({
  serviceTypeId: z.string().min(1),
  address: z.string().min(1),
  scheduledAt: z.string().datetime(),
  bedrooms: z.number().int().min(1).max(10),
  bathrooms: z.number().int().min(1).max(10),
  notes: z.string().optional(),
  stripePaymentIntentId: z.string().min(1),
});

export async function POST(req: NextRequest) {
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

  const parsed = CreateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.format() },
      { status: 422 }
    );
  }

  const data = parsed.data;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { customerProfile: true },
  });

  if (!user?.customerProfile) {
    return NextResponse.json(
      { error: "Customer profile not found" },
      { status: 404 }
    );
  }

  const serviceType = await prisma.serviceType.findUnique({
    where: { id: data.serviceTypeId },
  });

  if (!serviceType) {
    return NextResponse.json({ error: "Service type not found" }, { status: 404 });
  }

  // QA fix #009: calculate totalAmount server-side — never use a client-supplied price
  const totalAmount = calculateBookingPrice(
    serviceType.basePrice,
    data.bedrooms,
    data.bathrooms
  );

  // QA fix #008: use PAYMENT_CONFIRMED, not ASSIGNED — no cleaner has been attached yet
  const booking = await prisma.booking.create({
    data: {
      customerId: user.customerProfile.id,
      serviceTypeId: data.serviceTypeId,
      address: data.address,
      scheduledAt: new Date(data.scheduledAt),
      totalAmount,
      bedroomCount: data.bedrooms,
      bathroomCount: data.bathrooms,
      notes: data.notes,
      status: "PAYMENT_CONFIRMED",
      payment: {
        create: {
          stripePaymentIntentId: data.stripePaymentIntentId,
          amount: totalAmount,
          status: "PENDING",
        },
      },
    },
    include: { serviceType: true, payment: true },
  });

  return NextResponse.json({ bookingId: booking.id }, { status: 201 });
}
