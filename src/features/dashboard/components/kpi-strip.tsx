import { Skeleton } from "@/shared/components/ui/skeleton";

type Metric = {
  label: string;
  value: number | undefined;
  hint?: string;
};

export function KpiStrip({ metrics, loading }: { metrics: Metric[]; loading: boolean }) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-xl border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">{metric.label}</p>
          {loading ? <Skeleton className="mt-2 h-7 w-10" /> : <p className="mt-1 text-2xl font-semibold tracking-tight">{metric.value ?? "—"}</p>}
          {metric.hint ? <p className="mt-1 text-[11px] text-muted-foreground">{metric.hint}</p> : null}
        </div>
      ))}
    </section>
  );
}
