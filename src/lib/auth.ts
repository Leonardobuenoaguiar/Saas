import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { companies, users } from "@/db/schema";
import {
  AUTH_COOKIE_MAX_AGE,
  AUTH_COOKIE_NAME,
  BCRYPT_SALT_ROUNDS,
} from "@/lib/constants";
import { createToken, verifyToken, type SessionPayload } from "@/lib/session-token";

export type { SessionPayload } from "@/lib/session-token";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await createToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const [activeSession] = await db
    .select({ id: users.id })
    .from(users)
    .innerJoin(companies, eq(users.companyId, companies.id))
    .where(
      and(
        eq(users.id, session.userId),
        eq(users.companyId, session.companyId),
        eq(users.isActive, true),
        eq(companies.isActive, true)
      )
    )
    .limit(1);

  if (!activeSession) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        phone: users.phone,
        avatarUrl: users.avatarUrl,
        companyId: users.companyId,
        companyName: companies.name,
        companySlug: companies.slug,
      })
      .from(users)
      .innerJoin(companies, eq(users.companyId, companies.id))
      .where(
        and(
          eq(users.id, session.userId),
          eq(users.companyId, session.companyId),
          eq(users.isActive, true),
          eq(companies.isActive, true)
        )
      )
      .limit(1);

    return user[0] || null;
  } catch {
    return null;
  }
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
