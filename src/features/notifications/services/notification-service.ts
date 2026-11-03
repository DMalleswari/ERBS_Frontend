import { getPage, sendData, sendMessage } from "@/shared/api/client";
import type { ListParams, Notification } from "@/shared/types/api";

export type NotificationListParams = ListParams & { isRead?: "true" | "false" };

export const notificationService = {
  list(params: NotificationListParams) {
    return getPage<Notification>("/notifications", params);
  },
  markRead(id: string) {
    return sendData<Notification>(`/notifications/${id}/read`, undefined, "patch");
  },
  markAllRead() {
    return sendMessage("/notifications/read-all");
  },
};
