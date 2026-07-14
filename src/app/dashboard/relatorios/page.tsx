"use client";

import React, { useState } from "react";
import { Download, TrendingUp, Users, Calendar, DollarSign, Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", receita: 12400, meta: 15000 },
  { month: "Fev", receita: 15800, meta: 15000 },
  { month: "Mar", receita: 13200, meta: 15000 },
  { month: "Abr", receita: 18900, meta: 18000 },
  { month: "Mai", receita: 16700, meta: 18000 },
  { month: "Jun", receita: 21300, meta: 20000 },
];

const clientRetention = [
  { month: "Jan", novos: 32, retorno: 68 },
  { month: "Fev", novos: 28, retorno: 72 },
  { month: "Mar", novos: 35, retorno: 65 },
  { month: "Abr", novos: 22, retorno: 78 },
  { month: "Mai", novos: 30, retorno: 70 },
  { month: "Jun", novos: 25, retorno: 75 },
];

const servicePerformance = [
  { service: "Corte Fem.", appointments: 89, revenue: 7120, satisfaction: 4.9 },
  { service: "Coloração", appointments: 67, revenue: 13400, satisfaction: 4.8 },
  { service: "Manicure", appointments: 102, revenue: 4080, satisfaction: 4.7 },
  { service: "Escova", appointments: 54, revenue: 3240, satisfaction: 4.8 },
  { service: "Barba", appointments: 43, revenue: 1505, satisfaction: 4.9 },
];

const employeeData = [
  { name: "Ana Lima", appointments: 142, revenue: 11360, rating: 4.9 },
  { name: "Paula Costa", appointments: 87, revenue: 4350, rating: 4.7 },
  { name: "Carlos Souza", appointments: 98, revenue: 4900, rating: 4.8 },
];

const radarData = [
  { subject: "Pontualidade", value: 88 },
  { subject: "Satisfação", value: 92 },
  { subject: "Retenção", value: 78 },
  { subject: "Conversão", value: 85 },
  { subject: "Ticket Médio", value: 72 },
  { subject: "NPS", value: 90 },
];

const pieColors = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function RelatoriosPage() {
  const [period, setPeriod] = useState("month");

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Análises detalhadas de performance do seu negócio."
        actions={
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
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

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Receita Total" value="R$ 98.3k" change={22} icon={<DollarSign />} iconColor="text-emerald-600" iconBg="bg-emerald-50" index={0} />
        <StatCard title="Total de Clientes" value="1.234" change={15} icon={<Users />} iconColor="text-blue-600" iconBg="bg-blue-50" index={1} />
        <StatCard title="Agendamentos" value="847" change={18} icon={<Calendar />} iconColor="text-violet-600" iconBg="bg-violet-50" index={2} />
        <StatCard title="Avaliação Média" value="4.83 ⭐" change={3} icon={<Star />} iconColor="text-amber-600" iconBg="bg-amber-50" index={3} />
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="employees">Equipe</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Receita vs Meta</CardTitle>
                <CardDescription>Comparativo mensal de 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [formatCurrency(Number(v))]} />
                    <Bar dataKey="receita" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Receita" />
                    <Bar dataKey="meta" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Meta" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Performance Geral</CardTitle>
                <CardDescription>Indicadores chave</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <Radar name="Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.1} strokeWidth={2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Novos Clientes vs Retorno</CardTitle>
              <CardDescription>Taxa de retenção mensal</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={clientRetention}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => [`${v}%`]} />
                  <Legend />
                  <Line type="monotone" dataKey="retorno" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} name="Retorno %" />
                  <Line type="monotone" dataKey="novos" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} name="Novos %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Serviço</CardTitle>
              <CardDescription>Análise detalhada de cada serviço</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {servicePerformance.map((service, i) => (
                  <div key={service.service} className="flex items-center gap-4">
                    <div className="w-28 shrink-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{service.service}</p>
                    </div>
                    <div className="flex-1">
                      <Progress value={(service.appointments / 102) * 100} className="h-2" />
                    </div>
                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{service.appointments}</p>
                        <p className="text-xs text-gray-400">atend.</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-600">{formatCurrency(service.revenue)}</p>
                        <p className="text-xs text-gray-400">receita</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-500">⭐ {service.satisfaction}</p>
                        <p className="text-xs text-gray-400">avaliação</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {employeeData.map((emp, i) => (
              <Card key={emp.name}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {emp.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{emp.name}</p>
                      <Badge variant="success" className="text-xs">⭐ {emp.rating}</Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Atendimentos</span>
                      <span className="font-bold text-gray-900">{emp.appointments}</span>
                    </div>
                    <Progress value={(emp.appointments / 142) * 100} />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Receita gerada</span>
                      <span className="font-bold text-emerald-600">{formatCurrency(emp.revenue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
