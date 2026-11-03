import { useMemo } from "react";
import { useAuditLogsQuery } from "@/features/audit-logs/queries/use-audit-logs";
import { useUsersQuery } from "@/features/users/queries/use-users";
import { AUDIT_ACTIONS, AUDIT_ENTITIES } from "@/shared/constants/audit";
import { DataTable, type Column } from "@/shared/components/data-table";
import { ErrorState } from "@/shared/components/error-state";
import { PageHeader } from "@/shared/components/page-header";
import { Pagination } from "@/shared/components/pagination";
import { SearchInput } from "@/shared/components/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useListQueryState } from "@/shared/hooks/use-list-query-state";
import type { AuditAction, AuditLog } from "@/shared/types/api";
import { formatWhen, labelAction } from "@/shared/utils/format";

export function AuditLogList() {
  const list = useListQueryState({ sortBy: "createdAt", order: "desc" });
  const action = list.params.get("action") ?? "all";
  const entity = list.params.get("entity") ?? "all";
  const logs = useAuditLogsQuery({
    page: list.page,
    limit: 20,
    search: list.search || undefined,
    sortBy: list.sortBy,
    order: list.order,
    action: action === "all" ? undefined : (action as AuditAction),
    entity: entity === "all" ? undefined : entity,
  });
  const users = useUsersQuery({ page: 1, limit: 100, sortBy: "name", order: "asc" });
  const actorName = useMemo(
    () => Object.fromEntries((users.data?.items ?? []).map((user) => [user.id, user.name])),
    [users.data?.items],
  );

  const columns: Column<AuditLog>[] = [
    {
      key: "actor",
      header: "Actor",
      cell: (row) => (row.actorId ? (actorName[row.actorId] ?? row.actorId.slice(0, 8)) : "System"),
    },
    { key: "action", header: "Action", cell: (row) => labelAction(row.action) },
    { key: "entity", header: "Entity", cell: (row) => row.entity },
    { key: "record", header: "Entity ID", className: "font-mono text-xs", cell: (row) => row.entityId },
    { key: "when", header: "Timestamp", cell: (row) => formatWhen(row.createdAt) },
  ];

  return (
    <div className="grid gap-4">
      <PageHeader eyebrow="History" title="Audit logs" description="Who changed users, resources, and bookings." />
      <div className="flex flex-wrap gap-2">
        <SearchInput value={list.draft} onChange={list.setDraft} placeholder="Search action, entity, or id" />
        <Select value={action} onValueChange={(value) => list.patch({ action: value === "all" ? undefined : value, page: undefined })}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {AUDIT_ACTIONS.map((item) => (
              <SelectItem key={item} value={item}>
                {labelAction(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={entity} onValueChange={(value) => list.patch({ entity: value === "all" ? undefined : value, page: undefined })}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All entities</SelectItem>
            {AUDIT_ENTITIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {logs.isError ? <ErrorState error={logs.error} onRetry={() => void logs.refetch()} /> : null}
      <DataTable
        columns={columns}
        rows={logs.data?.items ?? []}
        getRowId={(row) => row.id}
        isLoading={logs.isLoading}
        emptyTitle="No audit entries match these filters"
      />
      <Pagination meta={logs.data?.meta} onPage={list.setPage} />
    </div>
  );
}
