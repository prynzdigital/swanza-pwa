import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import type { Role } from "@prisma/client";

/**
 * Get the current user's role from the database via their Clerk ID.
 * Returns null if not authenticated or user not found in DB.
 */
export async function getCurrentUserRole(): Promise<Role | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  return user?.role ?? null;
}

/**
 * Get or create a DB user record from the current Clerk session.
 * Called after sign-up webhook or lazily on first authenticated request.
 */
export async function getOrCreateDbUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (existingUser) return existingUser;

  // Create new user with default CUSTOMER role
  const primaryEmail =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) return null;

  return prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: primaryEmail,
      role: "CUSTOMER",
      customerProfile: {
        create: {
          savedAddresses: [],
        },
      },
    },
  });
}

/**
 * Assert that the current request has an authenticated user with the given role.
 * Throws a Response (for use in Server Components) if check fails.
 */
export async function requireRole(requiredRole: Role): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== requiredRole) {
    throw new Error(`Forbidden: requires ${requiredRole} role`);
  }

  return user.id;
}

/**
 * Get the DB user id for the current authenticated Clerk session.
 */
export async function getDbUserId(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });

  return user?.id ?? null;
}
