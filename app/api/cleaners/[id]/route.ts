import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cleaners/[id] — get cleaner profile (admin or self)

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { cleanerProfile: true },
  });

  const isAdmin = user?.role === "ADMIN";
  const isSelf = user?.cleanerProfile?.id === id;

  if (!isAdmin && !isSelf) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cleaner = await prisma.cleanerProfile.findUnique({
    where: { id },
    include: { user: { select: { email: true, name: true } } },
  });

  if (!cleaner) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(cleaner);
}
