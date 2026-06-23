import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { CleanerStatus } from "@prisma/client";

// POST /api/cleaners/[id]/approve — admin only: approve, suspend, or reinstate cleaner

const ApproveSchema = z.object({
  status: z.enum(["APPROVED", "SUSPENDED", "PENDING"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ApproveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }

  const updated = await prisma.cleanerProfile.update({
    where: { id },
    data: { status: parsed.data.status as CleanerStatus },
  });

  return NextResponse.json({ cleanerId: updated.id, status: updated.status });
}
