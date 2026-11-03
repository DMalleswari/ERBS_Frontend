import { Bell } from "lucide-react";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/features/notifications/mutations/use-notification-mutations";
import { useNotificationsQuery } from "@/features/notifications/queries/use-notifications";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { PageHeader } from "@/shared/components/page-header";
import { Pagination } from "@/shared/components/pagination";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useListQueryState } from "@/shared/hooks/use-list-query-state";
import { formatWhen } from "@/shared/utils/format";
import { cn } from "@/shared/utils/cn";

export function NotificationList() {
  const list = useListQueryState();
  const filter = list.params.get("read") ?? "all";
  const notifications = useNotificationsQuery({
    page: list.page,
    limit: 20,
    order: "desc",
    isRead: filter === "all" ? undefined : (filter as "true" | "false"),
  });
  const markRead = useMarkNotificationReadMutation();
  const markAll = useMarkAllNotificationsReadMutation();

  return (
    <div className="grid gap-4">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Stay on top of booking and account updates."
        actions={
          <Button variant="outline" disabled={markAll.isPending} onClick={() => markAll.mutate()}>
            Mark all read
          </Button>
        }
      />
      <Select value={filter} onValueChange={(value) => list.patch({ read: value === "all" ? undefined : value, page: undefined })}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="false">Unread</SelectItem>
          <SelectItem value="true">Read</SelectItem>
        </SelectContent>
      </Select>
      {notifications.isLoading ? <Skeleton className="h-40 w-full" /> : null}
      {notifications.isError ? <ErrorState error={notifications.error} onRetry={() => void notifications.refetch()} /> : null}
      {notifications.data && notifications.data.items.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up." />
      ) : null}
      <ul className="grid gap-2">
        {(notifications.data?.items ?? []).map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex items-start justify-between gap-4 rounded-xl border bg-card p-4 shadow-[0_1px_2px_rgba(28,25,23,0.04)]",
              !item.isRead && "border-l-4 border-l-primary bg-primary/[0.03]",
            )}
          >
            <div className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                  item.isRead ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
                )}
              >
                <Bell className="h-4 w-4" />
              </span>
              <div>
                <p className={cn("font-medium", !item.isRead && "text-foreground")}>{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatWhen(item.createdAt)}</p>
              </div>
            </div>
            {item.isRead ? null : (
              <Button variant="outline" size="sm" disabled={markRead.isPending} onClick={() => markRead.mutate(item.id)}>
                Mark read
              </Button>
            )}
          </li>
        ))}
      </ul>
      <Pagination meta={notifications.data?.meta} onPage={list.setPage} />
    </div>
  );
}
