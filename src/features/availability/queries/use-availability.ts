import { useQuery } from "@tanstack/react-query";
import { availabilityService } from "@/features/availability/services/availability-service";
import { queryKeys } from "@/shared/constants/query-keys";

export function useAvailabilityQuery(resourceId: string, from: string, to: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.availability.lookup({ resourceId, from, to }),
    queryFn: () => availabilityService.lookup(resourceId, from, to),
    enabled,
  });
}
