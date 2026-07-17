import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointments, employees, services } from "@/db/schema";
import { addMinutes, format, parse } from "date-fns";
import { and, eq, ne, sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { updateAppointmentSchema } from "@/lib/validators";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [appointment] = await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.id, id), eq(appointments.companyId, session.companyId)))
      .limit(1);

    if (!appointment) {
      return NextResponse.json({ error: "Agendamento nao encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: appointment });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[APPOINTMENTS/GET/ID]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const parsed = updateAppointmentSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [current] = await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.id, id), eq(appointments.companyId, session.companyId)))
      .limit(1);

    if (!current) {
      return NextResponse.json({ error: "Agendamento nao encontrado" }, { status: 404 });
    }

    const serviceId = parsed.data.serviceId || current.serviceId;
    const employeeId = parsed.data.employeeId || current.employeeId;
    const date = parsed.data.date || current.date;
    const startTime = parsed.data.startTime || current.startTime;
    let endTime = current.endTime;

    if (parsed.data.serviceId || parsed.data.startTime) {
      if (!serviceId) {
        return NextResponse.json({ error: "Servico nao encontrado" }, { status: 404 });
      }

      const [service] = await db
        .select({ duration: services.duration })
        .from(services)
        .where(and(eq(services.id, serviceId), eq(services.companyId, session.companyId)))
        .limit(1);

      if (!service) {
        return NextResponse.json({ error: "Servico nao encontrado" }, { status: 404 });
      }

      endTime = format(addMinutes(parse(startTime, "HH:mm", new Date()), service.duration), "HH:mm");
    }

    if (employeeId) {
      const [employee] = await db
        .select({ id: employees.id })
        .from(employees)
        .where(and(eq(employees.id, employeeId), eq(employees.companyId, session.companyId)))
        .limit(1);

      if (!employee) {
        return NextResponse.json({ error: "Profissional nao encontrado" }, { status: 404 });
      }

      const [conflict] = await db
        .select({ id: appointments.id })
        .from(appointments)
        .where(
          and(
            ne(appointments.id, id),
            eq(appointments.companyId, session.companyId),
            eq(appointments.employeeId, employeeId),
            eq(appointments.date, date),
            sql`${appointments.status} not in ('cancelled', 'no_show')`,
            sql`${appointments.startTime} < ${endTime}`,
            sql`${appointments.endTime} > ${startTime}`
          )
        )
        .limit(1);

      if (conflict) {
        return NextResponse.json({ error: "Horario indisponivel" }, { status: 409 });
      }
    }

    const [updated] = await db
      .update(appointments)
      .set({
        status: parsed.data.status,
        date,
        startTime,
        endTime,
        employeeId,
        serviceId,
        notes: parsed.data.notes,
        updatedAt: new Date(),
      })
      .where(and(eq(appointments.id, id), eq(appointments.companyId, session.companyId)))
      .returning();

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[APPOINTMENTS/PUT]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [deleted] = await db
      .delete(appointments)
      .where(and(eq(appointments.id, id), eq(appointments.companyId, session.companyId)))
      .returning({ id: appointments.id });

    if (!deleted) {
      return NextResponse.json({ error: "Agendamento nao encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Agendamento removido com sucesso" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[APPOINTMENTS/DELETE]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
