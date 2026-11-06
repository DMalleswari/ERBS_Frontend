import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/features/auth/services/auth-service";
import type {
  ChangePasswordValues,
  ForgotPasswordValues,
  LoginSubmitValues,
  RegisterValues,
  ResetPasswordValues,
} from "@/features/auth/schemas/auth-schema";
import { setToken } from "@/shared/api/token";
import { queryKeys } from "@/shared/constants/query-keys";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ remember: _remember, ...input }: LoginSubmitValues) => authService.login(input),
    onSuccess: (result, variables) => {
      setToken(result.token, variables.remember !== false);
      queryClient.setQueryData(queryKeys.auth.me, result.user);
      toast.success("Signed in");
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Pick<RegisterValues, "name" | "email" | "password">) => authService.register(input),
    onSuccess: (result) => {
      setToken(result.token, true);
      queryClient.setQueryData(queryKeys.auth.me, result.user);
      toast.success("Account created");
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (input: ChangePasswordValues) =>
      authService.changePassword({
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      }),
    onSuccess: (message) => toast.success(message),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (input: ForgotPasswordValues) => authService.forgotPassword(input),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (input: ResetPasswordValues) =>
      authService.resetPassword({
        token: input.token,
        newPassword: input.newPassword,
      }),
    onSuccess: (message) => toast.success(message),
  });
}
