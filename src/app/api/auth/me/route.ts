import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser, getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validators";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("[AUTH/ME]", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

    const parsed = updateProfileSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [currentUser] = await db
      .select({
        id: users.id,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario nao encontrado" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.email !== undefined) updateData.email = parsed.data.email;
    if (parsed.data.phone !== undefined) updateData.phone = parsed.data.phone || null;

    if (parsed.data.newPassword) {
      const isValidPassword = await verifyPassword(
        parsed.data.currentPassword || "",
        currentUser.passwordHash
      );

      if (!isValidPassword) {
        return NextResponse.json({ error: "Senha atual incorreta" }, { status: 403 });
      }

      updateData.passwordHash = await hashPassword(parsed.data.newPassword);
    }

    await db.update(users).set(updateData).where(eq(users.id, session.userId));

    const user = await getCurrentUser();
    return NextResponse.json({ data: user, message: "Perfil atualizado" });
  } catch (error) {
    console.error("[AUTH/ME/PUT]", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
