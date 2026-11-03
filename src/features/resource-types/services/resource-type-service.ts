import { api, getData, getPage, sendData } from "@/shared/api/client";
import type { ListParams, ResourceType } from "@/shared/types/api";
import type { ResourceTypeValues } from "@/features/resource-types/schemas/resource-type-schema";

export type ResourceTypeListParams = ListParams & { isActive?: "true" | "false" };

function toPayload(input: ResourceTypeValues, mode: "create" | "edit") {
  return {
    code: input.code,
    name: input.name,
    description: input.description?.trim() ? input.description.trim() : mode === "edit" ? null : undefined,
    isActive: input.isActive,
  };
}

export const resourceTypeService = {
  list(params: ResourceTypeListParams) {
    return getPage<ResourceType>("/resource-types", params);
  },
  get(id: string) {
    return getData<ResourceType>(`/resource-types/${id}`);
  },
  create(input: ResourceTypeValues) {
    return sendData<ResourceType>("/resource-types", toPayload(input, "create"));
  },
  update(id: string, input: ResourceTypeValues) {
    return sendData<ResourceType>(`/resource-types/${id}`, toPayload(input, "edit"), "patch");
  },
  remove(id: string) {
    return api.delete(`/resource-types/${id}`);
  },
};
