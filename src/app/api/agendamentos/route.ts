import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointments, clients, employees, services } from "@/db/schema";
import { addMinutes, format, parse } from "date-fns";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { createAppointmentSchema, paginationSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const url = new URL(request.url);
    const params = paginationSchema.parse(Object.fromEntries(url.searchParams));
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const conditions = [eq(appointments.companyId, session.companyId)];

    if (params.status) {
      conditions.push(eq(appointments.status, params.status as "pending" | "confirmed" | "completed" | "cancelled" | "no_show"));
    }
    if (from) conditions.push(gte(appointments.date, from));
    if (to) conditions.push(lte(appointments.date, to));

    const [data, countResult] = await Promise.all([
      db
        .select({
          id: appointments.id,
          clientId: appointments.clientId,
          employeeId: appointments.employeeId,
          serviceId: appointments.serviceId,
          date: appointments.date,
          startTime: appointments.startTime,
          endTime: appointments.endTime,
          price: appointments.price,
          status: appointments.status,
          notes: appointments.notes,
          clientName: sql<string>`coalesce(${clients.name}, ${appointments.clientName})`,
          clientPhone: sql<string>`coalesce(${clients.phone}, ${appointments.clientPhone})`,
          serviceName: services.name,
          serviceColor: services.color,
          employeeName: employees.name,
        })
        .from(appointments)
        .leftJoin(clients, eq(appointments.clientId, clients.id))
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .leftJoin(employees, eq(appointments.employeeId, employees.id))
        .where(and(...conditions))
        .orderBy(desc(appointments.date), appointments.startTime)
        .limit(params.limit)
        .offset((params.page - 1) * params.limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(appointments)
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
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[APPOINTMENTS/GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const parsed = createAppointmentSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const [service] = await db
      .select({ id: services.id, duration: services.duration, price: services.price })
      .from(services)
      .where(and(eq(services.id, parsed.data.serviceId), eq(services.companyId, session.companyId)))
      .limit(1);

    if (!service) {
      return NextResponse.json({ error: "Servico nao encontrado" }, { status: 404 });
    }

    const [employee] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(and(eq(employees.id, parsed.data.employeeId), eq(employees.companyId, session.companyId)))
      .limit(1);

    if (!employee) {
      return NextResponse.json({ error: "Profissional nao encontrado" }, { status: 404 });
    }

    if (parsed.data.clientId) {
      const [client] = await db
        .select({ id: clients.id })
        .from(clients)
        .where(and(eq(clients.id, parsed.data.clientId), eq(clients.companyId, session.companyId)))
        .limit(1);

      if (!client) {
        return NextResponse.json({ error: "Cliente nao encontrado" }, { status: 404 });
      }
    }

    const start = parse(parsed.data.startTime, "HH:mm", new Date());
    const endTime = format(addMinutes(start, service.duration), "HH:mm");
    const conflict = await findAppointmentConflict(
      session.companyId,
      parsed.data.employeeId,
      parsed.data.date,
      parsed.data.startTime,
      endTime
    );

    if (conflict) {
      return NextResponse.json({ error: "Horario indisponivel" }, { status: 409 });
    }

    const [appointment] = await db
      .insert(appointments)
      .values({
        companyId: session.companyId,
        clientId: parsed.data.clientId || null,
        employeeId: parsed.data.employeeId,
        serviceId: parsed.data.serviceId,
        date: parsed.data.date,
        startTime: parsed.data.startTime,
        endTime,
        price: service.price,
        status: "confirmed",
        notes: parsed.data.notes || null,
        clientName: parsed.data.clientName || null,
        clientPhone: parsed.data.clientPhone || null,
        clientEmail: parsed.data.clientEmail || null,
      })
      .returning();

    return NextResponse.json({ data: appointment }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[APPOINTMENTS/POST]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

async function findAppointmentConflict(
  companyId: string,
  employeeId: string,
  date: string,
  startTime: string,
  endTime: string
) {
  const [conflict] = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.companyId, companyId),
        eq(appointments.employeeId, employeeId),
        eq(appointments.date, date),
        sql`${appointments.status} not in ('cancelled', 'no_show')`,
        sql`${appointments.startTime} < ${endTime}`,
        sql`${appointments.endTime} > ${startTime}`
      )
    )
    .limit(1);

  return conflict;
}
