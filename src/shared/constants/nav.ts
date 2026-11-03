import {
  Bell,
  BookMarked,
  Boxes,
  CalendarClock,
  LayoutDashboard,
  ScrollText,
  Shapes,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

/** Order matches the dashboard mock */
export const APP_NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/bookings", label: "Bookings", icon: BookMarked },
  { to: "/availability", label: "Availability", icon: CalendarClock },
  { to: "/resources", label: "Resources", icon: Boxes },
  { to: "/resource-types", label: "Resource Types", icon: Shapes },
  { to: "/users", label: "Users", icon: Users },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/audit-logs", label: "Audit Logs", icon: ScrollText },
];

const labels: Record<string, string> = {
  "": "Dashboard",
  users: "Users",
  "resource-types": "Resource Types",
  resources: "Resources",
  availability: "Availability",
  bookings: "Bookings",
  notifications: "Notifications",
  "audit-logs": "Audit Logs",
  profile: "Profile",
  "change-password": "Change Password",
  new: "New",
  edit: "Edit",
};

export type Crumb = { label: string; to?: string };

export function breadcrumbsFromPath(pathname: string): Crumb[] {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [{ label: "Dashboard" }];

  const crumbs: Crumb[] = [{ label: "Home", to: "/" }];
  let path = "";
  for (const [index, part] of parts.entries()) {
    path += `/${part}`;
    const isLast = index === parts.length - 1;
    const isUuid = /^[0-9a-f-]{36}$/i.test(part);
    const label = isUuid ? "Details" : (labels[part] ?? part);
    crumbs.push(isLast ? { label } : { label, to: path });
  }
  return crumbs;
}

export function pageTitleFromPath(pathname: string): string {
  const crumbs = breadcrumbsFromPath(pathname);
  return crumbs[crumbs.length - 1]?.label ?? "EBRS";
}
