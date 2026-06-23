import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protected routes — require authentication
const isProtectedRoute = createRouteMatcher([
  "/book(.*)",
  "/customer(.*)",
  "/cleaner(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  // Role-based protection is enforced in layout.tsx files per route group
  // because clerkMiddleware cannot access DB to check role
  // See (customer)/layout.tsx, (cleaner)/layout.tsx, (admin)/layout.tsx
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
