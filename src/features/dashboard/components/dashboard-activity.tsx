import { CalendarPlus, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { Booking } from "@/shared/types/api";
import { formatWhen } from "@/shared/utils/format";
import { cn } from "@/shared/utils/cn";

export function DashboardActivity({
  rows,
  resourceName,
  userName,
  loading,
}: {
  rows: Booking[];
  resourceName: Record<string, string>;
  userName: Record<string, string>;
  loading: boolean;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(13,61,52,0.04)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Upcoming bookings</h2>
          <p className="text-sm text-muted-foreground">Next scheduled reservations</p>
        </div>
        <Link to="/bookings" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">No upcoming bookings.</p>
          <Link to="/bookings/new" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <CalendarPlus className="h-4 w-4" />
            Create booking
          </Link>
        </div>
      ) : null}

      <ul className="grid gap-2">
        {rows.map((row, index) => (
          <li key={row.id}>
            <Link
              to={`/bookings/${row.id}`}
              className={cn(
                "flex items-start gap-3 rounded-2xl border px-3.5 py-3 transition-colors",
                index === 0
                  ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/95"
                  : "border-border bg-card hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full",
                  index === 0 ? "bg-white/15" : "bg-brand-soft text-primary",
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {formatWhen(row.startTime)} · {resourceName[row.resourceId] ?? "Resource"}
                </p>
                <p className={cn("truncate text-xs", index === 0 ? "text-primary-foreground/75" : "text-muted-foreground")}>
                  {userName[row.userId] ?? "User"}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
