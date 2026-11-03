import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useChangePasswordMutation } from "@/features/auth/mutations/use-auth-mutations";
import { changePasswordSchema, type ChangePasswordValues } from "@/features/auth/schemas/auth-schema";
import { FormField } from "@/shared/components/form-field";
import { PasswordInput } from "@/shared/components/password-input";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PASSWORD_HINT } from "@/shared/schemas/common";
import { getErrorMessage } from "@/shared/utils/error";

export function ChangePasswordForm() {
  const changePassword = useChangePasswordMutation();
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid max-w-md gap-4"
          onSubmit={form.handleSubmit((values) =>
            changePassword.mutate(values, {
              onSuccess: () => form.reset(),
            }),
          )}
          noValidate
        >
          {changePassword.isError ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
              {getErrorMessage(changePassword.error)}
            </p>
          ) : null}
          <FormField label="Current password" htmlFor="currentPassword" error={form.formState.errors.currentPassword?.message}>
            <PasswordInput id="currentPassword" autoComplete="current-password" {...form.register("currentPassword")} />
          </FormField>
          <FormField label="New password" htmlFor="newPassword" hint={PASSWORD_HINT} error={form.formState.errors.newPassword?.message}>
            <PasswordInput id="newPassword" autoComplete="new-password" {...form.register("newPassword")} />
          </FormField>
          <FormField label="Confirm new password" htmlFor="confirmPassword" error={form.formState.errors.confirmPassword?.message}>
            <PasswordInput id="confirmPassword" autoComplete="new-password" {...form.register("confirmPassword")} />
          </FormField>
          <Button type="submit" disabled={changePassword.isPending}>
            {changePassword.isPending ? "Saving…" : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
