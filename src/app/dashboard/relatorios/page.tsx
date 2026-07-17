"use client";

import { useState } from "react";
import { Calendar, DollarSign, Download, Star, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { useApiGet } from "@/hooks/use-api";

type ReportsData = {
  kpis: {
    revenue: number;
    clients: number;
    appointments: number;
    rating: number;
  };
  monthlyRevenue: { month: string; receita: number; meta: number }[];
  clientRetention: { month: string; novos: number; retorno: number }[];
  servicePerformance: {
    service: string;
    appointments: number;
    revenue: number;
    satisfaction: number;
  }[];
  employeeData: {
    name: string;
    appointments: number;
    revenue: number;
    rating: number;
  }[];
  radarData: { subject: string; value: number }[];
};

export default function RelatoriosPage() {
  const [period, setPeriod] = useState("month");
  const { data, isLoading, error } = useApiGet<ReportsData>("/api/relatorios", {
    params: { period },
  });

  const maxServiceAppointments = Math.max(
    1,
    ...(data?.servicePerformance || []).map((service) => service.appointments)
  );
  const maxEmployeeAppointments = Math.max(
    1,
    ...(data?.employeeData || []).map((employee) => employee.appointments)
  );

  return (
    <div>
      <PageHeader
        title="Relatorios"
        description="Analises detalhadas de performance do seu negocio."
        actions={
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        }
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Receita Total" value={isLoading ? "..." : formatCurrency(data?.kpis.revenue || 0)} change={0} icon={<DollarSign />} iconColor="text-emerald-600" iconBg="bg-emerald-50" index={0} />
        <StatCard title="Total de Clientes" value={isLoading ? "..." : String(data?.kpis.clients || 0)} change={0} icon={<Users />} iconColor="text-blue-600" iconBg="bg-blue-50" index={1} />
        <StatCard title="Agendamentos" value={isLoading ? "..." : String(data?.kpis.appointments || 0)} change={0} icon={<Calendar />} iconColor="text-violet-600" iconBg="bg-violet-50" index={2} />
        <StatCard title="Avaliacao Media" value={isLoading ? "..." : `${data?.kpis.rating || 0}`} change={0} icon={<Star />} iconColor="text-amber-600" iconBg="bg-amber-50" index={3} />
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="services">Servicos</TabsTrigger>
          <TabsTrigger value="employees">Equipe</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Receita vs Meta</CardTitle>
                <CardDescription>Comparativo mensal</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[260px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data?.monthlyRevenue || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${(Number(value) / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value))]} />
                      <Bar dataKey="receita" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Receita" />
                      <Bar dataKey="meta" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Meta" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Performance Geral</CardTitle>
                <CardDescription>Indicadores chave</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={data?.radarData || []}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <Radar name="Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.1} strokeWidth={2} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Novos Clientes vs Retorno</CardTitle>
              <CardDescription>Taxa mensal de relacionamento</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[260px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data?.clientRetention || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="retorno" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} name="Retorno" />
                    <Line type="monotone" dataKey="novos" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} name="Novos" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Servico</CardTitle>
              <CardDescription>Analise detalhada por oferta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data?.servicePerformance || []).length === 0 ? (
                  <p className="text-sm text-gray-500">Sem dados de servicos no periodo.</p>
                ) : (
                  (data?.servicePerformance || []).map((service) => (
                    <div key={service.service} className="flex items-center gap-4">
                      <div className="w-28 shrink-0">
                        <p className="truncate text-sm font-medium text-gray-700">{service.service}</p>
                      </div>
                      <div className="flex-1">
                        <Progress value={(service.appointments / maxServiceAppointments) * 100} className="h-2" />
                      </div>
                      <div className="flex shrink-0 items-center gap-4 text-right">
                        <Metric value={service.appointments} label="atend." />
                        <Metric value={formatCurrency(service.revenue)} label="receita" tone="success" />
                        <Metric value={service.satisfaction} label="score" tone="warning" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {(data?.employeeData || []).length === 0 ? (
              <Card className="md:col-span-3">
                <CardContent className="py-12 text-center text-sm text-gray-500">
                  Sem dados de equipe no periodo.
                </CardContent>
              </Card>
            ) : (
              (data?.employeeData || []).map((employee) => (
                <Card key={employee.name}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                        {employee.name.split(" ").map((part) => part[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{employee.name}</p>
                        <Badge variant="success" className="text-xs">Score {employee.rating}</Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Atendimentos</span>
                        <span className="font-bold text-gray-900">{employee.appointments}</span>
                      </div>
                      <Progress value={(employee.appointments / maxEmployeeAppointments) * 100} />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Receita gerada</span>
                        <span className="font-bold text-emerald-600">{formatCurrency(employee.revenue)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({
  value,
  label,
  tone,
}: {
  value: string | number;
  label: string;
  tone?: "success" | "warning";
}) {
  return (
    <div>
      <p className={tone === "success" ? "text-sm font-bold text-emerald-600" : tone === "warning" ? "text-sm font-bold text-amber-500" : "text-sm font-bold text-gray-900"}>
        {value}
      </p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
