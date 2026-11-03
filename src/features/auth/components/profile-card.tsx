import { KeyRound, LogOut, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/auth-provider";
import { UserAvatar } from "@/shared/components/user-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { formatWhen } from "@/shared/utils/format";
import { cn } from "@/shared/utils/cn";

export function ProfileCard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  async function onLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} className="h-16 w-16 text-lg" />
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="mt-1 font-medium">{user.email}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <dt className="text-muted-foreground">Joined</dt>
              <dd className="mt-1 font-medium">{formatWhen(user.createdAt)}</dd>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3 sm:col-span-2">
              <dt className="text-muted-foreground">Last updated</dt>
              <dd className="mt-1 font-medium">{formatWhen(user.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardContent className="grid gap-1 p-3">
          <SideLink to="/profile" icon={UserRound} label="Profile" active />
          <SideLink to="/change-password" icon={KeyRound} label="Change password" />
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => void onLogout()}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

function SideLink({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: typeof UserRound;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
        active && "bg-primary/10 font-medium text-primary",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
