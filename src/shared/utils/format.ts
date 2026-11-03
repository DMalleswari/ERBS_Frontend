export function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function labelAction(action: string): string {
  return action
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function toDateTimeInput(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDateTimeInput(value: string): string {
  return new Date(value).toISOString();
}

export function upcomingHourRange(): { startTime: string; endTime: string } {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return { startTime: toDateTimeInput(start), endTime: toDateTimeInput(end) };
}

export function dayBounds(date: string): { from: string; to: string } {
  const [year, month, day] = date.split("-").map(Number);
  const from = new Date(year, (month ?? 1) - 1, day ?? 1, 0, 0, 0, 0);
  const to = new Date(year, (month ?? 1) - 1, (day ?? 1) + 1, 0, 0, 0, 0);
  return { from: from.toISOString(), to: to.toISOString() };
}

export function todayDateInput(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
