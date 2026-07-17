import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees, employeeServices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { updateEmployeeSchema } from "@/lib/validators";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [employee] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, id), eq(employees.companyId, session.companyId)))
      .limit(1);

    if (!employee) {
      return NextResponse.json({ error: "Funcionario nao encontrado" }, { status: 404 });
    }

    const serviceRows = await db
      .select({ serviceId: employeeServices.serviceId })
      .from(employeeServices)
      .where(eq(employeeServices.employeeId, id));

    return NextResponse.json({
      data: {
        ...employee,
        serviceIds: serviceRows.map((row) => row.serviceId),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[EMPLOYEES/GET/ID]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const parsed = updateEmployeeSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { serviceIds, ...employeeData } = parsed.data;

    const [updated] = await db
      .update(employees)
      .set({
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        role: employeeData.role,
        isActive: employeeData.isActive,
        updatedAt: new Date(),
      })
      .where(and(eq(employees.id, id), eq(employees.companyId, session.companyId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Funcionario nao encontrado" }, { status: 404 });
    }

    if (serviceIds) {
      await db.delete(employeeServices).where(eq(employeeServices.employeeId, id));

      if (serviceIds.length > 0) {
        await db.insert(employeeServices).values(
          serviceIds.map((serviceId) => ({
            employeeId: id,
            serviceId,
          }))
        );
      }
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[EMPLOYEES/PUT]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [deleted] = await db
      .delete(employees)
      .where(and(eq(employees.id, id), eq(employees.companyId, session.companyId)))
      .returning({ id: employees.id });

    if (!deleted) {
      return NextResponse.json({ error: "Funcionario nao encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Funcionario removido com sucesso" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[EMPLOYEES/DELETE]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
