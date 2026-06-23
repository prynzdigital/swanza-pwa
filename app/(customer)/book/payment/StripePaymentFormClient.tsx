"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Source: wireframes.md §Page 11 — Book Step 4
// Stripe CardElement is embedded directly — Swanza does not render custom card number inputs.
// Amount token never editable client-side.

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

interface StripePaymentFormClientProps {
  bookingParams: Record<string, string>;
  totalAmount: number;
}

function PaymentForm({
  bookingParams,
  totalAmount,
}: StripePaymentFormClientProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [nameOnCard, setNameOnCard] = useState("");

  // Create payment intent on mount
  useEffect(() => {
    const createIntent = async () => {
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingParams }),
      });
      if (response.ok) {
        const data = await response.json() as { clientSecret: string };
        setClientSecret(data.clientSecret);
      }
    };
    void createIntent();
  }, [bookingParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: nameOnCard },
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Confirm booking via API
      const confirmResponse = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          bookingParams,
        }),
      });

      if (confirmResponse.ok) {
        const confirmed = await confirmResponse.json() as { bookingId: string };
        router.push(`/customer/bookings/${confirmed.bookingId}`);
      } else {
        setError("Payment succeeded but booking confirmation failed. Please contact support.");
      }
    }

    setLoading(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "15px",
        color: "#111818",
        fontFamily: "Inter, system-ui, sans-serif",
        "::placeholder": { color: "#7A8C8C" },
      },
      invalid: { color: "#FF4D4D" },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name on card */}
      <div>
        <label
          htmlFor="nameOnCard"
          className="block text-sm font-medium text-text-on-dark mb-1.5"
        >
          Name on Card <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <input
          id="nameOnCard"
          type="text"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
          className="w-full min-h-[44px] px-3 py-2.5 rounded-md border border-border bg-surface-white text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light hover:border-primary-light transition-colors"
          autoComplete="cc-name"
          aria-required="true"
          required
        />
      </div>

      {/* Stripe CardElement */}
      <div>
        <label className="block text-sm font-medium text-text-on-dark mb-1.5">
          Card Details <span className="text-destructive" aria-hidden="true">*</span>
        </label>
        <div className="min-h-[44px] px-3 py-3.5 rounded-md border border-border bg-surface-white focus-within:ring-2 focus-within:ring-primary-light focus-within:border-primary-light">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Secured by Stripe */}
      <div className="flex items-center gap-2 text-sm text-text-muted-dark">
        <Lock className="h-4 w-4 text-primary-light flex-shrink-0" aria-hidden="true" />
        <span>Secured by Stripe</span>
      </div>

      {/* Error message */}
      {error && (
        <div role="alert" className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 border border-destructive/30">
          {error}
        </div>
      )}

      {/* Pay button */}
      <Button
        type="submit"
        variant="primary-dark"
        size="full"
        disabled={!stripe || !clientSecret || loading}
        loading={loading}
        loadingText="Processing..."
      >
        Pay {formatCurrency(totalAmount)}
      </Button>

      {/* Terms note */}
      <p className="text-xs text-text-muted-dark text-center">
        By paying you agree to our{" "}
        <a href="/terms" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and Cancellation Policy.{" "}
        {/* [NEEDS CLIENT INPUT: cancellation policy] */}
      </p>
    </form>
  );
}

export function StripePaymentFormClient(props: StripePaymentFormClientProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
