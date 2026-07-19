import { NextResponse } from "next/server";
import { addMinutes, format, parse } from "date-fns";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { appointments, companies, employees, services } from "@/db/schema";
import { notifyBookingRequested } from "@/lib/integrations/booking-notifications";
import { createAppointmentSchema, publicSlugSchema } from "@/lib/validators";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const slug = publicSlugSchema.safeParse(await params);

    if (!slug.success) {
      return NextResponse.json({ error: "Pagina invalida" }, { status: 400 });
    }

    const parsed = createAppointmentSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (!parsed.data.clientName || !parsed.data.clientPhone) {
      return NextResponse.json(
        { error: "Nome e telefone do cliente sao obrigatorios" },
        { status: 400 }
      );
    }

    const [company] = await db
      .select({
        id: companies.id,
        name: companies.name,
        email: companies.email,
      })
      .from(companies)
      .where(and(eq(companies.slug, slug.data.slug), eq(companies.isActive, true)))
      .limit(1);

    if (!company) {
      return NextResponse.json({ error: "Empresa nao encontrada" }, { status: 404 });
    }

    const [service] = await db
      .select({
        id: services.id,
        name: services.name,
        duration: services.duration,
        price: services.price,
      })
      .from(services)
      .where(
        and(
          eq(services.id, parsed.data.serviceId),
          eq(services.companyId, company.id),
          eq(services.isActive, true)
        )
      )
      .limit(1);

    if (!service) {
      return NextResponse.json({ error: "Servico indisponivel" }, { status: 404 });
    }

    const [employee] = await db
      .select({
        id: employees.id,
        name: employees.name,
      })
      .from(employees)
      .where(
        and(
          eq(employees.id, parsed.data.employeeId),
          eq(employees.companyId, company.id),
          eq(employees.isActive, true)
        )
      )
      .limit(1);

    if (!employee) {
      return NextResponse.json({ error: "Profissional indisponivel" }, { status: 404 });
    }

    const start = parse(parsed.data.startTime, "HH:mm", new Date());
    const endTime = format(addMinutes(start, service.duration), "HH:mm");

    const [conflict] = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(
        and(
          eq(appointments.companyId, company.id),
          eq(appointments.employeeId, parsed.data.employeeId),
          eq(appointments.date, parsed.data.date),
          sql`${appointments.status} not in ('cancelled', 'no_show')`,
          sql`${appointments.startTime} < ${endTime}`,
          sql`${appointments.endTime} > ${parsed.data.startTime}`
        )
      )
      .limit(1);

    if (conflict) {
      return NextResponse.json({ error: "Horario indisponivel" }, { status: 409 });
    }

    const [appointment] = await db
      .insert(appointments)
      .values({
        companyId: company.id,
        employeeId: parsed.data.employeeId,
        serviceId: parsed.data.serviceId,
        date: parsed.data.date,
        startTime: parsed.data.startTime,
        endTime,
        price: service.price,
        status: "pending",
        notes: parsed.data.notes || null,
        clientName: parsed.data.clientName,
        clientPhone: parsed.data.clientPhone,
        clientEmail: parsed.data.clientEmail || null,
      })
      .returning({
        id: appointments.id,
        date: appointments.date,
        startTime: appointments.startTime,
        endTime: appointments.endTime,
        status: appointments.status,
      });

    void notifyBookingRequested({
      appointmentId: appointment.id,
      companyId: company.id,
      companyName: company.name,
      companyEmail: company.email,
      clientName: parsed.data.clientName,
      clientPhone: parsed.data.clientPhone,
      clientEmail: parsed.data.clientEmail || null,
      serviceName: service.name,
      employeeName: employee.name,
      date: appointment.date,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
    }).catch((notificationError) => {
      console.error("[PUBLIC/BOOKING/NOTIFICATIONS]", notificationError);
    });

    return NextResponse.json({ data: appointment }, { status: 201 });
  } catch (error) {
    console.error("[PUBLIC/BOOKING]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
