import { useBookingsQuery } from "@/features/bookings/queries/use-bookings";
import { useDashboardQuery } from "@/features/dashboard/queries/use-dashboard";
import { useResourceTypesQuery } from "@/features/resource-types/queries/use-resource-types";
import { useResourcesQuery } from "@/features/resources/queries/use-resources";
import { useUsersQuery } from "@/features/users/queries/use-users";

export function useDashboardAnalytics() {
  const summary = useDashboardQuery();
  const bookings = useBookingsQuery({ page: 1, limit: 100, sortBy: "startTime", order: "desc", scope: "all" });
  const active = useBookingsQuery({ page: 1, limit: 1, status: "ACTIVE", scope: "all" });
  const cancelled = useBookingsQuery({ page: 1, limit: 1, status: "CANCELLED", scope: "all" });
  const resources = useResourcesQuery({ page: 1, limit: 100, sortBy: "name", order: "asc" });
  const types = useResourceTypesQuery({ page: 1, limit: 100, sortBy: "name", order: "asc" });
  const users = useUsersQuery({ page: 1, limit: 100, sortBy: "name", order: "asc" });

  return { summary, bookings, active, cancelled, resources, types, users };
}
