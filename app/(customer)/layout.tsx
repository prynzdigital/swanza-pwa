import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if database is reachable before querying
  let user = null;
  let dbAvailable = true;

  try {
    const clerkUser = await currentUser();

    // Upsert: create DB User record on first login if it doesn't exist yet
    user = await prisma.user.upsert({
      where: { clerkId: userId },
      create: {
        clerkId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
        name: `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || null,
        role: "CUSTOMER",
        customerProfile: { create: {} },
      },
      update: {},
      select: { role: true },
    });
  } catch {
    dbAvailable = false;
  }

  if (!dbAvailable) {
    return (
      <main className="min-h-screen bg-surface-dark flex items-center justify-center px-4">
        <div className="bg-surface-dark-card border border-surface-dark-border rounded-2xl p-8 max-w-md w-full">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Database not configured</h1>
          <p className="text-text-muted-dark text-sm mb-5">
            The booking flow requires a PostgreSQL database. Set one up on{" "}
            <span className="text-primary font-medium">neon.tech</span> (free tier works), then add the connection string to{" "}
            <code className="bg-surface-dark-border text-primary px-1 py-0.5 rounded text-xs font-mono">.env.local</code>.
          </p>
          <ol className="space-y-2 text-sm text-text-muted-dark mb-6">
            <li className="flex gap-2"><span className="text-primary font-bold">1.</span> Go to <span className="text-white font-medium">neon.tech</span> → create a project → copy the connection string</li>
            <li className="flex gap-2"><span className="text-primary font-bold">2.</span> Paste into <code className="font-mono text-xs bg-surface-dark-border px-1 rounded">DATABASE_URL</code> in <code className="font-mono text-xs bg-surface-dark-border px-1 rounded">.env.local</code></li>
            <li className="flex gap-2"><span className="text-primary font-bold">3.</span> Run <code className="font-mono text-xs bg-surface-dark-border px-1 rounded">npx prisma migrate dev</code> in the source folder</li>
            <li className="flex gap-2"><span className="text-primary font-bold">4.</span> Restart the dev server</li>
          </ol>
          <Link
            href="/"
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            ← Back to homepage
          </Link>
        </div>
      </main>
    );
  }

  // Redirect cleaners away from customer routes
  if (user?.role === "CLEANER") {
    redirect("/cleaner/dashboard");
  }

  return <>{children}</>;
}
