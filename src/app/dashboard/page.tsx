"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { name: "Jan", value: 12400 },
  { name: "Fev", value: 15800 },
  { name: "Mar", value: 13200 },
  { name: "Abr", value: 18900 },
  { name: "Mai", value: 16700 },
  { name: "Jun", value: 21300 },
  { name: "Jul", value: 19800 },
];

const weekData = [
  { day: "Seg", appointments: 8 },
  { day: "Ter", appointments: 12 },
  { day: "Qua", appointments: 10 },
  { day: "Qui", appointments: 14 },
  { day: "Sex", appointments: 18 },
  { day: "Sáb", appointments: 20 },
  { day: "Dom", appointments: 5 },
];

const upcomingAppointments = [
  { client: "Maria Santos", service: "Corte e Escova", time: "09:00", employee: "Ana", status: "confirmed" as const },
  { client: "João Silva", service: "Barba", time: "10:30", employee: "Carlos", status: "confirmed" as const },
  { client: "Lucia Ferreira", service: "Manicure", time: "11:00", employee: "Paula", status: "pending" as const },
  { client: "Pedro Costa", service: "Corte", time: "14:00", employee: "Ana", status: "confirmed" as const },
  { client: "Ana Oliveira", service: "Coloração", time: "15:30", employee: "Paula", status: "pending" as const },
];

const topServices = [
  { name: "Corte Feminino", count: 89, percentage: 85 },
  { name: "Coloração", count: 67, percentage: 64 },
  { name: "Manicure", count: 54, percentage: 52 },
  { name: "Barba", count: 43, percentage: 41 },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Bem-vinda de volta, Ana! Aqui está o resumo de hoje."
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Agendamentos Hoje"
          value="24"
          change={12}
          icon={<Calendar className="h-5 w-5" />}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          index={0}
        />
        <StatCard
          title="Novos Clientes"
          value="8"
          change={5}
          icon={<Users className="h-5 w-5" />}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          index={1}
        />
        <StatCard
          title="Receita do Mês"
          value="R$ 18.4k"
          change={18}
          icon={<DollarSign className="h-5 w-5" />}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          index={2}
        />
        <StatCard
          title="Taxa de Retorno"
          value="78%"
          change={-2}
          icon={<TrendingUp className="h-5 w-5" />}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          index={3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Receita Mensal</CardTitle>
                  <CardDescription>Evolução dos últimos 7 meses</CardDescription>
                </div>
                <Badge variant="success" className="text-xs">+18% este mês</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(v) => [formatCurrency(Number(v)), "Receita"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2.5} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Agendamentos</CardTitle>
              <CardDescription>Esta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weekData} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                    formatter={(v) => [Number(v), "Agendamentos"]}
                  />
                  <Bar dataKey="appointments" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">Total da semana</span>
                <span className="font-bold text-gray-900">87</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Próximos Agendamentos</CardTitle>
                  <CardDescription>Agenda de hoje</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/dashboard/agenda">
                    Ver todos
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {upcomingAppointments.map((appt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/60 transition-colors"
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs">{getInitials(appt.client)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{appt.client}</p>
                      <p className="text-xs text-gray-500">{appt.service} · {appt.employee}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{appt.time}</span>
                      </div>
                      <StatusBadge status={appt.status} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Serviços Populares</CardTitle>
              <CardDescription>Este mês</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topServices.map((service, i) => (
                <div key={service.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-sm font-medium text-gray-700">{service.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{service.count}</span>
                  </div>
                  <Progress value={service.percentage} className="h-1.5" />
                </div>
              ))}

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">253</strong> serviços realizados
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">12</strong> cancelamentos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
