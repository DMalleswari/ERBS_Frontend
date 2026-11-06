import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/app/layouts/app-layout";
import { AuthLayout } from "@/app/layouts/auth-layout";
import { AuditLogsPage } from "@/pages/audit-logs-page";
import { AvailabilityPage } from "@/pages/availability-page";
import { BookingDetailPage } from "@/pages/booking-detail-page";
import { BookingFormPage } from "@/pages/booking-form-page";
import { BookingsPage } from "@/pages/bookings-page";
import { ChangePasswordPage } from "@/pages/change-password-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { ForgotPasswordPage } from "@/pages/forgot-password-page";
import { LoginPage } from "@/pages/login-page";
import { NotificationsPage } from "@/pages/notifications-page";
import { ProfilePage } from "@/pages/profile-page";
import { RegisterPage } from "@/pages/register-page";
import { ResetPasswordPage } from "@/pages/reset-password-page";
import { ResourceDetailPage } from "@/pages/resource-detail-page";
import { ResourceFormPage } from "@/pages/resource-form-page";
import { ResourceTypeDetailPage } from "@/pages/resource-type-detail-page";
import { ResourceTypeFormPage } from "@/pages/resource-type-form-page";
import { ResourceTypesPage } from "@/pages/resource-types-page";
import { ResourcesPage } from "@/pages/resources-page";
import { UserDetailPage } from "@/pages/user-detail-page";
import { UserFormPage } from "@/pages/user-form-page";
import { UsersPage } from "@/pages/users-page";
import { GuestRoute, ProtectedRoute } from "@/shared/components/protected-route";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout title="Welcome back" description="Sign in to your account" />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<AuthLayout title="Create account" description="Register to start booking resources" />}>
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route
          element={
            <AuthLayout title="Forgot password" description="Enter your email and we'll send a reset link" />
          }
        >
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        <Route element={<AuthLayout title="Reset password" description="Choose a new password for your account" />}>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/new" element={<UserFormPage mode="create" />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="users/:id/edit" element={<UserFormPage mode="edit" />} />
          <Route path="resource-types" element={<ResourceTypesPage />} />
          <Route path="resource-types/new" element={<ResourceTypeFormPage mode="create" />} />
          <Route path="resource-types/:id" element={<ResourceTypeDetailPage />} />
          <Route path="resource-types/:id/edit" element={<ResourceTypeFormPage mode="edit" />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="resources/new" element={<ResourceFormPage mode="create" />} />
          <Route path="resources/:id" element={<ResourceDetailPage />} />
          <Route path="resources/:id/edit" element={<ResourceFormPage mode="edit" />} />
          <Route path="availability" element={<AvailabilityPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/new" element={<BookingFormPage />} />
          <Route path="bookings/:id" element={<BookingDetailPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
