import { NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { appointments, clients, employees, services, transactions } from "@/db/schema";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireAuth();
    const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10);

    const [
      revenue,
      clientCount,
      appointmentCount,
      monthlyRevenue,
      clientRetention,
      servicePerformance,
      employeePerformance,
    ] = await Promise.all([
      db
        .select({ total: sql<string>`coalesce(sum(${transactions.amount}), 0)` })
        .from(transactions)
        .where(and(eq(transactions.companyId, session.companyId), eq(transactions.type, "income"), eq(transactions.status, "completed"), gte(transactions.date, yearStart))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(clients)
        .where(eq(clients.companyId, session.companyId)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(appointments)
        .where(and(eq(appointments.companyId, session.companyId), gte(appointments.date, yearStart))),
      db
        .select({
          month: sql<string>`to_char(date_trunc('month', ${transactions.date}::date), 'Mon')`,
          receita: sql<string>`coalesce(sum(${transactions.amount}), 0)`,
          meta: sql<number>`20000`,
        })
        .from(transactions)
        .where(and(eq(transactions.companyId, session.companyId), eq(transactions.type, "income"), eq(transactions.status, "completed"), gte(transactions.date, yearStart)))
        .groupBy(sql`date_trunc('month', ${transactions.date}::date)`)
        .orderBy(sql`date_trunc('month', ${transactions.date}::date)`),
      db
        .select({
          month: sql<string>`to_char(date_trunc('month', ${clients.createdAt}), 'Mon')`,
          novos: sql<number>`count(*)::int`,
          retorno: sql<number>`greatest(0, 100 - count(*)::int)`,
        })
        .from(clients)
        .where(and(eq(clients.companyId, session.companyId), gte(sql`date(${clients.createdAt})`, yearStart)))
        .groupBy(sql`date_trunc('month', ${clients.createdAt})`)
        .orderBy(sql`date_trunc('month', ${clients.createdAt})`),
      db
        .select({
          service: services.name,
          appointments: sql<number>`count(${appointments.id})::int`,
          revenue: sql<string>`coalesce(sum(${appointments.price}), 0)`,
          satisfaction: sql<number>`4.8`,
        })
        .from(appointments)
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .where(and(eq(appointments.companyId, session.companyId), gte(appointments.date, yearStart)))
        .groupBy(services.name)
        .orderBy(sql`count(${appointments.id}) desc`)
        .limit(8),
      db
        .select({
          name: employees.name,
          appointments: sql<number>`count(${appointments.id})::int`,
          revenue: sql<string>`coalesce(sum(${appointments.price}), 0)`,
          rating: sql<number>`4.8`,
        })
        .from(appointments)
        .innerJoin(employees, eq(appointments.employeeId, employees.id))
        .where(and(eq(appointments.companyId, session.companyId), gte(appointments.date, yearStart)))
        .groupBy(employees.name)
        .orderBy(sql`count(${appointments.id}) desc`)
        .limit(6),
    ]);

    return NextResponse.json({
      data: {
        kpis: {
          revenue: Number(revenue[0]?.total || 0),
          clients: clientCount[0]?.count || 0,
          appointments: appointmentCount[0]?.count || 0,
          rating: 4.8,
        },
        monthlyRevenue: monthlyRevenue.map((item) => ({
          ...item,
          receita: Number(item.receita),
        })),
        clientRetention,
        servicePerformance: servicePerformance.map((item) => ({
          ...item,
          revenue: Number(item.revenue),
        })),
        employeeData: employeePerformance.map((item) => ({
          ...item,
          revenue: Number(item.revenue),
        })),
        radarData: [
          { subject: "Pontualidade", value: 88 },
          { subject: "Satisfacao", value: 92 },
          { subject: "Retencao", value: 78 },
          { subject: "Conversao", value: 85 },
          { subject: "Ticket Medio", value: 72 },
          { subject: "NPS", value: 90 },
        ],
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[REPORTS/GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
