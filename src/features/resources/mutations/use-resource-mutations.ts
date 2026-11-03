import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ResourceValues } from "@/features/resources/schemas/resource-schema";
import { resourceService } from "@/features/resources/services/resource-service";
import { queryKeys } from "@/shared/constants/query-keys";

export function useCreateResourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resourceService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.resources.all });
      toast.success("Resource created");
    },
  });
}

export function useUpdateResourceMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ResourceValues) => resourceService.update(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.resources.all });
      toast.success("Resource updated");
    },
  });
}

export function useDeleteResourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resourceService.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.resources.all });
      toast.success("Resource deleted");
    },
  });
}
