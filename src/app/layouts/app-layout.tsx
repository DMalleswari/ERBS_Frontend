import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppNavbar } from "@/app/layouts/app-navbar";
import { AppSidebar } from "@/app/layouts/app-sidebar";
import { useAuth } from "@/app/providers/auth-provider";
import { Sheet, SheetContent } from "@/shared/components/ui/sheet";

const COLLAPSE_KEY = "erbs_sidebar_collapsed";

export function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === "1");

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  async function onLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-background md:flex">
      {/* Forest sidebar — flush left, full height */}
      <div className="sticky top-0 hidden h-screen shrink-0 md:block">
        <AppSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          onLogout={() => void onLogout()}
        />
      </div>

      {/*
        Ivory gutter around the workspace (padding from sidebar + edges).
        This is the gap you see between the dark sidebar and the white cards.
      */}
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4 md:p-5 lg:p-6">
        <AppNavbar onOpenMobileNav={() => setMobileOpen(true)} onLogout={() => void onLogout()} />
        <main className="mt-4 min-w-0 flex-1 md:mt-5">
          <Outlet />
        </main>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent className="border-0 bg-transparent p-0 text-sidebar-foreground" aria-label="Navigation">
          <AppSidebar
            collapsed={false}
            mobile
            onToggle={() => undefined}
            onNavigate={() => setMobileOpen(false)}
            onLogout={() => void onLogout()}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
