import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { CleanerApprovalButtons } from "./CleanerApprovalButtons";

// Source: wireframes.md §Page 20 — Admin Users + Cleaner Approval

export const metadata = {
  title: "Swanza Admin — Users",
  robots: { index: false, follow: false },
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab ?? "cleaners";

  const cleanerProfiles = await prisma.cleanerProfile.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const customers = await prisma.customerProfile.findMany({
    include: { user: true, bookings: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AppShell role="admin" pageTitle="Users">
      <div className="max-w-content mx-auto px-4 py-6 space-y-6">
        <h1 className="text-mobile-h2 font-bold text-text-on-dark">Users</h1>

        {/* Tab switcher */}
        <div className="flex gap-2" role="tablist" aria-label="User category">
          {(["cleaners", "customers"] as const).map((t) => (
            <Link
              key={t}
              href={`/admin/users?tab=${t}`}
              role="tab"
              aria-selected={activeTab === t}
              className={`min-h-[44px] flex items-center px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === t
                  ? "bg-primary text-surface-app"
                  : "bg-surface-card text-text-muted-dark hover:text-text-on-dark"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        {activeTab === "cleaners" ? (
          <section aria-label="Cleaner accounts">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm" aria-label="Cleaners">
                <thead>
                  <tr className="border-b border-surface-divider">
                    {["Name / Email", "Status", "Rating", "Joined", "Actions"].map((col) => (
                      <th
                        key={col}
                        className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-text-muted-dark"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cleanerProfiles.map((cp) => (
                    <tr
                      key={cp.id}
                      className="border-b border-surface-divider hover:bg-surface-card-hover transition-colors"
                    >
                      <td className="px-3 py-3">
                        <p className="text-text-on-dark font-medium">
                          {cp.user.name ?? "—"}
                        </p>
                        <p className="text-xs text-text-muted-dark">{cp.user.email}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded ${
                            cp.status === "APPROVED"
                              ? "bg-status-completed/20 text-status-completed"
                              : cp.status === "PENDING"
                              ? "bg-warning/20 text-warning"
                              : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {cp.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-text-muted-dark">
                        {cp.averageRating?.toFixed(1) ?? "—"}
                      </td>
                      <td className="px-3 py-3 text-text-muted-dark">
                        {formatDate(cp.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <CleanerApprovalButtons
                          cleanerId={cp.id}
                          currentStatus={cp.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {cleanerProfiles.map((cp) => (
                <div
                  key={cp.id}
                  className="bg-surface-card border border-surface-divider rounded-lg p-4 space-y-2"
                >
                  <p className="text-sm font-medium text-text-on-dark">
                    {cp.user.name ?? cp.user.email}
                  </p>
                  <p className="text-xs text-text-muted-dark">{cp.user.email}</p>
                  <span
                    className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                      cp.status === "APPROVED"
                        ? "bg-status-completed/20 text-status-completed"
                        : cp.status === "PENDING"
                        ? "bg-warning/20 text-warning"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {cp.status}
                  </span>
                  <CleanerApprovalButtons
                    cleanerId={cp.id}
                    currentStatus={cp.status}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section aria-label="Customer accounts">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm" aria-label="Customers">
                <thead>
                  <tr className="border-b border-surface-divider">
                    {["Name / Email", "Bookings", "Joined"].map((col) => (
                      <th
                        key={col}
                        className="px-3 py-3 text-left text-[11px] font-medium uppercase tracking-wide text-text-muted-dark"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((cp) => (
                    <tr
                      key={cp.id}
                      className="border-b border-surface-divider hover:bg-surface-card-hover transition-colors"
                    >
                      <td className="px-3 py-3">
                        <p className="text-text-on-dark font-medium">
                          {cp.user.name ?? "—"}
                        </p>
                        <p className="text-xs text-text-muted-dark">{cp.user.email}</p>
                      </td>
                      <td className="px-3 py-3 text-text-muted-dark">
                        {cp.bookings.length}
                      </td>
                      <td className="px-3 py-3 text-text-muted-dark">
                        {formatDate(cp.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
