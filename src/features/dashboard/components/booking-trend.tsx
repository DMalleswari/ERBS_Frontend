import type { TrendPoint } from "@/features/dashboard/lib/analytics";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function BookingTrend({ points, loading, capped }: { points: TrendPoint[]; loading: boolean; capped: boolean }) {
  const width = 560;
  const height = 240;
  const pad = { top: 20, right: 12, bottom: 32, left: 12 };
  const totals = points.map((point) => point.active + point.cancelled);
  const max = Math.max(1, ...totals);
  const step = points.length > 1 ? (width - pad.left - pad.right) / (points.length - 1) : 0;

  const coords = totals.map((total, index) => {
    const x = pad.left + index * step;
    const y = pad.top + (1 - total / max) * (height - pad.top - pad.bottom);
    return { x, y, label: points[index]?.label ?? "" };
  });

  const line = coords.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-[0_4px_16px_rgba(28,25,23,0.05)]">
      <div className="mb-2">
        <h2 className="text-base font-semibold tracking-tight">Booking Trends</h2>
        <p className="text-xs text-muted-foreground">Last 7 days{capped ? " · from loaded sample" : ""}</p>
      </div>
      {loading ? (
        <Skeleton className="mt-4 h-52 w-full rounded-xl" />
      ) : (
        <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-52 w-full" role="img" aria-label="Booking trends">
          {[0, 0.5, 1].map((tick) => {
            const y = pad.top + (1 - tick) * (height - pad.top - pad.bottom);
            return <line key={tick} x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#ebe4d8" strokeWidth="1" />;
          })}
          <path d={line} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {coords.map((point) => (
            <circle key={point.label} cx={point.x} cy={point.y} r="3.5" fill="#3b82f6" />
          ))}
          {coords.map((point) => (
            <text key={`l-${point.label}`} x={point.x} y={height - 8} textAnchor="middle" fill="#6f655a" fontSize="11">
              {point.label}
            </text>
          ))}
        </svg>
      )}
    </section>
  );
}
