import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "@/app/providers/auth-provider";
import { BookingTrend } from "@/features/dashboard/components/booking-trend";
import { ResourceMix } from "@/features/dashboard/components/resource-mix";
import {
  bookingTrendWeek,
  bookingsOnOffsetDay,
  createdThisMonth,
  resourcesByType,
  utilizationRate,
} from "@/features/dashboard/lib/analytics";
import { useDashboardAnalytics } from "@/features/dashboard/queries/use-dashboard-analytics";
import { ErrorState } from "@/shared/components/error-state";
import { StatCard } from "@/shared/components/stat-card";
import { Button } from "@/shared/components/ui/button";

export function DashboardSummary() {
  const { user } = useAuth();
  const { summary, bookings, resources, types, users } = useDashboardAnalytics();
  const bookingRows = bookings.data?.items ?? [];
  const resourceRows = resources.data?.items ?? [];
  const userRows = users.data?.items ?? [];
  const trend = bookingTrendWeek(bookingRows);
  const mix = resourcesByType(resourceRows, types.data?.items ?? []);
  const capped = (bookings.data?.meta.total ?? 0) > bookingRows.length;
  const utilization = utilizationRate(summary.data?.activeResources, summary.data?.totalResources);
  const usersMonth = createdThisMonth(userRows);
  const resourcesMonth = createdThisMonth(resourceRows);
  const bookingsMonth = createdThisMonth(bookingRows);
  const todayCount = bookingsOnOffsetDay(bookingRows, 0);
  const yesterdayCount = bookingsOnOffsetDay(bookingRows, -1);
  const todayDelta = todayCount - yesterdayCount;

  const firstName = user?.name?.split(" ")[0] ?? "";
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back{firstName ? `, ${firstName}` : ""}
            <span className="mx-1.5 text-border">|</span>
            {today}
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link to="/bookings/new">
            <Plus className="h-4 w-4" />
            New Booking
          </Link>
        </Button>
      </div>

      {summary.isError ? <ErrorState error={summary.error} onRetry={() => void summary.refetch()} /> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total Users"
          value={summary.data?.totalUsers}
          loading={summary.isLoading}
          hint={users.isLoading ? undefined : `+${usersMonth} this month`}
          hintTone="positive"
        />
        <StatCard
          label="Total Resources"
          value={summary.data?.totalResources}
          loading={summary.isLoading}
          hint={resources.isLoading ? undefined : `+${resourcesMonth} this month`}
          hintTone="positive"
        />
        <StatCard
          label="Active Resources"
          value={summary.data?.activeResources}
          loading={summary.isLoading}
          hint={utilization == null ? undefined : `${utilization}% active`}
          hintTone="positive"
        />
        <StatCard
          label="Total Bookings"
          value={summary.data?.totalBookings}
          loading={summary.isLoading}
          hint={bookings.isLoading ? undefined : `+${bookingsMonth} this month`}
          hintTone="positive"
        />
        <StatCard
          label="Today's Bookings"
          value={summary.data?.todaysBookings}
          loading={summary.isLoading}
          hint={
            bookings.isLoading
              ? undefined
              : `${todayDelta >= 0 ? "+" : ""}${todayDelta} from yesterday`
          }
          hintTone="positive"
        />
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-2">
        <BookingTrend points={trend} loading={bookings.isLoading} capped={capped} />
        <ResourceMix rows={mix} loading={resources.isLoading || types.isLoading} />
      </div>
    </div>
  );
}
