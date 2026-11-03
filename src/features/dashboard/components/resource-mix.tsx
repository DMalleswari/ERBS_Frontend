import { Skeleton } from "@/shared/components/ui/skeleton";

export function ResourceMix({ rows, loading }: { rows: Array<{ name: string; count: number }>; loading: boolean }) {
  const max = Math.max(1, ...rows.map((row) => row.count));

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-[0_4px_16px_rgba(28,25,23,0.05)]">
      <div className="mb-4">
        <h2 className="text-base font-semibold tracking-tight">Resource Utilization</h2>
        <p className="text-xs text-muted-foreground">Resources by type</p>
      </div>
      {loading ? <Skeleton className="h-52 w-full rounded-xl" /> : null}
      {!loading && rows.length === 0 ? <p className="py-16 text-center text-sm text-muted-foreground">No resources yet.</p> : null}
      {!loading && rows.length > 0 ? (
        <div className="flex h-52 items-end justify-between gap-2 px-1 pt-4">
          {rows.map((row) => {
            const height = Math.max(8, Math.round((row.count / max) * 100));
            return (
              <div key={row.name} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">{row.count}</span>
                <div className="flex h-36 w-full items-end justify-center">
                  <div
                    className="w-8 max-w-full rounded-t-md bg-brand-forest sm:w-10"
                    style={{ height: `${height}%` }}
                    title={`${row.name}: ${row.count}`}
                  />
                </div>
                <span className="w-full truncate text-center text-[11px] text-muted-foreground" title={row.name}>
                  {row.name}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
