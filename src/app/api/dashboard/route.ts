import { NextResponse } from "next/server";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { appointments, clients, companies, employees, services, transactions, workingHours } from "@/db/schema";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireAuth();
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const weekStart = startOfWeek(now).toISOString().slice(0, 10);
    const weekEnd = endOfWeek(now).toISOString().slice(0, 10);

    const [
      todayAppointments,
      newClients,
      monthlyRevenue,
      activeClients,
      totalClients,
      revenueByMonth,
      appointmentsByWeekday,
      upcomingAppointments,
      topServices,
      completedCount,
      cancelledCount,
      serviceCount,
      employeeCount,
      workingHourCount,
      companyData,
    ] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(appointments)
        .where(and(eq(appointments.companyId, session.companyId), eq(appointments.date, today))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(clients)
        .where(and(eq(clients.companyId, session.companyId), gte(sql`date(${clients.createdAt})`, monthStart))),
      db
        .select({ total: sql<string>`coalesce(sum(${transactions.amount}), 0)` })
        .from(transactions)
        .where(
          and(
            eq(transactions.companyId, session.companyId),
            eq(transactions.type, "income"),
            eq(transactions.status, "completed"),
            gte(transactions.date, monthStart)
          )
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(clients)
        .where(and(eq(clients.companyId, session.companyId), eq(clients.isActive, true))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(clients)
        .where(eq(clients.companyId, session.companyId)),
      db
        .select({
          name: sql<string>`to_char(date_trunc('month', ${transactions.date}::date), 'Mon')`,
          value: sql<string>`coalesce(sum(${transactions.amount}), 0)`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.companyId, session.companyId),
            eq(transactions.type, "income"),
            eq(transactions.status, "completed"),
            gte(transactions.date, sql`(current_date - interval '6 months')::date`)
          )
        )
        .groupBy(sql`date_trunc('month', ${transactions.date}::date)`)
        .orderBy(sql`date_trunc('month', ${transactions.date}::date)`),
      db
        .select({
          day: sql<number>`extract(isodow from ${appointments.date}::date)::int`,
          appointments: sql<number>`count(*)::int`,
        })
        .from(appointments)
        .where(and(eq(appointments.companyId, session.companyId), gte(appointments.date, weekStart), lte(appointments.date, weekEnd)))
        .groupBy(sql`extract(isodow from ${appointments.date}::date)`),
      db
        .select({
          id: appointments.id,
          clientName: sql<string>`coalesce(${clients.name}, ${appointments.clientName}, 'Cliente')`,
          serviceName: sql<string>`coalesce(${services.name}, 'Servico')`,
          employeeName: sql<string>`coalesce(${employees.name}, 'Profissional')`,
          time: appointments.startTime,
          status: appointments.status,
        })
        .from(appointments)
        .leftJoin(clients, eq(appointments.clientId, clients.id))
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .leftJoin(employees, eq(appointments.employeeId, employees.id))
        .where(and(eq(appointments.companyId, session.companyId), eq(appointments.date, today)))
        .orderBy(appointments.startTime)
        .limit(6),
      db
        .select({
          name: services.name,
          count: sql<number>`count(${appointments.id})::int`,
        })
        .from(appointments)
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .where(and(eq(appointments.companyId, session.companyId), gte(appointments.date, monthStart)))
        .groupBy(services.name)
        .orderBy(sql`count(${appointments.id}) desc`)
        .limit(5),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(appointments)
        .where(and(eq(appointments.companyId, session.companyId), eq(appointments.status, "completed"), gte(appointments.date, monthStart))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(appointments)
        .where(and(eq(appointments.companyId, session.companyId), eq(appointments.status, "cancelled"), gte(appointments.date, monthStart))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(services)
        .where(and(eq(services.companyId, session.companyId), eq(services.isActive, true))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(employees)
        .where(and(eq(employees.companyId, session.companyId), eq(employees.isActive, true))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(workingHours)
        .where(and(eq(workingHours.companyId, session.companyId), eq(workingHours.isActive, true))),
      db
        .select({
          name: companies.name,
          slug: companies.slug,
          description: companies.description,
          phone: companies.phone,
        })
        .from(companies)
        .where(eq(companies.id, session.companyId))
        .limit(1),
    ]);

    const returnRate =
      totalClients[0]?.count > 0 ? Math.round(((activeClients[0]?.count || 0) / totalClients[0].count) * 100) : 0;
    const maxServiceCount = Math.max(1, ...topServices.map((service) => service.count));

    return NextResponse.json({
      data: {
        stats: {
          todayAppointments: todayAppointments[0]?.count || 0,
          newClients: newClients[0]?.count || 0,
          monthlyRevenue: Number(monthlyRevenue[0]?.total || 0),
          returnRate,
        },
        revenueData: revenueByMonth.map((row) => ({
          name: row.name,
          value: Number(row.value),
        })),
        weekData: buildWeekData(appointmentsByWeekday),
        upcomingAppointments,
        topServices: topServices.map((service) => ({
          ...service,
          percentage: Math.round((service.count / maxServiceCount) * 100),
        })),
        monthSummary: {
          completed: completedCount[0]?.count || 0,
          cancelled: cancelledCount[0]?.count || 0,
        },
        onboarding: {
          companyName: companyData[0]?.name || "Sua empresa",
          publicSlug: companyData[0]?.slug || "",
          hasCompanyProfile: Boolean(companyData[0]?.description && companyData[0]?.phone),
          serviceCount: serviceCount[0]?.count || 0,
          employeeCount: employeeCount[0]?.count || 0,
          workingHourCount: workingHourCount[0]?.count || 0,
          appointmentCountThisMonth: completedCount[0]?.count || 0,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }
    console.error("[DASHBOARD/GET]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

function startOfWeek(date: Date) {
  const clone = new Date(date);
  const day = clone.getDay() || 7;
  clone.setDate(clone.getDate() - day + 1);
  return clone;
}

function endOfWeek(date: Date) {
  const start = startOfWeek(date);
  start.setDate(start.getDate() + 6);
  return start;
}

function buildWeekData(rows: { day: number; appointments: number }[]) {
  const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
  return labels.map((label, index) => ({
    day: label,
    appointments: rows.find((row) => row.day === index + 1)?.appointments || 0,
  }));
}
