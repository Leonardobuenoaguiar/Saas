import { NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { createTransactionSchema, paginationSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const url = new URL(request.url);
    const params = paginationSchema.parse(Object.fromEntries(url.searchParams));
    const conditions = [eq(transactions.companyId, session.companyId)];

    if (params.search) {
      conditions.push(ilike(transactions.description, `%${params.search}%`));
    }
    if (params.status) {
      conditions.push(eq(transactions.status, params.status as "completed" | "pending" | "cancelled"));
    }

    const [data, countResult, totals] = await Promise.all([
      db
        .select()
        .from(transactions)
        .where(and(...conditions))
        .orderBy(desc(transactions.date))
        .limit(params.limit)
        .offset((params.page - 1) * params.limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(transactions)
        .where(and(...conditions)),
      db
        .select({
          income: sql<string>`coalesce(sum(case when ${transactions.type} = 'income' then ${transactions.amount} else 0 end), 0)`,
          expense: sql<string>`coalesce(sum(case when ${transactions.type} = 'expense' then ${transactions.amount} else 0 end), 0)`,
        })
        .from(transactions)
        .where(eq(transactions.companyId, session.companyId)),
    ]);

    const total = countResult[0]?.count || 0;

    return NextResponse.json({
      data,
      summary: {
        income: Number(totals[0]?.income || 0),
        expense: Number(totals[0]?.expense || 0),
        balance: Number(totals[0]?.income || 0) - Number(totals[0]?.expense || 0),
      },
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[FINANCE/GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const parsed = createTransactionSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [transaction] = await db
      .insert(transactions)
      .values({
        companyId: session.companyId,
        description: parsed.data.description,
        amount: String(parsed.data.amount),
        type: parsed.data.type,
        category: parsed.data.category || null,
        paymentMethod: parsed.data.paymentMethod || null,
        date: parsed.data.date,
        status: parsed.data.status,
      })
      .returning();

    return NextResponse.json({ data: transaction }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[FINANCE/POST]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
