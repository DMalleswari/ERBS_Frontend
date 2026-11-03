import { useQuery } from "@tanstack/react-query";
import { resourceTypeService, type ResourceTypeListParams } from "@/features/resource-types/services/resource-type-service";
import { queryKeys } from "@/shared/constants/query-keys";

export function useResourceTypesQuery(params: ResourceTypeListParams) {
  return useQuery({
    queryKey: queryKeys.resourceTypes.list(params),
    queryFn: () => resourceTypeService.list(params),
  });
}

export function useResourceTypeQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.resourceTypes.detail(id),
    queryFn: () => resourceTypeService.get(id),
    enabled: Boolean(id),
  });
}
