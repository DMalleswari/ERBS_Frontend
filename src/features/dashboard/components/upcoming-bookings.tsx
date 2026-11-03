import { Link } from "react-router-dom";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { Booking } from "@/shared/types/api";
import { formatWhen } from "@/shared/utils/format";

export function UpcomingBookings({
  rows,
  resourceName,
  loading,
}: {
  rows: Booking[];
  resourceName: Record<string, string>;
  loading: boolean;
}) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <h2 className="text-sm font-semibold">Coming up</h2>
      <p className="text-xs text-muted-foreground">Next active bookings</p>
      {loading ? <Skeleton className="mt-4 h-24 w-full" /> : null}
      {!loading && rows.length === 0 ? <p className="mt-6 text-sm text-muted-foreground">Nothing scheduled.</p> : null}
      <ul className="mt-3 grid gap-2">
        {rows.map((row) => (
          <li key={row.id}>
            <Link to={`/bookings/${row.id}`} className="block rounded-lg border px-3 py-2 hover:bg-muted/60">
              <p className="text-sm font-medium">{resourceName[row.resourceId] ?? "Resource"}</p>
              <p className="text-xs text-muted-foreground">{formatWhen(row.startTime)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
