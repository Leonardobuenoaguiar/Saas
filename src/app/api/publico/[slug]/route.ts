import { NextResponse } from "next/server";
import { db } from "@/db";
import { companies, employeeServices, employees, services, workingHours } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { publicSlugSchema } from "@/lib/validators";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const parsed = publicSlugSchema.safeParse(await params);

    if (!parsed.success) {
      return NextResponse.json({ error: "Pagina invalida" }, { status: 400 });
    }

    const [company] = await db
      .select({
        id: companies.id,
        name: companies.name,
        slug: companies.slug,
        phone: companies.phone,
        email: companies.email,
        address: companies.address,
        city: companies.city,
        state: companies.state,
        description: companies.description,
        logoUrl: companies.logoUrl,
        businessType: companies.businessType,
      })
      .from(companies)
      .where(and(eq(companies.slug, parsed.data.slug), eq(companies.isActive, true)))
      .limit(1);

    if (!company) {
      return NextResponse.json({ error: "Empresa nao encontrada" }, { status: 404 });
    }

    const [serviceRows, employeeRows, hourRows] = await Promise.all([
      db
        .select()
        .from(services)
        .where(and(eq(services.companyId, company.id), eq(services.isActive, true)))
        .orderBy(services.name),
      db
        .select({
          id: employees.id,
          name: employees.name,
          role: employees.role,
          avatarUrl: employees.avatarUrl,
          serviceId: employeeServices.serviceId,
        })
        .from(employees)
        .leftJoin(employeeServices, eq(employeeServices.employeeId, employees.id))
        .where(and(eq(employees.companyId, company.id), eq(employees.isActive, true)))
        .orderBy(employees.name),
      db
        .select()
        .from(workingHours)
        .where(and(eq(workingHours.companyId, company.id), eq(workingHours.isActive, true)))
        .orderBy(workingHours.dayOfWeek, workingHours.startTime),
    ]);

    const employeeMap = new Map<string, { id: string; name: string; role: string | null; avatarUrl: string | null; serviceIds: string[] }>();

    for (const row of employeeRows) {
      const current = employeeMap.get(row.id) || {
        id: row.id,
        name: row.name,
        role: row.role,
        avatarUrl: row.avatarUrl,
        serviceIds: [],
      };

      if (row.serviceId) current.serviceIds.push(row.serviceId);
      employeeMap.set(row.id, current);
    }

    return NextResponse.json({
      data: {
        company,
        services: serviceRows,
        employees: Array.from(employeeMap.values()),
        workingHours: hourRows,
      },
    });
  } catch (error) {
    console.error("[PUBLIC/SLUG]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
