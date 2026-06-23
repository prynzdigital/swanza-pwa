import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { calculateBookingPrice } from "@/lib/booking-logic";
import { z } from "zod";

// POST /api/payments/confirm
// Called after Stripe client-side confirmation succeeds.
// Retrieves the PaymentIntent server-side to verify status, then creates the DB booking.

const ConfirmSchema = z.object({
  paymentIntentId: z.string().min(1),
  bookingParams: z.object({
    serviceTypeId: z.string().min(1),
    bedrooms: z.string(),
    bathrooms: z.string(),
    address: z.string().min(1),
    scheduledAt: z.string(),
    notes: z.string().optional(),
  }),
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

  const parsed = ConfirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const { paymentIntentId, bookingParams } = parsed.data;

  // Verify payment on server side
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    return NextResponse.json(
      { error: `Payment not succeeded: ${paymentIntent.status}` },
      { status: 402 }
    );
  }

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
    where: { id: bookingParams.serviceTypeId },
  });

  if (!serviceType) {
    return NextResponse.json({ error: "Service type not found" }, { status: 404 });
  }

  const bedrooms = parseInt(bookingParams.bedrooms ?? "2");
  const bathrooms = parseInt(bookingParams.bathrooms ?? "1");
  const totalAmount = calculateBookingPrice(serviceType.basePrice, bedrooms, bathrooms);

  // Check for duplicate (idempotency — PI may already have a booking)
  const existing = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
    include: { booking: true },
  });

  if (existing?.booking) {
    return NextResponse.json({ bookingId: existing.booking.id });
  }

  // Create booking + payment records atomically
  // QA fix #008: status is PAYMENT_CONFIRMED (not ASSIGNED) — no cleaner has been attached yet.
  // An admin must assign a cleaner before the booking transitions to ASSIGNED.
  const booking = await prisma.booking.create({
    data: {
      customerId: user.customerProfile.id,
      serviceTypeId: bookingParams.serviceTypeId,
      address: bookingParams.address,
      scheduledAt: new Date(bookingParams.scheduledAt),
      totalAmount,
      bedroomCount: bedrooms,
      bathroomCount: bathrooms,
      notes: bookingParams.notes,
      status: "PAYMENT_CONFIRMED",
      payment: {
        create: {
          stripePaymentIntentId: paymentIntentId,
          amount: totalAmount,
          status: "SUCCEEDED",
        },
      },
    },
  });

  return NextResponse.json({ bookingId: booking.id }, { status: 201 });
}
