import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees, employeeServices, services } from "@/db/schema";
import { eq, and, ilike, sql } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { createEmployeeSchema, paginationSchema } from "@/lib/validators";

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const url = new URL(request.url);
    const params = paginationSchema.parse(Object.fromEntries(url.searchParams));

    const conditions = [eq(employees.companyId, session.companyId)];

    if (params.search) {
      conditions.push(ilike(employees.name, `%${params.search}%`));
    }
    if (params.status) {
      conditions.push(eq(employees.isActive, params.status === "active"));
    }

    const [employeeRows, countResult] = await Promise.all([
      db
        .select({
          id: employees.id,
          companyId: employees.companyId,
          userId: employees.userId,
          name: employees.name,
          email: employees.email,
          phone: employees.phone,
          role: employees.role,
          avatarUrl: employees.avatarUrl,
          isActive: employees.isActive,
          createdAt: employees.createdAt,
          updatedAt: employees.updatedAt,
          serviceId: services.id,
          serviceName: services.name,
        })
        .from(employees)
        .leftJoin(employeeServices, eq(employeeServices.employeeId, employees.id))
        .leftJoin(services, eq(employeeServices.serviceId, services.id))
        .where(and(...conditions))
        .orderBy(employees.name)
        .limit(params.limit)
        .offset((params.page - 1) * params.limit),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(employees)
        .where(and(...conditions)),
    ]);

    const total = countResult[0]?.count || 0;
    const data = Array.from(
      employeeRows.reduce((acc, row) => {
        const current = acc.get(row.id) || {
          id: row.id,
          companyId: row.companyId,
          userId: row.userId,
          name: row.name,
          email: row.email,
          phone: row.phone,
          role: row.role,
          avatarUrl: row.avatarUrl,
          isActive: row.isActive,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          serviceIds: [] as string[],
          services: [] as string[],
        };

        if (row.serviceId) current.serviceIds.push(row.serviceId);
        if (row.serviceName) current.services.push(row.serviceName);
        acc.set(row.id, current);
        return acc;
      }, new Map<string, {
        id: string;
        companyId: string;
        userId: string | null;
        name: string;
        email: string | null;
        phone: string | null;
        role: string | null;
        avatarUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        serviceIds: string[];
        services: string[];
      }>())
      .values()
    );

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
    console.error("[EMPLOYEES/GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const parsed = createEmployeeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { serviceIds, ...employeeData } = parsed.data;

    const [employee] = await db
      .insert(employees)
      .values({
        companyId: session.companyId,
        name: employeeData.name,
        email: employeeData.email || null,
        phone: employeeData.phone || null,
        role: employeeData.role || null,
        isActive: employeeData.isActive,
      })
      .returning();

    // Link services if provided
    if (serviceIds && serviceIds.length > 0) {
      await db.insert(employeeServices).values(
        serviceIds.map((serviceId) => ({
          employeeId: employee.id,
          serviceId,
        }))
      );
    }

    return NextResponse.json({ data: employee }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    console.error("[EMPLOYEES/POST]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
