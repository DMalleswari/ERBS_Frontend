import { useQuery } from "@tanstack/react-query";
import { userService } from "@/features/users/services/user-service";
import { queryKeys } from "@/shared/constants/query-keys";
import type { ListParams } from "@/shared/types/api";

export function useUsersQuery(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => userService.list(params),
  });
}

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.get(id),
    enabled: Boolean(id),
  });
}
