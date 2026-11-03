import { api, getData, getPage, sendData } from "@/shared/api/client";
import type { ListParams, Resource } from "@/shared/types/api";
import type { ResourceValues } from "@/features/resources/schemas/resource-schema";

export type ResourceListParams = ListParams & {
  resourceTypeId?: string;
  location?: string;
  isActive?: "true" | "false";
};

function toPayload(input: ResourceValues, mode: "create" | "edit") {
  return {
    name: input.name,
    description: input.description?.trim() ? input.description.trim() : mode === "edit" ? null : undefined,
    resourceTypeId: input.resourceTypeId,
    capacity: input.capacity,
    location: input.location,
    isActive: input.isActive,
  };
}

export const resourceService = {
  list(params: ResourceListParams) {
    return getPage<Resource>("/resources", params);
  },
  get(id: string) {
    return getData<Resource>(`/resources/${id}`);
  },
  create(input: ResourceValues) {
    return sendData<Resource>("/resources", toPayload(input, "create"));
  },
  update(id: string, input: ResourceValues) {
    return sendData<Resource>(`/resources/${id}`, toPayload(input, "edit"), "patch");
  },
  remove(id: string) {
    return api.delete(`/resources/${id}`);
  },
};
