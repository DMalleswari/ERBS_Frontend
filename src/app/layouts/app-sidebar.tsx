import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/app/providers/auth-provider";
import { useUnreadCount } from "@/features/notifications/queries/use-notifications";
import { UserAvatar } from "@/shared/components/user-avatar";
import { Button } from "@/shared/components/ui/button";
import { APP_NAV } from "@/shared/constants/nav";
import { cn } from "@/shared/utils/cn";

type AppSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  onLogout: () => void;
  mobile?: boolean;
};

export function AppSidebar({ collapsed, onToggle, onNavigate, onLogout, mobile = false }: AppSidebarProps) {
  const { user } = useAuth();
  const unread = useUnreadCount();
  const count = unread.data ?? 0;
  const narrow = collapsed && !mobile;

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground",
        mobile ? "w-72" : narrow ? "w-[4.5rem]" : "w-56",
      )}
    >
      <div className={cn("flex items-center gap-2.5 px-4 py-5", narrow && "justify-center px-2")}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          E
        </span>
        {!narrow ? <p className="truncate text-sm font-semibold text-white">EBRS</p> : null}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 pb-3">
        {APP_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={narrow ? item.label : undefined}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  narrow && "justify-center px-2",
                  isActive && "bg-sidebar-accent font-medium text-white",
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!narrow ? <span className="truncate">{item.label}</span> : null}
              {!narrow && item.to === "/notifications" && count > 0 ? (
                <span className="ml-auto rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-4 text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-sidebar-border p-2">
        {!mobile ? (
          <Button
            type="button"
            variant="ghost"
            size={narrow ? "icon" : "sm"}
            className={cn(
              "mb-2 w-full text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
              narrow ? "justify-center" : "justify-start",
            )}
            onClick={onToggle}
            aria-label={narrow ? "Expand sidebar" : "Collapse sidebar"}
          >
            {narrow ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!narrow ? <span>Collapse</span> : null}
          </Button>
        ) : null}

        <div className={cn("mb-2 flex items-center gap-2 rounded-lg px-2 py-2", narrow && "justify-center")}>
          <UserAvatar name={user?.name} className="bg-white/10 text-white" />
          {!narrow ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-sidebar-muted">{user?.email}</p>
            </div>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size={narrow ? "icon" : "sm"}
          className={cn(
            "w-full text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
            narrow ? "justify-center" : "justify-start",
          )}
          onClick={onLogout}
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
          {!narrow ? <span>Log out</span> : null}
        </Button>
      </div>
    </aside>
  );
}
