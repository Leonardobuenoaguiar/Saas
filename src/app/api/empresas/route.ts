import { NextResponse } from "next/server";
import { db } from "@/db";
import { companies, workingHours } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { updateCompanySchema, workingHoursSchema } from "@/lib/validators";
import { z } from "zod";

const workingHoursPayload = z.object({
  workingHours: z.array(workingHoursSchema).max(70),
});

export async function GET() {
  try {
    const session = await requireAuth();

    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, session.companyId))
      .limit(1);

    if (!company) {
      return NextResponse.json({ error: "Empresa nao encontrada" }, { status: 404 });
    }

    const hours = await db
      .select()
      .from(workingHours)
      .where(eq(workingHours.companyId, session.companyId))
      .orderBy(workingHours.dayOfWeek, workingHours.startTime);

    return NextResponse.json({ data: { ...company, workingHours: hours } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[COMPANIES/GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const parsed = updateCompanySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (parsed.data.slug) {
      const existing = await db
        .select({ id: companies.id })
        .from(companies)
        .where(and(eq(companies.slug, parsed.data.slug)))
        .limit(1);

      if (existing[0] && existing[0].id !== session.companyId) {
        return NextResponse.json({ error: "Slug ja esta em uso" }, { status: 409 });
      }
    }

    const [company] = await db
      .update(companies)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(companies.id, session.companyId))
      .returning();

    return NextResponse.json({ data: company });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[COMPANIES/PUT]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const parsed = workingHoursPayload.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await db.delete(workingHours).where(eq(workingHours.companyId, session.companyId));

    if (parsed.data.workingHours.length > 0) {
      await db.insert(workingHours).values(
        parsed.data.workingHours.map((hour) => ({
          companyId: session.companyId,
          employeeId: hour.employeeId || null,
          dayOfWeek: hour.dayOfWeek,
          startTime: hour.startTime,
          endTime: hour.endTime,
          isActive: hour.isActive,
        }))
      );
    }

    return NextResponse.json({ message: "Horarios atualizados" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[COMPANIES/HOURS]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
