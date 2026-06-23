import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { formatCurrency } from "@/lib/utils";

// Source: wireframes.md §Page 21 — Admin Revenue

export const metadata = {
  title: "Swanza Admin — Revenue",
  robots: { index: false, follow: false },
};

export default async function AdminRevenuePage() {
  const completedPayments = await prisma.payment.findMany({
    where: { status: "SUCCEEDED" },
    include: { booking: { include: { serviceType: true } } },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const platformFee = totalRevenue * 0.2;
  const cleanerPayouts = totalRevenue * 0.8;

  // Group by month (last 6)
  const monthlyMap = new Map<string, number>();
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    monthlyMap.set(key, 0);
  }
  for (const payment of completedPayments) {
    const d = new Date(payment.createdAt);
    const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    if (monthlyMap.has(key)) {
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + payment.amount);
    }
  }
  const monthlyData = Array.from(monthlyMap.entries()).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);

  return (
    <AppShell role="admin" pageTitle="Revenue">
      <div className="max-w-content mx-auto px-4 py-6 space-y-6">
        <h1 className="text-mobile-h2 font-bold text-text-on-dark">Revenue</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Gross Revenue", value: totalRevenue, accent: "text-primary" },
            { label: "Platform Income (20%)", value: platformFee, accent: "text-status-completed" },
            { label: "Cleaner Payouts (80%)", value: cleanerPayouts, accent: "text-status-accepted" },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              className="bg-surface-card border border-surface-divider rounded-lg p-5"
            >
              <p className="text-[11px] uppercase tracking-wide text-text-muted-dark mb-1">
                {label}
              </p>
              <p className={`font-mono text-3xl font-bold ${accent}`}>
                {formatCurrency(value)}
              </p>
            </div>
          ))}
        </div>

        {/* Revenue Bar Chart (no recharts — pure CSS for SSR safety) */}
        <section
          className="bg-surface-card border border-surface-divider rounded-lg p-6"
          aria-label="Monthly revenue chart"
        >
          <h2 className="text-display-h4 font-semibold text-text-on-dark mb-6">
            Last 6 Months
          </h2>
          <div
            className="flex items-end justify-between gap-3 h-40"
            role="img"
            aria-label="Bar chart: monthly revenue for the last 6 months"
          >
            {monthlyData.map(({ month, revenue }) => {
              const height = Math.round((revenue / maxRevenue) * 100);
              return (
                <div
                  key={month}
                  className="flex flex-col items-center gap-1 flex-1"
                  title={`${month}: ${formatCurrency(revenue)}`}
                >
                  <p className="text-[10px] text-text-muted-dark font-mono">
                    {revenue > 0 ? formatCurrency(revenue).replace("$", "") : "—"}
                  </p>
                  <div
                    className="w-full rounded-t bg-primary/70 transition-all"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    aria-hidden="true"
                  />
                  <p className="text-[10px] text-text-muted-dark">{month}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Payments Table */}
        <section aria-labelledby="recent-payments-heading">
          <h2
            id="recent-payments-heading"
            className="text-display-h4 font-semibold text-text-on-dark mb-4"
          >
            Recent Payments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Recent payments">
              <thead>
                <tr className="border-b border-surface-divider">
                  {["Stripe PI", "Service", "Gross", "Platform", "Payout", "Date"].map((col) => (
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
                {completedPayments.slice(0, 20).map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-surface-divider hover:bg-surface-card-hover"
                  >
                    <td className="px-3 py-3 font-mono text-xs text-text-muted-dark">
                      ...{p.stripePaymentIntentId.slice(-10)}
                    </td>
                    <td className="px-3 py-3 text-text-on-dark">
                      {p.booking.serviceType.name}
                    </td>
                    <td className="px-3 py-3 font-mono font-semibold text-text-on-dark">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-3 py-3 font-mono text-status-completed">
                      {formatCurrency(p.amount * 0.2)}
                    </td>
                    <td className="px-3 py-3 font-mono text-status-accepted">
                      {formatCurrency(p.amount * 0.8)}
                    </td>
                    <td className="px-3 py-3 text-text-muted-dark text-xs">
                      {new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {completedPayments.length === 0 && (
              <p className="py-12 text-center text-text-muted-dark">
                No completed payments yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
