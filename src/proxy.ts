import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { verifyToken } from "@/lib/session-token";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/cadastro", "/esqueci-senha"];
const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const AUTH_RATE_LIMIT_WINDOW_MS = 60_000;
const AUTH_RATE_LIMIT_MAX = 12;

const authAttempts = new Map<string, { count: number; resetAt: number }>();

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  if (pathname.startsWith("/api/") && UNSAFE_METHODS.has(request.method)) {
    const originResponse = validateSameOrigin(request);
    if (originResponse) return withSecurityHeaders(originResponse);
  }

  if (isAuthApiRoute(pathname) && request.method === "POST") {
    const rateLimitResponse = checkAuthRateLimit(request);
    if (rateLimitResponse) return withSecurityHeaders(rateLimitResponse);
  }

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return withSecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (isAuthRoute && session) {
    return withSecurityHeaders(NextResponse.redirect(new URL("/dashboard", request.url)));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/cadastro",
    "/esqueci-senha",
    "/api/:path*",
  ],
};

function isAuthApiRoute(pathname: string) {
  return pathname === "/api/auth/login" || pathname === "/api/auth/cadastro";
}

function checkAuthRateLimit(request: NextRequest) {
  const key = getClientIp(request);
  const now = Date.now();
  const current = authAttempts.get(key);

  if (!current || current.resetAt <= now) {
    authAttempts.set(key, { count: 1, resetAt: now + AUTH_RATE_LIMIT_WINDOW_MS });
    return null;
  }

  current.count += 1;
  authAttempts.set(key, current);

  if (current.count > AUTH_RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde um minuto e tente novamente." },
      { status: 429 }
    );
  }

  return null;
}

function validateSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  if (origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Origem da requisicao nao permitida" }, { status: 403 });
  }

  return null;
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
}
