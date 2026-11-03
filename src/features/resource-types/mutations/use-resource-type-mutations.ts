import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resourceTypeService } from "@/features/resource-types/services/resource-type-service";
import type { ResourceTypeValues } from "@/features/resource-types/schemas/resource-type-schema";
import { queryKeys } from "@/shared/constants/query-keys";

export function useCreateResourceTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resourceTypeService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.resourceTypes.all });
      toast.success("Resource type created");
    },
  });
}

export function useUpdateResourceTypeMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ResourceTypeValues) => resourceTypeService.update(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.resourceTypes.all });
      toast.success("Resource type updated");
    },
  });
}

export function useDeleteResourceTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resourceTypeService.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.resourceTypes.all });
      toast.success("Resource type deleted");
    },
  });
}
