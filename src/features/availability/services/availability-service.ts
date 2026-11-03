import { getData } from "@/shared/api/client";
import type { Availability } from "@/shared/types/api";

export const availabilityService = {
  lookup(resourceId: string, from: string, to: string) {
    return getData<Availability>(`/availability/resource/${resourceId}`, { from, to });
  },
};
