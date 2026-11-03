import { Link } from "react-router-dom";
import { StatusBadge } from "@/shared/components/status-badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { Booking } from "@/shared/types/api";
import { formatWhen } from "@/shared/utils/format";

export function RecentBookings({
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
    <section className="rounded-xl border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Recent bookings</h2>
          <p className="text-xs text-muted-foreground">Latest activity</p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/bookings">View all</Link>
        </Button>
      </div>
      {loading ? (
        <div className="space-y-2 px-4 pb-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-9 w-full" />)}</div>
      ) : null}
      {!loading && rows.length === 0 ? <p className="px-4 pb-4 text-sm text-muted-foreground">No bookings yet.</p> : null}
      {rows.length > 0 ? (
        <div className="overflow-x-auto border-t">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">When</th>
                <th className="px-3 py-2 font-medium">Resource</th>
                <th className="px-3 py-2 font-medium">Who</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-2.5 text-muted-foreground">{formatWhen(row.startTime)}</td>
                  <td className="px-3 py-2.5">
                    <Link className="font-medium text-primary" to={`/bookings/${row.id}`}>
                      {resourceName[row.resourceId] ?? "Resource"}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">{userName[row.userId] ?? "User"}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
