import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "@/features/auth/mutations/use-auth-mutations";
import { resetPasswordSchema, type ResetPasswordValues } from "@/features/auth/schemas/auth-schema";
import { FormField } from "@/shared/components/form-field";
import { PasswordInput } from "@/shared/components/password-input";
import { Button } from "@/shared/components/ui/button";
import { PASSWORD_HINT } from "@/shared/schemas/common";
import { getErrorMessage } from "@/shared/utils/error";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const resetPassword = useResetPasswordMutation();
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, newPassword: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <div className="grid gap-4">
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          This reset link is missing or invalid. Request a new one from the forgot password page.
        </p>
        <Link className="text-sm font-medium text-primary hover:underline" to="/forgot-password">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={form.handleSubmit((values) =>
        resetPassword.mutate(
          { ...values, token },
          { onSuccess: () => navigate("/login", { replace: true }) },
        ),
      )}
      noValidate
    >
      {resetPassword.isError ? (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {getErrorMessage(resetPassword.error)}
        </p>
      ) : null}

      <FormField label="New password" htmlFor="newPassword" hint={PASSWORD_HINT} error={form.formState.errors.newPassword?.message}>
        <PasswordInput
          id="newPassword"
          autoComplete="new-password"
          placeholder="Create a new password"
          className="h-11 bg-card"
          {...form.register("newPassword")}
        />
      </FormField>

      <FormField label="Confirm new password" htmlFor="confirmPassword" error={form.formState.errors.confirmPassword?.message}>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          className="h-11 bg-card"
          {...form.register("confirmPassword")}
        />
      </FormField>

      <Button type="submit" className="h-11 w-full text-base" disabled={resetPassword.isPending}>
        {resetPassword.isPending ? "Updating…" : "Reset password"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link className="font-medium text-primary hover:underline" to="/login">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
