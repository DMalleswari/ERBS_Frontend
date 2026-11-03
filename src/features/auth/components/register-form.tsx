import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/features/auth/mutations/use-auth-mutations";
import { registerSchema, type RegisterValues } from "@/features/auth/schemas/auth-schema";
import { FormField } from "@/shared/components/form-field";
import { PasswordInput } from "@/shared/components/password-input";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PASSWORD_HINT } from "@/shared/schemas/common";
import { getErrorMessage } from "@/shared/utils/error";

export function RegisterForm() {
  const navigate = useNavigate();
  const registerUser = useRegisterMutation();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <form
      className="grid gap-5"
      onSubmit={form.handleSubmit((values) =>
        registerUser.mutate(
          { name: values.name, email: values.email, password: values.password },
          { onSuccess: () => navigate("/", { replace: true }) },
        ),
      )}
      noValidate
    >
      {registerUser.isError ? (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
          {getErrorMessage(registerUser.error)}
        </p>
      ) : null}
      <FormField label="Name" htmlFor="name" error={form.formState.errors.name?.message}>
        <Input id="name" autoComplete="name" placeholder="Enter your name" className="h-11 bg-card" {...form.register("name")} />
      </FormField>
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
      <FormField label="Password" htmlFor="password" hint={PASSWORD_HINT} error={form.formState.errors.password?.message}>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          placeholder="Create a password"
          className="h-11 bg-card"
          {...form.register("password")}
        />
      </FormField>
      <FormField label="Confirm password" htmlFor="confirmPassword" error={form.formState.errors.confirmPassword?.message}>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm your password"
          className="h-11 bg-card"
          {...form.register("confirmPassword")}
        />
      </FormField>
      <Button type="submit" className="h-11 w-full text-base" disabled={registerUser.isPending}>
        {registerUser.isPending ? "Creating…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-primary hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
