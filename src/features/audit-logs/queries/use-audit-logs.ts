import { useQuery } from "@tanstack/react-query";
import { auditLogService, type AuditListParams } from "@/features/audit-logs/services/audit-log-service";
import { queryKeys } from "@/shared/constants/query-keys";

export function useAuditLogsQuery(params: AuditListParams) {
  return useQuery({
    queryKey: queryKeys.auditLogs.list(params),
    queryFn: () => auditLogService.list(params),
  });
}
