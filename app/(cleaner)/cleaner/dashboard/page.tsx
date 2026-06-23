import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/AppShell";
import { JobCard } from "@/components/ui/JobCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CalendarX } from "lucide-react";

// Source: wireframes.md §Page 14 — Cleaner Dashboard / Job Feed

export const metadata = {
  title: "Swanza — Job Dashboard",
  robots: { index: false, follow: false },
};

export default async function CleanerDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      cleanerProfile: {
        include: {
          bookings: {
            where: {
              status: {
                in: ["ASSIGNED", "ACCEPTED", "EN_ROUTE", "IN_PROGRESS"],
              },
            },
            orderBy: { scheduledAt: "asc" },
            include: { serviceType: true },
          },
        },
      },
    },
  });

  if (!user?.cleanerProfile) {
    // Cleaner profile not yet created — redirect to apply
    return redirect("/sign-up?role=cleaner");
  }

  const { cleanerProfile } = user;
  const activeJob = cleanerProfile.bookings.find((b) =>
    ["ACCEPTED", "EN_ROUTE", "IN_PROGRESS"].includes(b.status)
  );
  const incomingJobs = cleanerProfile.bookings.filter(
    (b) => b.status === "ASSIGNED"
  );

  return (
    <AppShell role="cleaner" pageTitle="Job Feed">
      <div className="max-w-content mx-auto px-4 py-6 space-y-6">
        {/* Cleaner status — PENDING_APPROVAL gate */}
        {cleanerProfile.status === "PENDING" && (
          <div
            className="bg-warning/20 border border-warning/50 rounded-lg p-4"
            role="alert"
          >
            <p className="text-sm font-semibold text-warning mb-1">
              Application Under Review
            </p>
            <p className="text-sm text-text-muted-dark">
              Your cleaner account is being reviewed by the Swanza team. You will
              be notified when approved and your job dashboard goes live.
            </p>
          </div>
        )}

        {cleanerProfile.status === "SUSPENDED" && (
          <div
            className="bg-destructive/20 border border-destructive/50 rounded-lg p-4"
            role="alert"
          >
            <p className="text-sm font-semibold text-destructive mb-1">
              Account Suspended
            </p>
            <p className="text-sm text-text-muted-dark">
              Your cleaner account has been suspended. Contact support for more
              information.
            </p>
          </div>
        )}

        {/* Active Job Highlight */}
        {activeJob && (
          <section aria-labelledby="active-job-heading">
            <p
              id="active-job-heading"
              className="text-[13px] font-medium uppercase tracking-wide text-text-muted-dark mb-3"
            >
              Active Job
            </p>
            <JobCard
              jobId={activeJob.id}
              status={activeJob.status}
              serviceType={activeJob.serviceType.name}
              address={activeJob.address}
              scheduledAt={activeJob.scheduledAt}
              payoutAmount={activeJob.totalAmount * 0.8} // 80% payout
              onViewJob={(id) => void id}
              className="border-l-4 border-l-status-in-progress"
            />
            <div className="mt-3">
              <Button asChild variant="primary-dark" size="default">
                <Link href={`/cleaner/jobs/${activeJob.id}`}>View Job</Link>
              </Button>
            </div>
          </section>
        )}

        {/* Incoming Jobs */}
        <section aria-labelledby="incoming-jobs-heading">
          <p
            id="incoming-jobs-heading"
            className="text-[13px] font-medium uppercase tracking-wide text-text-muted-dark mb-3"
          >
            Incoming
          </p>

          {incomingJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <CalendarX
                className="h-10 w-10 text-text-muted-dark"
                aria-hidden="true"
              />
              <p className="text-base text-text-muted-dark">
                No jobs available right now
              </p>
              <p className="text-sm text-text-muted-dark">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingJobs.map((job) => (
                <JobCard
                  key={job.id}
                  jobId={job.id}
                  status={job.status}
                  serviceType={job.serviceType.name}
                  address={job.address}
                  scheduledAt={job.scheduledAt}
                  payoutAmount={job.totalAmount * 0.8}
                  onViewJob={(id) => void id}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
