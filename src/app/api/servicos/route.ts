import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, and, ilike, sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { createServiceSchema, paginationSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const url = new URL(request.url);
    const params = paginationSchema.parse(Object.fromEntries(url.searchParams));

    const conditions = [eq(services.companyId, session.companyId)];

    if (params.search) {
      conditions.push(ilike(services.name, `%${params.search}%`));
    }
    if (params.status) {
      conditions.push(
        eq(services.isActive, params.status === "active")
      );
    }

    const [data, countResult] = await Promise.all([
      db
        .select()
        .from(services)
        .where(and(...conditions))
        .orderBy(services.name)
        .limit(params.limit)
        .offset((params.page - 1) * params.limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(services)
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
    console.error("[SERVICES/GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const parsed = createServiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [service] = await db
      .insert(services)
      .values({
        companyId: session.companyId,
        name: parsed.data.name,
        description: parsed.data.description || null,
        duration: parsed.data.duration,
        price: String(parsed.data.price),
        category: parsed.data.category || null,
        color: parsed.data.color || "#7c3aed",
        isActive: parsed.data.isActive,
      })
      .returning();

    return NextResponse.json({ data: service }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    console.error("[SERVICES/POST]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
