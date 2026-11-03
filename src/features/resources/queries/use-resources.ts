import { useQuery } from "@tanstack/react-query";
import { resourceService, type ResourceListParams } from "@/features/resources/services/resource-service";
import { queryKeys } from "@/shared/constants/query-keys";

export function useResourcesQuery(params: ResourceListParams) {
  return useQuery({
    queryKey: queryKeys.resources.list(params),
    queryFn: () => resourceService.list(params),
  });
}

export function useResourceQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.resources.detail(id),
    queryFn: () => resourceService.get(id),
    enabled: Boolean(id),
  });
}

export function useResourceOptions() {
  return useResourcesQuery({ page: 1, limit: 100, isActive: "true", sortBy: "name", order: "asc" });
}
