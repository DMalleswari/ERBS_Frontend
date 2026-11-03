import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { CalendarBooking } from "@/features/dashboard/lib/analytics";
import { Skeleton } from "@/shared/components/ui/skeleton";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function BookingCalendar({
  month,
  rows,
  loading,
  onPrev,
  onNext,
}: {
  month: Date;
  rows: CalendarBooking[];
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDow = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const title = month.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const byDay = new Map<number, CalendarBooking[]>();
  for (const row of rows) {
    const list = byDay.get(row.day) ?? [];
    list.push(row);
    byDay.set(row.day, list);
  }

  const cells: Array<number | null> = [...Array.from({ length: firstDow }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-[0_8px_24px_rgba(13,61,52,0.04)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Booking calendar</h2>
          <p className="text-sm text-muted-foreground">Active bookings this month</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
          <button type="button" className="rounded-full p-1.5 hover:bg-card" onClick={onPrev} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-28 px-2 text-center text-sm font-medium">{title}</span>
          <button type="button" className="rounded-full p-1.5 hover:bg-card" onClick={onNext} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? <Skeleton className="h-72 w-full rounded-2xl" /> : null}

      {!loading ? (
        <div className="overflow-x-auto">
          <div className="grid min-w-[560px] grid-cols-7 gap-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="px-1 text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            {cells.map((day, index) => {
              const events = day ? (byDay.get(day) ?? []) : [];
              return (
                <div
                  key={`${day ?? "e"}-${index}`}
                  className="min-h-20 rounded-2xl border border-transparent bg-muted/30 p-1.5"
                >
                  {day ? <p className="mb-1 px-1 text-xs font-medium text-muted-foreground">{day}</p> : null}
                  <div className="grid gap-1">
                    {events.slice(0, 2).map((event) => (
                      <Link
                        key={event.id}
                        to={`/bookings/${event.id}`}
                        className="truncate rounded-lg bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90"
                        title={`${event.label} · ${event.resource}`}
                      >
                        {event.label} · {event.resource}
                      </Link>
                    ))}
                    {events.length > 2 ? (
                      <p className="px-1 text-[10px] text-muted-foreground">+{events.length - 2} more</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
