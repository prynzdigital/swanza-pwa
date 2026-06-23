import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Swanza",
  description: "Sign in to your Swanza account.",
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-surface-light flex items-center justify-center px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-sm border border-border rounded-2xl",
          },
        }}
      />
    </main>
  );
}
