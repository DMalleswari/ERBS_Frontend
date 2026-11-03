import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { PageHeader } from "@/shared/components/page-header";

export function ChangePasswordPage() {
  return (
    <div className="grid gap-4">
      <PageHeader eyebrow="Account" title="Change password" />
      <ChangePasswordForm />
    </div>
  );
}
