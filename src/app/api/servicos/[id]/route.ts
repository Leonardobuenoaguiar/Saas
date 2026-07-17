import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { updateServiceSchema } from "@/lib/validators";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [service] = await db
      .select()
      .from(services)
      .where(and(eq(services.id, id), eq(services.companyId, session.companyId)))
      .limit(1);

    if (!service) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: service });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    console.error("[SERVICES/GET/ID]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const parsed = updateServiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
    if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
    if (parsed.data.duration !== undefined) updateData.duration = parsed.data.duration;
    if (parsed.data.price !== undefined) updateData.price = String(parsed.data.price);
    if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
    if (parsed.data.color !== undefined) updateData.color = parsed.data.color;
    if (parsed.data.isActive !== undefined) updateData.isActive = parsed.data.isActive;

    const [updated] = await db
      .update(services)
      .set(updateData)
      .where(and(eq(services.id, id), eq(services.companyId, session.companyId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    console.error("[SERVICES/PUT]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [deleted] = await db
      .delete(services)
      .where(and(eq(services.id, id), eq(services.companyId, session.companyId)))
      .returning({ id: services.id });

    if (!deleted) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Serviço removido com sucesso" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    console.error("[SERVICES/DELETE]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
