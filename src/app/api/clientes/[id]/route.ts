import { NextResponse } from "next/server";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { updateClientSchema } from "@/lib/validators";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [client] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), eq(clients.companyId, session.companyId)))
      .limit(1);

    if (!client) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: client });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    console.error("[CLIENTS/GET/ID]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateClientSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.email !== undefined) updateData.email = parsed.data.email || null;
    if (parsed.data.phone !== undefined) updateData.phone = parsed.data.phone || null;
    if (parsed.data.birthDate !== undefined) updateData.birthDate = parsed.data.birthDate || null;
    if (parsed.data.notes !== undefined) updateData.notes = parsed.data.notes || null;
    if (parsed.data.isActive !== undefined) updateData.isActive = parsed.data.isActive;

    const [updated] = await db
      .update(clients)
      .set(updateData)
      .where(and(eq(clients.id, id), eq(clients.companyId, session.companyId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    console.error("[CLIENTS/PUT]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [deleted] = await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.companyId, session.companyId)))
      .returning({ id: clients.id });

    if (!deleted) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    console.error("[CLIENTS/DELETE]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
