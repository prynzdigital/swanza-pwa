import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Swanza",
  description: "Create your Swanza account to book cleaning services.",
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-surface-light flex items-center justify-center px-4">
      <SignUp
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
