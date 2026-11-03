import { getData } from "@/shared/api/client";
import type { DashboardSummary } from "@/shared/types/api";

export const dashboardService = {
  summary() {
    return getData<DashboardSummary>("/dashboard/summary");
  },
};
