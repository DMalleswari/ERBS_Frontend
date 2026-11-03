import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/features/dashboard/services/dashboard-service";
import { queryKeys } from "@/shared/constants/query-keys";

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn: () => dashboardService.summary(),
  });
}
