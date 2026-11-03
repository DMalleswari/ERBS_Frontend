import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/cn";

type StatCardProps = {
  label: string;
  value: number | string | undefined;
  icon?: LucideIcon;
  loading?: boolean;
  hint?: string;
  hintTone?: "muted" | "positive";
  className?: string;
};

export function StatCard({ label, value, icon: Icon, loading, hint, hintTone = "muted", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-[0_4px_16px_rgba(28,25,23,0.05)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-14" />
          ) : (
            <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{value ?? "—"}</p>
          )}
          {hint ? (
            <p className={cn("mt-2 text-xs font-medium", hintTone === "positive" ? "text-success" : "text-muted-foreground")}>
              {hint}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
