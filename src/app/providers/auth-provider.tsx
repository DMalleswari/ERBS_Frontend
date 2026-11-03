import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "@/features/auth/services/auth-service";
import { clearToken, getToken } from "@/shared/api/token";
import { queryKeys } from "@/shared/constants/query-keys";
import type { User } from "@/shared/types/api";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(() => getToken());

  useEffect(() => {
    const sync = () => setTokenState(getToken());
    window.addEventListener("erbs:token", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("erbs:token", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const currentUser = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authService.me(),
    enabled: Boolean(token),
    retry: false,
  });

  useEffect(() => {
    if (currentUser.isError) clearToken();
  }, [currentUser.isError]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user: currentUser.data ?? null,
      isLoading: Boolean(token) && currentUser.isLoading,
      async logout() {
        try {
          await authService.logout();
        } finally {
          clearToken();
          queryClient.clear();
        }
      },
    }),
    [token, currentUser.data, currentUser.isLoading, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
