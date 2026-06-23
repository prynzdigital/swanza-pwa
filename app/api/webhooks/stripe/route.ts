import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

// POST /api/webhooks/stripe
// Handles: payment_intent.succeeded, payment_intent.payment_failed
// Verifies signature using STRIPE_WEBHOOK_SECRET env var.
// Must be added to Stripe Dashboard: https://dashboard.stripe.com/webhooks

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: pi.id },
        data: { status: "SUCCEEDED" },
      });
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      await prisma.payment.updateMany({
        where: { stripePaymentIntentId: pi.id },
        data: { status: "FAILED" },
      });
      break;
    }

    case "transfer.created": {
      // Stripe Connect payout to cleaner's connected account
      const transfer = event.data.object as Stripe.Transfer;
      const metadata = transfer.metadata as Record<string, string>;
      if (metadata.cleanerId) {
        await prisma.payout.create({
          data: {
            cleanerId: metadata.cleanerId,
            stripeTransferId: transfer.id,
            amount: transfer.amount / 100,
          },
        });
      }
      break;
    }

    default:
      // Unhandled event — log and return 200 to prevent Stripe retries
      console.log(`Unhandled Stripe webhook: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
