import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/providers/auth-provider";
import { useCancelBookingMutation } from "@/features/bookings/mutations/use-booking-mutations";
import { useBookingsQuery } from "@/features/bookings/queries/use-bookings";
import { useResourcesQuery } from "@/features/resources/queries/use-resources";
import { useUsersQuery } from "@/features/users/queries/use-users";
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
import type { Booking, BookingStatus } from "@/shared/types/api";
import { formatWhen } from "@/shared/utils/format";

export function BookingList() {
  const { user } = useAuth();
  const list = useListQueryState({ sortBy: "startTime", order: "desc" });
  const scope = list.params.get("scope") === "all" ? "all" : "mine";
  const status = list.params.get("status") ?? "all";
  const resourceId = list.params.get("resourceId") ?? "all";
  const searching = Boolean(list.search);
  const bookings = useBookingsQuery({
    page: searching ? 1 : list.page,
    limit: searching ? 100 : 20,
    status: status === "all" ? undefined : (status as BookingStatus),
    resourceId: resourceId === "all" ? undefined : resourceId,
    scope,
    sortBy: "startTime",
    order: "desc",
  });
  const resources = useResourcesQuery({ page: 1, limit: 100, sortBy: "name", order: "asc" });
  const users = useUsersQuery({ page: 1, limit: 100, sortBy: "name", order: "asc" });
  const cancel = useCancelBookingMutation();
  const [target, setTarget] = useState<Booking | null>(null);
  const resourceName = useMemo(() => Object.fromEntries((resources.data?.items ?? []).map((item) => [item.id, item.name])), [resources.data]);
  const userName = useMemo(() => Object.fromEntries((users.data?.items ?? []).map((item) => [item.id, item.name])), [users.data]);
  const rows = (bookings.data?.items ?? []).filter((row) => {
    if (!list.search) return true;
    const haystack = `${resourceName[row.resourceId] ?? ""} ${userName[row.userId] ?? ""} ${row.status}`.toLowerCase();
    return haystack.includes(list.search.toLowerCase());
  });

  const columns: Column<Booking>[] = [
    {
      key: "resource",
      header: "Resource",
      cell: (row) => <Link className="font-medium text-primary" to={`/bookings/${row.id}`}>{resourceName[row.resourceId] ?? "Resource"}</Link>,
    },
    { key: "who", header: "Who", cell: (row) => userName[row.userId] ?? "User" },
    {
      key: "when",
      header: "When",
      cell: (row) => (
        <div>
          <div>{formatWhen(row.startTime)}</div>
          <div className="text-xs text-muted-foreground">{formatWhen(row.endTime)}</div>
        </div>
      ),
    },
    { key: "status", header: "Status", cell: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      cell: (row) =>
        row.status === "ACTIVE" && row.userId === user?.id ? (
          <Button variant="destructive" size="sm" onClick={() => setTarget(row)}>Cancel</Button>
        ) : null,
    },
  ];

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="Schedule"
        title="Bookings"
        description="Your reservations, and every reservation in the system."
        actions={<Button asChild><Link to="/bookings/new">New booking</Link></Button>}
      />
      <div className="flex flex-wrap gap-2">
        <SearchInput value={list.draft} onChange={list.setDraft} placeholder="Search resource, person, or status" />
        <Select value={scope} onValueChange={(value) => list.patch({ scope: value === "mine" ? undefined : value, page: undefined })}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mine">Mine</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => list.patch({ status: value === "all" ? undefined : value, page: undefined })}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={resourceId} onValueChange={(value) => list.patch({ resourceId: value === "all" ? undefined : value, page: undefined })}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Resource" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All resources</SelectItem>
            {(resources.data?.items ?? []).map((resource) => (
              <SelectItem key={resource.id} value={resource.id}>{resource.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {bookings.isError ? <ErrorState error={bookings.error} onRetry={() => void bookings.refetch()} /> : null}
      <DataTable columns={columns} rows={rows} getRowId={(row) => row.id} isLoading={bookings.isLoading} emptyTitle="No bookings match these filters" />
      {searching ? null : <Pagination meta={bookings.data?.meta} onPage={list.setPage} />}
      <ConfirmDialog
        open={Boolean(target)}
        title="Cancel booking"
        description="The slot will open for someone else. This cannot be undone from the booking record."
        confirmLabel="Cancel booking"
        pending={cancel.isPending}
        onOpenChange={(open) => { if (!open) setTarget(null); }}
        onConfirm={() => { if (!target) return; cancel.mutate(target.id, { onSuccess: () => setTarget(null) }); }}
      />
    </div>
  );
}
