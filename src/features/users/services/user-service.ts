import { api, getData, getPage, sendData } from "@/shared/api/client";
import type { ListParams, User } from "@/shared/types/api";
import type { CreateUserValues, UpdateUserValues } from "@/features/users/schemas/user-schema";

export const userService = {
  list(params: ListParams) {
    return getPage<User>("/users", params);
  },
  get(id: string) {
    return getData<User>(`/users/${id}`);
  },
  create(input: CreateUserValues) {
    return sendData<User>("/users", input);
  },
  update(id: string, input: UpdateUserValues) {
    return sendData<User>(`/users/${id}`, input, "patch");
  },
  remove(id: string) {
    return api.delete(`/users/${id}`);
  },
};
