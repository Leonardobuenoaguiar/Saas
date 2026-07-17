import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

// ─── API Client ─────────────────────────────────────────────────────────────

const BASE_URL = "";

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    if (!response.ok) {
      return { error: `Erro ${response.status}: ${response.statusText}` };
    }
    return { data: undefined as unknown as T };
  }

  const json = await response.json();

  if (!response.ok) {
    return {
      error: json.error || `Erro ${response.status}`,
      errors: json.errors,
    };
  }

  return json;
}

// ─── HTTP Methods ───────────────────────────────────────────────────────────

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<ApiResponse<T>> {
  const url = buildUrl(path, params);
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<T>(response);
}

export async function apiPost<T>(
  path: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function apiPut<T>(
  path: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  const response = await fetch(buildUrl(path), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(buildUrl(path), {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<T>(response);
}
