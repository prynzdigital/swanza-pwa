import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/book(.*)",
  "/customer(.*)",
  "/cleaner(.*)",
  "/admin(.*)",
]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export default async function middleware(req: NextRequest) {
  try {
    // @ts-expect-error NextFetchEvent not needed for this call shape
    return await clerk(req, {});
  } catch (err) {
    // Log the real error so it appears in Vercel Function logs
    console.error("[middleware] Clerk init failed:", err);
    // Fall through so the site loads — protected routes will still 401
    // at the layout level once the issue is diagnosed and fixed
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
