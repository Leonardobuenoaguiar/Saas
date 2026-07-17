import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { updateTransactionSchema } from "@/lib/validators";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [transaction] = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.companyId, session.companyId)))
      .limit(1);

    if (!transaction) {
      return NextResponse.json({ error: "Transacao nao encontrada" }, { status: 404 });
    }

    return NextResponse.json({ data: transaction });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[FINANCE/GET/ID]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const parsed = updateTransactionSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(transactions)
      .set({
        description: parsed.data.description,
        amount: parsed.data.amount !== undefined ? String(parsed.data.amount) : undefined,
        type: parsed.data.type,
        category: parsed.data.category,
        paymentMethod: parsed.data.paymentMethod,
        date: parsed.data.date,
        status: parsed.data.status,
        updatedAt: new Date(),
      })
      .where(and(eq(transactions.id, id), eq(transactions.companyId, session.companyId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Transacao nao encontrada" }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[FINANCE/PUT]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [deleted] = await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.companyId, session.companyId)))
      .returning({ id: transactions.id });

    if (!deleted) {
      return NextResponse.json({ error: "Transacao nao encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transacao removida com sucesso" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[FINANCE/DELETE]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
