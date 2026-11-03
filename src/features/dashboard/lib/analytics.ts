import type { Booking, Resource, ResourceType } from "@/shared/types/api";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export type TrendPoint = {
  label: string;
  active: number;
  cancelled: number;
};

export function bookingTrend(bookings: Booking[], days = 14): TrendPoint[] {
  const now = new Date(Date.now() + IST_OFFSET_MS);
  const buckets = new Map<string, TrendPoint>();
  const points: TrendPoint[] = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset));
    const key = day.toISOString().slice(0, 10);
    const point = {
      label: day.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }),
      active: 0,
      cancelled: 0,
    };
    buckets.set(key, point);
    points.push(point);
  }

  for (const booking of bookings) {
    const ist = new Date(new Date(booking.startTime).getTime() + IST_OFFSET_MS);
    const key = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate())).toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (booking.status === "ACTIVE") bucket.active += 1;
    else bucket.cancelled += 1;
  }

  return points;
}

export function resourcesByType(resources: Resource[], types: ResourceType[]): Array<{ name: string; count: number }> {
  const names = Object.fromEntries(types.map((type) => [type.id, type.name]));
  const counts = new Map<string, number>();
  for (const resource of resources) {
    const name = names[resource.resourceTypeId] ?? "Other";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 5);
}

export function upcomingBookings(bookings: Booking[]): Booking[] {
  const now = Date.now();
  return bookings
    .filter((booking) => booking.status === "ACTIVE" && new Date(booking.startTime).getTime() >= now)
    .sort((left, right) => new Date(left.startTime).getTime() - new Date(right.startTime).getTime())
    .slice(0, 4);
}

export function todaysBookingSplit(bookings: Booking[]): { active: number; cancelled: number; total: number } {
  const todayKey = new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10);
  let active = 0;
  let cancelled = 0;
  for (const booking of bookings) {
    const ist = new Date(new Date(booking.startTime).getTime() + IST_OFFSET_MS);
    const key = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate())).toISOString().slice(0, 10);
    if (key !== todayKey) continue;
    if (booking.status === "ACTIVE") active += 1;
    else cancelled += 1;
  }
  return { active, cancelled, total: active + cancelled };
}

export type CalendarBooking = {
  id: string;
  day: number;
  label: string;
  resource: string;
};

export function monthCalendarBookings(
  bookings: Booking[],
  resourceName: Record<string, string>,
  userName: Record<string, string>,
  month = new Date(),
): CalendarBooking[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  return bookings
    .filter((booking) => booking.status === "ACTIVE")
    .map((booking) => {
      const start = new Date(new Date(booking.startTime).getTime() + IST_OFFSET_MS);
      return {
        booking,
        year: start.getUTCFullYear(),
        month: start.getUTCMonth(),
        day: start.getUTCDate(),
      };
    })
    .filter((row) => row.year === year && row.month === monthIndex)
    .sort((left, right) => left.day - right.day || left.booking.startTime.localeCompare(right.booking.startTime))
    .slice(0, 12)
    .map((row) => ({
      id: row.booking.id,
      day: row.day,
      label: userName[row.booking.userId] ?? "Guest",
      resource: resourceName[row.booking.resourceId] ?? "Resource",
    }));
}

export function utilizationRate(activeResources: number | undefined, totalResources: number | undefined): number | null {
  if (activeResources == null || totalResources == null || totalResources === 0) return null;
  return Math.round((activeResources / totalResources) * 100);
}

/** Count records created in the current calendar month (from loaded sample). */
export function createdThisMonth(items: Array<{ createdAt: string }>): number {
  const now = new Date(Date.now() + IST_OFFSET_MS);
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  return items.filter((item) => {
    const created = new Date(new Date(item.createdAt).getTime() + IST_OFFSET_MS);
    return created.getUTCFullYear() === year && created.getUTCMonth() === month;
  }).length;
}

export function bookingsOnOffsetDay(bookings: Booking[], dayOffset: number): number {
  const now = new Date(Date.now() + IST_OFFSET_MS);
  const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + dayOffset));
  const key = day.toISOString().slice(0, 10);
  return bookings.filter((booking) => {
    const ist = new Date(new Date(booking.startTime).getTime() + IST_OFFSET_MS);
    return new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate())).toISOString().slice(0, 10) === key;
  }).length;
}

/** Last 7 days for the dashboard line chart labels. */
export function bookingTrendWeek(bookings: Booking[]): TrendPoint[] {
  return bookingTrend(bookings, 7).map((point) => ({
    ...point,
    label: point.label,
  }));
}
