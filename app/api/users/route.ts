import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// POST /api/users — create or sync the DB user record after Clerk sign-up/sign-in
// Called from the onboarding flow; Clerk webhook can also sync user records.

const CreateUserSchema = z.object({
  role: z.enum(["CUSTOMER", "CLEANER"]).optional().default("CUSTOMER"),
  name: z.string().optional(),
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

  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const { role, name } = parsed.data;

  // Fetch email from Clerk API (userId is the Clerk user ID)
  // In production, get email from the Clerk auth object or a webhook.
  // Here we use the userId as a placeholder email until the webhook syncs.
  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (existing) {
    return NextResponse.json({ userId: existing.id });
  }

  const user = await prisma.user.create({
    data: {
      clerkId: userId,
      email: `${userId}@placeholder.swanza`, // replaced by webhook
      name: name ?? null,
      role,
      ...(role === "CUSTOMER"
        ? { customerProfile: { create: {} } }
        : {
            cleanerProfile: {
              create: {
                status: "PENDING",
                bio: "",
                serviceAreaZips: [],
                hourlyRate: 0,
              },
            },
          }),
    },
  });

  return NextResponse.json({ userId: user.id }, { status: 201 });
}
