import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useCreateResourceTypeMutation, useUpdateResourceTypeMutation } from "@/features/resource-types/mutations/use-resource-type-mutations";
import { useResourceTypeQuery } from "@/features/resource-types/queries/use-resource-types";
import { resourceTypeSchema, type ResourceTypeValues } from "@/features/resource-types/schemas/resource-type-schema";
import { ErrorState } from "@/shared/components/error-state";
import { FormField } from "@/shared/components/form-field";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

type ResourceTypeFormProps = { mode: "create" } | { mode: "edit"; typeId: string };

export function ResourceTypeForm(props: ResourceTypeFormProps) {
  if (props.mode === "edit") return <EditResourceTypeForm typeId={props.typeId} />;
  return <ResourceTypeFields title="New type" pendingLabel="Create type" backTo="/resource-types" defaultValues={{ code: "", name: "", description: "", isActive: true }} />;
}

function EditResourceTypeForm({ typeId }: { typeId: string }) {
  const record = useResourceTypeQuery(typeId);
  if (record.isLoading) return <LoadingSpinner />;
  if (record.isError || !record.data) return <ErrorState error={record.error} onRetry={() => void record.refetch()} />;
  return (
    <ResourceTypeFields
      typeId={typeId}
      title="Edit type"
      pendingLabel="Save changes"
      backTo="/resource-types"
      defaultValues={{
        code: record.data.code,
        name: record.data.name,
        description: record.data.description ?? "",
        isActive: record.data.isActive,
      }}
    />
  );
}

function ResourceTypeFields({
  typeId,
  title,
  pendingLabel,
  backTo,
  defaultValues,
}: {
  typeId?: string;
  title: string;
  pendingLabel: string;
  backTo: string;
  defaultValues: ResourceTypeValues;
}) {
  const navigate = useNavigate();
  const createType = useCreateResourceTypeMutation();
  const updateType = useUpdateResourceTypeMutation(typeId ?? "");
  const pending = createType.isPending || updateType.isPending;
  const form = useForm<ResourceTypeValues>({ resolver: zodResolver(resourceTypeSchema), defaultValues });

  function submit(values: ResourceTypeValues) {
    if (typeId) {
      updateType.mutate(values, { onSuccess: () => navigate(backTo) });
      return;
    }
    createType.mutate(values, { onSuccess: () => navigate(backTo) });
  }

  return (
    <div className="grid gap-4">
      <PageHeader eyebrow="Catalog" title={title} actions={<Button asChild variant="outline"><Link to={backTo}>Back</Link></Button>} />
      <Card>
        <CardContent className="pt-6">
          <form className="grid max-w-lg gap-4" onSubmit={form.handleSubmit(submit)} noValidate>
            <FormField label="Code" htmlFor="code" hint="Letters, numbers, and underscores. Stored in uppercase." error={form.formState.errors.code?.message}>
              <Input id="code" {...form.register("code")} />
            </FormField>
            <FormField label="Name" htmlFor="name" error={form.formState.errors.name?.message}>
              <Input id="name" {...form.register("name")} />
            </FormField>
            <FormField label="Description" htmlFor="description" error={form.formState.errors.description?.message}>
              <Textarea id="description" {...form.register("description")} />
            </FormField>
            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox id="isActive" checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              )}
            />
            <Button type="submit" disabled={pending}>{pending ? "Saving…" : pendingLabel}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
