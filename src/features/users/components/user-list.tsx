import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteUserMutation } from "@/features/users/mutations/use-user-mutations";
import { useUsersQuery } from "@/features/users/queries/use-users";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { DataTable, type Column } from "@/shared/components/data-table";
import { ErrorState } from "@/shared/components/error-state";
import { PageHeader } from "@/shared/components/page-header";
import { Pagination } from "@/shared/components/pagination";
import { SearchInput } from "@/shared/components/search-input";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useListQueryState } from "@/shared/hooks/use-list-query-state";
import type { User } from "@/shared/types/api";
import { formatWhen } from "@/shared/utils/format";

const sortOptions = [
  { value: "createdAt:desc", label: "Newest" },
  { value: "name:asc", label: "Name" },
  { value: "email:asc", label: "Email" },
  { value: "updatedAt:desc", label: "Recently updated" },
];

export function UserList() {
  const list = useListQueryState({ sortBy: "createdAt", order: "desc" });
  const users = useUsersQuery({
    page: list.page,
    limit: 20,
    search: list.search || undefined,
    sortBy: list.sortBy,
    order: list.order,
  });
  const remove = useDeleteUserMutation();
  const [target, setTarget] = useState<User | null>(null);

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => (
        <Link className="font-medium text-primary" to={`/users/${row.id}`}>
          {row.name}
        </Link>
      ),
    },
    { key: "email", header: "Email", cell: (row) => row.email },
    { key: "created", header: "Created", cell: (row) => formatWhen(row.createdAt) },
    {
      key: "actions",
      header: "",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/users/${row.id}/edit`}>Edit</Link>
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
        eyebrow="People"
        title="Users"
        description="Search, sort, and manage accounts."
        actions={
          <Button asChild>
            <Link to="/users/new">+ Add user</Link>
          </Button>
        }
      />
      <div className="flex flex-wrap gap-2">
        <SearchInput value={list.draft} onChange={list.setDraft} placeholder="Search name or email" />
        <Select value={`${list.sortBy}:${list.order}`} onValueChange={(value) => {
          const [sortBy, order] = value.split(":") as [string, "asc" | "desc"];
          list.setSort(sortBy, order);
        }}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {users.isError ? <ErrorState error={users.error} onRetry={() => void users.refetch()} /> : null}
      <DataTable columns={columns} rows={users.data?.items ?? []} getRowId={(row) => row.id} isLoading={users.isLoading} emptyTitle="No users match this search" />
      <Pagination meta={users.data?.meta} onPage={list.setPage} />
      <ConfirmDialog
        open={Boolean(target)}
        title="Delete user"
        description={target ? `${target.name} will be removed. This is blocked while they still have bookings.` : ""}
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
