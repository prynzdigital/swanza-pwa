import Stripe from "stripe";

// Server-side Stripe client
// Requires: STRIPE_SECRET_KEY env var
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

// Platform fee percentage — [NEEDS CLIENT INPUT: confirm take-rate]
// Default: 20% (80% goes to cleaner)
export const PLATFORM_FEE_PERCENT = 0.2;

/** Calculate platform fee and cleaner payout amounts from total */
export function calculatePayoutSplit(totalAmount: number): {
  platformFee: number;
  cleanerPayout: number;
} {
  const platformFee = Math.round(totalAmount * PLATFORM_FEE_PERCENT * 100) / 100;
  const cleanerPayout = Math.round((totalAmount - platformFee) * 100) / 100;
  return { platformFee, cleanerPayout };
}
