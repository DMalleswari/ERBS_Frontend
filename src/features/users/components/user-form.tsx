import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation, useUpdateUserMutation } from "@/features/users/mutations/use-user-mutations";
import { useUserQuery } from "@/features/users/queries/use-users";
import { createUserSchema, updateUserSchema, type CreateUserValues, type UpdateUserValues } from "@/features/users/schemas/user-schema";
import { ErrorState } from "@/shared/components/error-state";
import { FormField } from "@/shared/components/form-field";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { PASSWORD_HINT } from "@/shared/schemas/common";

type UserFormProps = { mode: "create" } | { mode: "edit"; userId: string };

export function UserForm(props: UserFormProps) {
  if (props.mode === "create") return <CreateUserForm />;
  return <EditUserForm userId={props.userId} />;
}

function CreateUserForm() {
  const navigate = useNavigate();
  const createUser = useCreateUserMutation();
  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  return (
    <div className="grid gap-4">
      <PageHeader eyebrow="People" title="New user" actions={<Button asChild variant="outline"><Link to="/users">Back</Link></Button>} />
      <Card>
        <CardContent className="pt-6">
          <form
            className="grid max-w-lg gap-4"
            onSubmit={form.handleSubmit((values) => createUser.mutate(values, { onSuccess: (user) => navigate(`/users/${user.id}`) }))}
            noValidate
          >
            <FormField label="Name" htmlFor="name" error={form.formState.errors.name?.message}>
              <Input id="name" {...form.register("name")} />
            </FormField>
            <FormField label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
              <Input id="email" type="email" {...form.register("email")} />
            </FormField>
            <FormField label="Password" htmlFor="password" hint={PASSWORD_HINT} error={form.formState.errors.password?.message}>
              <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
            </FormField>
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? "Saving…" : "Create user"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function EditUserForm({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const user = useUserQuery(userId);
  const updateUser = useUpdateUserMutation(userId);

  if (user.isLoading) return <LoadingSpinner />;
  if (user.isError) return <ErrorState error={user.error} onRetry={() => void user.refetch()} />;
  if (!user.data) return null;

  return (
    <EditUserFields
      userId={userId}
      defaultValues={{ name: user.data.name, email: user.data.email }}
      pending={updateUser.isPending}
      onSubmit={(values) => updateUser.mutate(values, { onSuccess: () => navigate(`/users/${userId}`) })}
    />
  );
}

function EditUserFields({
  userId,
  defaultValues,
  pending,
  onSubmit,
}: {
  userId: string;
  defaultValues: UpdateUserValues;
  pending: boolean;
  onSubmit: (values: UpdateUserValues) => void;
}) {
  const form = useForm<UpdateUserValues>({ resolver: zodResolver(updateUserSchema), defaultValues });
  return (
    <div className="grid gap-4">
      <PageHeader eyebrow="People" title="Edit user" actions={<Button asChild variant="outline"><Link to={`/users/${userId}`}>Back</Link></Button>} />
      <Card>
        <CardContent className="pt-6">
          <form className="grid max-w-lg gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FormField label="Name" htmlFor="name" error={form.formState.errors.name?.message}>
              <Input id="name" {...form.register("name")} />
            </FormField>
            <FormField label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
              <Input id="email" type="email" {...form.register("email")} />
            </FormField>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
