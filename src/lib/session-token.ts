import { SignJWT, jwtVerify } from "jose";

export interface SessionPayload {
  userId: string;
  companyId: string;
  email: string;
  role: string;
}

export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is required in production");
    }

    return new TextEncoder().encode("flowbook-dev-secret-change-in-production");
  }

  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }

  return new TextEncoder().encode(secret);
}

export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const candidate = payload as unknown as Partial<SessionPayload>;

    if (!candidate.userId || !candidate.companyId || !candidate.email || !candidate.role) {
      return null;
    }

    return candidate as SessionPayload;
  } catch {
    return null;
  }
}
