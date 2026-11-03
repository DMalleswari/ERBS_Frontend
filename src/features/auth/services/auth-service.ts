import { getData, sendData, sendMessage } from "@/shared/api/client";
import type { AuthResult, User } from "@/shared/types/api";
import type { LoginValues } from "@/features/auth/schemas/auth-schema";

export const authService = {
  login(input: LoginValues) {
    return sendData<AuthResult>("/auth/login", input);
  },
  register(input: { name: string; email: string; password: string }) {
    return sendData<AuthResult>("/auth/register", input);
  },
  me() {
    return getData<User>("/auth/me");
  },
  changePassword(input: { currentPassword: string; newPassword: string }) {
    return sendMessage("/auth/change-password", input);
  },
  logout() {
    return sendMessage("/auth/logout");
  },
};
