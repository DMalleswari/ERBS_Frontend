import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteResourceTypeMutation } from "@/features/resource-types/mutations/use-resource-type-mutations";
import { useResourceTypesQuery } from "@/features/resource-types/queries/use-resource-types";
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
import type { ResourceType } from "@/shared/types/api";

export function ResourceTypeList() {
  const list = useListQueryState({ sortBy: "name", order: "asc" });
  const status = list.params.get("status") ?? "all";
  const types = useResourceTypesQuery({
    page: list.page,
    limit: 20,
    search: list.search || undefined,
    sortBy: list.sortBy,
    order: list.order,
    isActive: status === "all" ? undefined : (status as "true" | "false"),
  });
  const remove = useDeleteResourceTypeMutation();
  const [target, setTarget] = useState<ResourceType | null>(null);

  const columns: Column<ResourceType>[] = [
    {
      key: "code",
      header: "Code",
      cell: (row) => (
        <Link className="font-medium text-primary" to={`/resource-types/${row.id}`}>
          {row.code}
        </Link>
      ),
    },
    {
      key: "name",
      header: "Name",
      cell: (row) => (
        <div>
          <div>{row.name}</div>
          {row.description ? <div className="text-xs text-muted-foreground">{row.description}</div> : null}
        </div>
      ),
    },
    { key: "status", header: "Status", cell: (row) => <StatusBadge active={row.isActive} /> },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/resource-types/${row.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setTarget(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="Catalog"
        title="Resource types"
        description="Rooms, vehicles, equipment, and other categories."
        actions={<Button asChild><Link to="/resource-types/new">New type</Link></Button>}
      />
      <div className="flex flex-wrap gap-2">
        <SearchInput value={list.draft} onChange={list.setDraft} placeholder="Search name or code" />
        <Select value={status} onValueChange={(value) => list.patch({ status: value === "all" ? undefined : value, page: undefined })}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {types.isError ? <ErrorState error={types.error} onRetry={() => void types.refetch()} /> : null}
      <DataTable columns={columns} rows={types.data?.items ?? []} getRowId={(row) => row.id} isLoading={types.isLoading} emptyTitle="No resource types match this search" />
      <Pagination meta={types.data?.meta} onPage={list.setPage} />
      <ConfirmDialog
        open={Boolean(target)}
        title="Delete resource type"
        description={target ? `${target.code} can be deleted only when no resources use it.` : ""}
        pending={remove.isPending}
        onOpenChange={(open) => { if (!open) setTarget(null); }}
        onConfirm={() => {
          if (!target) return;
          remove.mutate(target.id, { onSuccess: () => setTarget(null) });
        }}
      />
    </div>
  );
}
