import { Skeleton } from "@/shared/components/ui/skeleton";

export function BookingMix({ active, cancelled, loading }: { active: number; cancelled: number; loading: boolean }) {
  const total = active + cancelled;
  const activeShare = total === 0 ? 0 : active / total;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const activeLength = circumference * activeShare;

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
      <h2 className="text-sm font-semibold">Booking status</h2>
      <p className="text-xs text-muted-foreground">Active vs cancelled</p>
      {loading ? (
        <Skeleton className="mx-auto mt-6 h-28 w-28 rounded-full" />
      ) : (
        <div className="mt-4 flex items-center gap-4">
          <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0" role="img" aria-label={`${active} active and ${cancelled} cancelled bookings`}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#ebe4d8" strokeWidth="10" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#c65d32"
              strokeWidth="10"
              strokeDasharray={`${activeLength} ${circumference - activeLength}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="56" textAnchor="middle" fill="#1c1917" fontSize="18" fontWeight="600">
              {total}
            </text>
            <text x="60" y="72" textAnchor="middle" fill="#6f655a" fontSize="10">
              total
            </text>
          </svg>
          <div className="grid gap-2 text-sm">
            <p className="text-muted-foreground">
              Active <span className="ml-2 font-medium text-foreground">{active}</span>
            </p>
            <p className="text-muted-foreground">
              Cancelled <span className="ml-2 font-medium text-foreground">{cancelled}</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
