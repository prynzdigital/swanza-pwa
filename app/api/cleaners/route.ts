import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cleaners — returns approved cleaners list (admin use)

export async function GET() {
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

  const cleaners = await prisma.cleanerProfile.findMany({
    where: { status: "APPROVED" },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { averageRating: "desc" },
  });

  return NextResponse.json(cleaners);
}
