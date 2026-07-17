"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { apiGet, apiPost, apiPut, apiDelete, type ApiResponse } from "@/lib/api";

// ─── Types ──────────────────────────────────────────────────────────────────

interface UseApiOptions {
  /** Fetch data immediately on mount */
  immediate?: boolean;
  /** Query parameters */
  params?: Record<string, string | number | undefined>;
}

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  pagination: ApiResponse["pagination"] | null;
  refetch: (newParams?: Record<string, string | number | undefined>) => Promise<void>;
  mutate: (data: T | null) => void;
}

// ─── Hook: GET data ─────────────────────────────────────────────────────────

export function useApiGet<T>(
  path: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { immediate = true, params } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ApiResponse["pagination"] | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(
    async (newParams?: Record<string, string | number | undefined>) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await apiGet<T>(path, newParams || params);
        if (!mountedRef.current) return;

        if (res.error) {
          setError(res.error);
          setData(null);
        } else {
          setData(res.data || null);
          setPagination(res.pagination || null);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError("Erro ao carregar dados");
        }
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [path, params]
  );

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) {
      const timeoutId = window.setTimeout(() => {
        void fetchData();
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
        mountedRef.current = false;
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [immediate, fetchData]);

  return {
    data,
    isLoading,
    error,
    pagination,
    refetch: fetchData,
    mutate: setData,
  };
}

// ─── Hook: Mutations (POST/PUT/DELETE) ──────────────────────────────────────

interface UseMutationReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  errors: Record<string, string[]> | null;
  execute: (body?: unknown) => Promise<ApiResponse<T>>;
  reset: () => void;
}

export function useApiPost<T>(path: string): UseMutationReturn<T> {
  return useMutation<T>((body) => apiPost<T>(path, body));
}

export function useApiPut<T>(path: string): UseMutationReturn<T> {
  return useMutation<T>((body) => apiPut<T>(path, body));
}

export function useApiDelete<T>(path: string): UseMutationReturn<T> {
  return useMutation<T>(() => apiDelete<T>(path));
}

function useMutation<T>(
  mutationFn: (body?: unknown) => Promise<ApiResponse<T>>
): UseMutationReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const execute = useCallback(
    async (body?: unknown): Promise<ApiResponse<T>> => {
      setIsLoading(true);
      setError(null);
      setErrors(null);

      try {
        const res = await mutationFn(body);
        if (res.error) {
          setError(res.error);
          setErrors(res.errors || null);
        } else {
          setData(res.data || null);
        }
        return res;
      } catch {
        const errorRes: ApiResponse<T> = { error: "Erro na operação" };
        setError("Erro na operação");
        return errorRes;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setErrors(null);
  }, []);

  return { data, isLoading, error, errors, execute, reset };
}
