"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  Plus,
  Settings,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, getInitials } from "@/lib/utils";
import { useApiGet } from "@/hooks/use-api";

type DashboardData = {
  stats: {
    todayAppointments: number;
    newClients: number;
    monthlyRevenue: number;
    returnRate: number;
  };
  revenueData: { name: string; value: number }[];
  weekData: { day: string; appointments: number }[];
  upcomingAppointments: {
    id: string;
    clientName: string;
    serviceName: string;
    employeeName: string;
    time: string;
    status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  }[];
  topServices: { name: string; count: number; percentage: number }[];
  monthSummary: {
    completed: number;
    cancelled: number;
  };
  onboarding: {
    companyName: string;
    publicSlug: string;
    hasCompanyProfile: boolean;
    serviceCount: number;
    employeeCount: number;
    workingHourCount: number;
    appointmentCountThisMonth: number;
  };
};

export default function DashboardPage() {
  const { data, isLoading, error } = useApiGet<DashboardData>("/api/dashboard");

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumo operacional do seu negocio em tempo real."
        actions={
          <Button variant="primary" size="sm" asChild>
            <Link href="/dashboard/agenda">
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </Link>
          </Button>
        }
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {!isLoading && data?.onboarding && <OnboardingCard onboarding={data.onboarding} />}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Agendamentos Hoje"
          value={isLoading ? "..." : String(data?.stats.todayAppointments || 0)}
          change={0}
          icon={<Calendar className="h-5 w-5" />}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          index={0}
        />
        <StatCard
          title="Novos Clientes"
          value={isLoading ? "..." : String(data?.stats.newClients || 0)}
          change={0}
          icon={<Users className="h-5 w-5" />}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          index={1}
        />
        <StatCard
          title="Receita do Mes"
          value={isLoading ? "..." : formatCurrency(data?.stats.monthlyRevenue || 0)}
          change={0}
          icon={<DollarSign className="h-5 w-5" />}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          index={2}
        />
        <StatCard
          title="Clientes Ativos"
          value={isLoading ? "..." : `${data?.stats.returnRate || 0}%`}
          change={0}
          icon={<TrendingUp className="h-5 w-5" />}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          index={3}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Receita Mensal</CardTitle>
                  <CardDescription>Evolucao dos ultimos meses</CardDescription>
                </div>
                <Badge variant="success" className="text-xs">Atualizado</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[220px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data?.revenueData || []}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${(Number(value) / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                      formatter={(value) => [formatCurrency(Number(value)), "Receita"]}
                    />
                    <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={2.5} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

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
              {isLoading ? (
                <Skeleton className="h-[180px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data?.weekData || []} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
                      formatter={(value) => [Number(value), "Agendamentos"]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="appointments" name="Agendamentos" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">Total da semana</span>
                <span className="font-bold text-gray-900">
                  {(data?.weekData || []).reduce((total, item) => total + item.appointments, 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
                  <CardTitle>Proximos Agendamentos</CardTitle>
                  <CardDescription>Agenda de hoje</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/agenda">
                    Ver todos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-3 p-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : (data?.upcomingAppointments || []).length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-gray-500">Nenhum agendamento para hoje.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {(data?.upcomingAppointments || []).map((appointment, index) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-gray-50/60"
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="text-xs">{getInitials(appointment.clientName)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">{appointment.clientName}</p>
                        <p className="text-xs text-gray-500">
                          {appointment.serviceName} - {appointment.employeeName}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">{appointment.time}</span>
                        </div>
                        <StatusBadge status={appointment.status} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Servicos Populares</CardTitle>
              <CardDescription>Este mes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data?.topServices || []).length === 0 ? (
                <p className="text-sm text-gray-500">Sem servicos realizados ainda.</p>
              ) : (
                (data?.topServices || []).map((service) => (
                  <div key={service.name}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-sm font-medium text-gray-700">{service.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-500">{service.count}</span>
                    </div>
                    <Progress value={service.percentage} className="h-1.5" />
                  </div>
                ))
              )}

              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">{data?.monthSummary.completed || 0}</strong> servicos realizados
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-600">
                    <strong className="text-gray-900">{data?.monthSummary.cancelled || 0}</strong> cancelamentos
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

function OnboardingCard({ onboarding }: { onboarding: DashboardData["onboarding"] }) {
  const items = [
    {
      title: "Completar perfil publico",
      description: "Nome, telefone e descricao aumentam a confianca de quem agenda.",
      href: "/dashboard/empresa",
      done: onboarding.hasCompanyProfile,
      icon: Settings,
    },
    {
      title: "Cadastrar servicos",
      description: "Inclua preco e duracao para liberar a venda pelo link.",
      href: "/dashboard/servicos",
      done: onboarding.serviceCount > 0,
      icon: Star,
    },
    {
      title: "Adicionar profissionais",
      description: "Organize quem atende e quais servicos cada pessoa realiza.",
      href: "/dashboard/funcionarios",
      done: onboarding.employeeCount > 0,
      icon: Users,
    },
    {
      title: "Configurar horarios",
      description: "Defina disponibilidade para evitar agendamentos fora do expediente.",
      href: "/dashboard/empresa",
      done: onboarding.workingHourCount > 0,
      icon: Clock,
    },
    {
      title: "Receber primeiro agendamento",
      description: "Compartilhe sua pagina publica com clientes.",
      href: onboarding.publicSlug ? `/agendar/${onboarding.publicSlug}` : "/dashboard/empresa",
      done: onboarding.appointmentCountThisMonth > 0,
      icon: Calendar,
      external: Boolean(onboarding.publicSlug),
    },
  ];
  const completed = items.filter((item) => item.done).length;
  const progress = Math.round((completed / items.length) * 100);

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
          <div className="border-b border-gray-100 bg-gray-50 p-5 lg:border-b-0 lg:border-r">
            <Badge variant={completed === items.length ? "success" : "primary"} className="mb-3">
              {completed} de {items.length} passos
            </Badge>
            <h2 className="text-lg font-bold text-gray-900">Prepare sua agenda para vender</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Complete o basico para transformar {onboarding.companyName} em uma pagina de agendamento confiavel.
            </p>
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
                <span>Progresso</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            {onboarding.publicSlug && (
              <Button className="mt-5 w-full" variant="outline" size="sm" asChild>
                <a href={`/agendar/${onboarding.publicSlug}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Abrir pagina publica
                </a>
              </Button>
            )}
          </div>
          <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-5">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className="border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 sm:border-r xl:border-b-0"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.done ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"}`}>
                      {item.done ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
