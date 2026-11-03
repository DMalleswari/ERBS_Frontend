import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/auth-provider";
import { LoadingSpinner } from "@/shared/components/loading-spinner";

export function ProtectedRoute() {
  const { token, user, isLoading } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <LoadingSpinner label="Restoring session" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function GuestRoute() {
  const { token, user, isLoading } = useAuth();
  if (token && isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <LoadingSpinner label="Restoring session" />
      </div>
    );
  }
  if (token && user) return <Navigate to="/" replace />;
  return <Outlet />;
}
