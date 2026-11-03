import { getPage } from "@/shared/api/client";
import type { AuditAction, AuditLog, ListParams } from "@/shared/types/api";

export type AuditListParams = ListParams & {
  action?: AuditAction;
  entity?: string;
};

export const auditLogService = {
  list(params: AuditListParams) {
    return getPage<AuditLog>("/audit-logs", params);
  },
};
