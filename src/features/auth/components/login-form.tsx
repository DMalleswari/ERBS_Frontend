import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLoginMutation } from "@/features/auth/mutations/use-auth-mutations";
import { loginSchema, type LoginValues } from "@/features/auth/schemas/auth-schema";
import { FormField } from "@/shared/components/form-field";
import { PasswordInput } from "@/shared/components/password-input";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { getRememberPreference } from "@/shared/api/token";
import { getErrorMessage } from "@/shared/utils/error";
import { cn } from "@/shared/utils/cn";

export function LoginForm() {
  const navigate = useNavigate();
  const login = useLoginMutation();
  const [remember, setRemember] = useState(getRememberPreference());
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      className="grid gap-5"
      onSubmit={form.handleSubmit((values) =>
        login.mutate(
          { ...values, remember },
          { onSuccess: () => navigate("/", { replace: true }) },
        ),
      )}
      noValidate
    >
      {login.isError ? (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {getErrorMessage(login.error)}
        </p>
      ) : null}

      <FormField label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          className="h-11 bg-card"
          {...form.register("email")}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" error={form.formState.errors.password?.message}>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className="h-11 bg-card"
          {...form.register("password")}
        />
      </FormField>

      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 text-foreground">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className={cn(
              "h-4 w-4 rounded border-border text-primary accent-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
            )}
          />
          Remember me
        </label>
        <button
          type="button"
          className="font-medium text-primary hover:underline"
          onClick={() =>
            toast.message("Password reset is not available in V1", {
              description: "Sign in, then use Change password — or ask an administrator.",
            })
          }
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" className="h-11 w-full text-base" disabled={login.isPending}>
        {login.isPending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link className="font-medium text-primary hover:underline" to="/register">
          Register
        </Link>
      </p>
    </form>
  );
}
