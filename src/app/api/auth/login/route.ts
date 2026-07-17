import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/lib/validators";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Find user by email
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role,
        companyId: users.companyId,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = result[0];

    if (!user) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Conta desativada. Entre em contato com o suporte." },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Create session
    await createSession({
      userId: user.id,
      companyId: user.companyId,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Login realizado com sucesso",
    });
  } catch (error) {
    console.error("[AUTH/LOGIN]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
