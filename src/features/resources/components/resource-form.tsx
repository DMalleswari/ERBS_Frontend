import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useResourceTypesQuery } from "@/features/resource-types/queries/use-resource-types";
import { useCreateResourceMutation, useUpdateResourceMutation } from "@/features/resources/mutations/use-resource-mutations";
import { useResourceQuery } from "@/features/resources/queries/use-resources";
import { resourceSchema, type ResourceValues } from "@/features/resources/schemas/resource-schema";
import { ErrorState } from "@/shared/components/error-state";
import { FormField } from "@/shared/components/form-field";
import { LoadingSpinner } from "@/shared/components/loading-spinner";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

type ResourceFormProps = { mode: "create" } | { mode: "edit"; resourceId: string };

export function ResourceForm(props: ResourceFormProps) {
  if (props.mode === "edit") return <EditResourceForm resourceId={props.resourceId} />;
  return (
    <ResourceFields
      title="New resource"
      pendingLabel="Create resource"
      defaultValues={{ name: "", description: "", resourceTypeId: "", capacity: 1, location: "", isActive: true }}
    />
  );
}

function EditResourceForm({ resourceId }: { resourceId: string }) {
  const record = useResourceQuery(resourceId);
  if (record.isLoading) return <LoadingSpinner />;
  if (record.isError || !record.data) return <ErrorState error={record.error} onRetry={() => void record.refetch()} />;
  return (
    <ResourceFields
      resourceId={resourceId}
      title="Edit resource"
      pendingLabel="Save changes"
      defaultValues={{
        name: record.data.name,
        description: record.data.description ?? "",
        resourceTypeId: record.data.resourceTypeId,
        capacity: record.data.capacity,
        location: record.data.location,
        isActive: record.data.isActive,
      }}
    />
  );
}

function ResourceFields({
  resourceId,
  title,
  pendingLabel,
  defaultValues,
}: {
  resourceId?: string;
  title: string;
  pendingLabel: string;
  defaultValues: ResourceValues;
}) {
  const navigate = useNavigate();
  const types = useResourceTypesQuery({ page: 1, limit: 100, sortBy: "name", order: "asc" });
  const createResource = useCreateResourceMutation();
  const updateResource = useUpdateResourceMutation(resourceId ?? "new");
  const pending = createResource.isPending || updateResource.isPending;
  const form = useForm<z.input<typeof resourceSchema>, unknown, ResourceValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues,
  });

  function submit(values: ResourceValues) {
    if (resourceId) {
      updateResource.mutate(values, { onSuccess: (resource) => navigate(`/resources/${resource.id}`) });
      return;
    }
    createResource.mutate(values, { onSuccess: (resource) => navigate(`/resources/${resource.id}`) });
  }

  return (
    <div className="grid gap-4">
      <PageHeader eyebrow="Catalog" title={title} actions={<Button asChild variant="outline"><Link to="/resources">Back</Link></Button>} />
      <Card>
        <CardContent className="pt-6">
          <form className="grid max-w-lg gap-4" onSubmit={form.handleSubmit(submit)} noValidate>
            <FormField label="Name" htmlFor="name" error={form.formState.errors.name?.message}>
              <Input id="name" {...form.register("name")} />
            </FormField>
            <FormField label="Type" htmlFor="resourceTypeId" error={form.formState.errors.resourceTypeId?.message}>
              <Controller
                control={form.control}
                name="resourceTypeId"
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger id="resourceTypeId"><SelectValue placeholder="Select a type" /></SelectTrigger>
                    <SelectContent>
                      {(types.data?.items ?? []).map((type) => (
                        <SelectItem key={type.id} value={type.id}>{type.code} — {type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Capacity" htmlFor="capacity" error={form.formState.errors.capacity?.message}>
              <Input id="capacity" type="number" min={1} {...form.register("capacity")} />
            </FormField>
            <FormField label="Location" htmlFor="location" error={form.formState.errors.location?.message}>
              <Input id="location" {...form.register("location")} />
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
