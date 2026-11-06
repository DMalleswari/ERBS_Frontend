import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "@/features/auth/mutations/use-auth-mutations";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/features/auth/schemas/auth-schema";
import { FormField } from "@/shared/components/form-field";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { getErrorMessage } from "@/shared/utils/error";

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPasswordMutation();
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  if (submittedMessage) {
    return (
      <div className="grid gap-5">
        <p className="rounded-lg border border-border bg-muted/40 px-3 py-3 text-sm text-foreground" role="status">
          {submittedMessage}
        </p>
        <p className="text-sm text-muted-foreground">
          Check your inbox for a reset link. It may take a minute to arrive.
        </p>
        <Link className="text-sm font-medium text-primary hover:underline" to="/login">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      className="grid gap-5"
      onSubmit={form.handleSubmit((values) =>
        forgotPassword.mutate(values, {
          onSuccess: (message) => setSubmittedMessage(message),
        }),
      )}
      noValidate
    >
      {forgotPassword.isError ? (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {getErrorMessage(forgotPassword.error)}
        </p>
      ) : null}

      <FormField label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your account email"
          className="h-11 bg-card"
          {...form.register("email")}
        />
      </FormField>

      <Button type="submit" className="h-11 w-full text-base" disabled={forgotPassword.isPending}>
        {forgotPassword.isPending ? "Sending…" : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link className="font-medium text-primary hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
