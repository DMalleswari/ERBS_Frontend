import { useQuery } from "@tanstack/react-query";
import { notificationService, type NotificationListParams } from "@/features/notifications/services/notification-service";
import { queryKeys } from "@/shared/constants/query-keys";

export function useNotificationsQuery(params: NotificationListParams) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => notificationService.list(params),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unread,
    queryFn: () => notificationService.list({ isRead: "false", page: 1, limit: 1 }),
    select: (result) => result.meta.total,
  });
}
