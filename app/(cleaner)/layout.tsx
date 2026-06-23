import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function CleanerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  // Only CLEANER and ADMIN can access cleaner routes
  if (user && user.role === "CUSTOMER") {
    redirect("/customer/dashboard");
  }

  return <>{children}</>;
}
