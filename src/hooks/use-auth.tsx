"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { apiGet, apiPost, type ApiResponse } from "@/lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatarUrl?: string;
  companyId: string;
  companyName: string;
  companySlug: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ApiResponse>;
  register: (data: Record<string, string>) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

// ─── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await apiGet<AuthUser>("/api/auth/me");
      if (res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string): Promise<ApiResponse> => {
      const res = await apiPost("/api/auth/login", { email, password });
      if (res.data) {
        await refresh();
      }
      return res;
    },
    [refresh]
  );

  const register = useCallback(
    async (data: Record<string, string>): Promise<ApiResponse> => {
      const res = await apiPost("/api/auth/cadastro", data);
      if (res.data) {
        await refresh();
      }
      return res;
    },
    [refresh]
  );

  const logout = useCallback(async () => {
    await apiPost("/api/auth/logout");
    setUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
