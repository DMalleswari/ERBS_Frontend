import { Bell, ChevronDown, KeyRound, LogOut, Menu, Search, UserRound } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/auth-provider";
import { useUnreadCount } from "@/features/notifications/queries/use-notifications";
import { UserAvatar } from "@/shared/components/user-avatar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type AppNavbarProps = {
  onOpenMobileNav: () => void;
  onLogout: () => void;
};

export function AppNavbar({ onOpenMobileNav, onLogout }: AppNavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const unread = useUnreadCount();
  const count = unread.data ?? 0;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    void navigate(`/bookings?q=${encodeURIComponent(value)}`);
  }

  return (
    <header className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-card px-3 shadow-[0_1px_2px_rgba(28,25,23,0.04)] sm:px-4">
      <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={onOpenMobileNav} aria-label="Open menu">
        <Menu className="h-4 w-4" />
      </Button>

      <form onSubmit={onSearch} className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search bookings, resources, users…"
          className="h-10 border-0 bg-muted/50 pl-9 shadow-none focus-visible:ring-1"
          aria-label="Search"
        />
      </form>

      <div className="flex items-center gap-1">
        <Button asChild variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
          <Link to="/notifications">
            <Bell className="h-4 w-4" />
            {count > 0 ? (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
            ) : null}
          </Link>
        </Button>

        <div className="relative" ref={menuRef}>
          <Button
            type="button"
            variant="ghost"
            className="gap-2 rounded-full px-2"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <UserAvatar name={user?.name} size="sm" />
            <span className="hidden max-w-36 truncate text-sm sm:inline">{user?.name}</span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
          </Button>
          {open ? (
            <div role="menu" className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-popover p-1 shadow-lg">
              <div className="border-b border-border px-3 py-2">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Link
                role="menuitem"
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                <UserRound className="h-4 w-4" />
                Profile
              </Link>
              <Link
                role="menuitem"
                to="/change-password"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                <KeyRound className="h-4 w-4" />
                Change password
              </Link>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
