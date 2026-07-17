import { NextResponse } from "next/server";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq, and, ilike, or, sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { createClientSchema, paginationSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const url = new URL(request.url);
    const params = paginationSchema.parse(Object.fromEntries(url.searchParams));

    const conditions = [eq(clients.companyId, session.companyId)];

    if (params.search) {
      conditions.push(
        or(
          ilike(clients.name, `%${params.search}%`),
          ilike(clients.email, `%${params.search}%`),
          ilike(clients.phone, `%${params.search}%`)
        )!
      );
    }
    if (params.status) {
      conditions.push(eq(clients.isActive, params.status === "active"));
    }

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(clients)
        .where(and(...conditions))
        .orderBy(clients.name)
        .limit(params.limit)
        .offset((params.page - 1) * params.limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(clients)
        .where(and(...conditions)),
    ]);

    const total = countResult[0]?.count || 0;

    return NextResponse.json({
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    console.error("[CLIENTS/GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const parsed = createClientSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [client] = await db
      .insert(clients)
      .values({
        companyId: session.companyId,
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        birthDate: parsed.data.birthDate || null,
        notes: parsed.data.notes || null,
        isActive: parsed.data.isActive,
      })
      .returning();

    return NextResponse.json({ data: client }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    console.error("[CLIENTS/POST]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
