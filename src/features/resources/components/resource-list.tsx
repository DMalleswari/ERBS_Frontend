import { useState } from "react";
import { Link } from "react-router-dom";
import { useResourceTypesQuery } from "@/features/resource-types/queries/use-resource-types";
import { useDeleteResourceMutation } from "@/features/resources/mutations/use-resource-mutations";
import { useResourcesQuery } from "@/features/resources/queries/use-resources";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { DataTable, type Column } from "@/shared/components/data-table";
import { ErrorState } from "@/shared/components/error-state";
import { PageHeader } from "@/shared/components/page-header";
import { Pagination } from "@/shared/components/pagination";
import { SearchInput } from "@/shared/components/search-input";
import { StatusBadge } from "@/shared/components/status-badge";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useListQueryState } from "@/shared/hooks/use-list-query-state";
import type { Resource } from "@/shared/types/api";

export function ResourceList() {
  const list = useListQueryState({ sortBy: "name", order: "asc" });
  const typeFilter = list.params.get("type") ?? "all";
  const status = list.params.get("status") ?? "all";
  const types = useResourceTypesQuery({ page: 1, limit: 100, sortBy: "name", order: "asc" });
  const resources = useResourcesQuery({
    page: list.page,
    limit: 20,
    search: list.search || undefined,
    sortBy: list.sortBy,
    order: list.order,
    resourceTypeId: typeFilter === "all" ? undefined : typeFilter,
    isActive: status === "all" ? undefined : (status as "true" | "false"),
  });
  const remove = useDeleteResourceMutation();
  const [target, setTarget] = useState<Resource | null>(null);
  const typeName = Object.fromEntries((types.data?.items ?? []).map((type) => [type.id, type.name]));

  const columns: Column<Resource>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => (
        <Link className="font-medium text-primary" to={`/resources/${row.id}`}>
          {row.name}
        </Link>
      ),
    },
    { key: "type", header: "Type", cell: (row) => typeName[row.resourceTypeId] ?? "—" },
    { key: "capacity", header: "Capacity", cell: (row) => row.capacity },
    { key: "location", header: "Location", cell: (row) => row.location },
    { key: "status", header: "Status", cell: (row) => <StatusBadge active={row.isActive} /> },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button asChild variant="outline" size="sm"><Link to={`/resources/${row.id}/edit`}>Edit</Link></Button>
          <Button variant="destructive" size="sm" onClick={() => setTarget(row)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="Catalog"
        title="Resources"
        description="Search, filter, and sort bookable resources."
        actions={<Button asChild><Link to="/resources/new">New resource</Link></Button>}
      />
      <div className="flex flex-wrap gap-2">
        <SearchInput value={list.draft} onChange={list.setDraft} placeholder="Search name, description, or location" />
        <Select value={typeFilter} onValueChange={(value) => list.patch({ type: value === "all" ? undefined : value, page: undefined })}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {(types.data?.items ?? []).map((type) => (
              <SelectItem key={type.id} value={type.id}>{type.code}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => list.patch({ status: value === "all" ? undefined : value, page: undefined })}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={`${list.sortBy}:${list.order}`} onValueChange={(value) => {
          const [sortBy, order] = value.split(":") as [string, "asc" | "desc"];
          list.setSort(sortBy, order);
        }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="name:asc">Name</SelectItem>
            <SelectItem value="capacity:desc">Capacity</SelectItem>
            <SelectItem value="location:asc">Location</SelectItem>
            <SelectItem value="createdAt:desc">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {resources.isError ? <ErrorState error={resources.error} onRetry={() => void resources.refetch()} /> : null}
      <DataTable columns={columns} rows={resources.data?.items ?? []} getRowId={(row) => row.id} isLoading={resources.isLoading} emptyTitle="No resources match these filters" />
      <Pagination meta={resources.data?.meta} onPage={list.setPage} />
      <ConfirmDialog
        open={Boolean(target)}
        title="Delete resource"
        description={target ? `${target.name} can be deleted only when it has no bookings.` : ""}
        pending={remove.isPending}
        onOpenChange={(open) => { if (!open) setTarget(null); }}
        onConfirm={() => { if (!target) return; remove.mutate(target.id, { onSuccess: () => setTarget(null) }); }}
      />
    </div>
  );
}
