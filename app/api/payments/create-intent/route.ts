import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { calculateBookingPrice } from "@/lib/booking-logic";
import { z } from "zod";

// POST /api/payments/create-intent
// Creates a Stripe Payment Intent for the booking. Amount calculated server-side.

const IntentSchema = z.object({
  bookingParams: z.object({
    serviceTypeId: z.string().min(1),
    bedrooms: z.string(),
    bathrooms: z.string(),
    address: z.string().min(1),
    scheduledAt: z.string(),
    notes: z.string().optional(),
    totalAmount: z.string().optional(),
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

  const parsed = IntentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const { bookingParams } = parsed.data;

  const serviceType = await prisma.serviceType.findUnique({
    where: { id: bookingParams.serviceTypeId },
  });

  if (!serviceType) {
    return NextResponse.json({ error: "Service type not found" }, { status: 404 });
  }

  const bedrooms = parseInt(bookingParams.bedrooms ?? "2");
  const bathrooms = parseInt(bookingParams.bathrooms ?? "1");

  // Authoritative server-side price calculation
  const totalAmount = calculateBookingPrice(serviceType.basePrice, bedrooms, bathrooms);

  // Stripe amounts are in cents
  const amountCents = Math.round(totalAmount * 100);

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { cleanerProfile: true },
  });

  // If cleaner has Stripe Connect account, set transfer_data — else platform holds funds
  const transferData = user?.cleanerProfile?.stripeAccountId
    ? {
        destination: user.cleanerProfile.stripeAccountId,
        amount: Math.round(amountCents * 0.8), // 80% payout
      }
    : undefined;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    metadata: {
      serviceTypeId: bookingParams.serviceTypeId,
      address: bookingParams.address,
      scheduledAt: bookingParams.scheduledAt,
      bedrooms: bookingParams.bedrooms,
      bathrooms: bookingParams.bathrooms,
      notes: bookingParams.notes ?? "",
      clerkUserId: userId,
    },
    ...(transferData ? { transfer_data: transferData } : {}),
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
