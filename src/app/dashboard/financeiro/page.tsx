"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  status: "completed" | "pending";
  method: string;
};

const transactions: Transaction[] = [
  { id: "1", description: "Corte e Escova - Maria Santos", amount: 80, type: "income", category: "Serviços", date: "10/06/2025", status: "completed", method: "PIX" },
  { id: "2", description: "Coloração - Ana Oliveira", amount: 200, type: "income", category: "Serviços", date: "09/06/2025", status: "completed", method: "Cartão" },
  { id: "3", description: "Produtos de limpeza", amount: 150, type: "expense", category: "Insumos", date: "08/06/2025", status: "completed", method: "Débito" },
  { id: "4", description: "Manicure - Lucia Ferreira", amount: 40, type: "income", category: "Serviços", date: "08/06/2025", status: "pending", method: "Dinheiro" },
  { id: "5", description: "Aluguel do espaço", amount: 2000, type: "expense", category: "Fixo", date: "05/06/2025", status: "completed", method: "Transferência" },
  { id: "6", description: "Barba - João Silva", amount: 35, type: "income", category: "Serviços", date: "05/06/2025", status: "completed", method: "PIX" },
  { id: "7", description: "Tinta e insumos", amount: 450, type: "expense", category: "Insumos", date: "03/06/2025", status: "completed", method: "Cartão" },
  { id: "8", description: "Pedicure - Ana Costa", amount: 50, type: "income", category: "Serviços", date: "02/06/2025", status: "completed", method: "PIX" },
];

const monthlyData = [
  { name: "Jan", receita: 12400, despesas: 7200 },
  { name: "Fev", receita: 15800, despesas: 8100 },
  { name: "Mar", receita: 13200, despesas: 7600 },
  { name: "Abr", receita: 18900, despesas: 9200 },
  { name: "Mai", receita: 16700, despesas: 8900 },
  { name: "Jun", receita: 21300, despesas: 10100 },
];

const pieData = [
  { name: "PIX", value: 45, color: "#7c3aed" },
  { name: "Cartão", value: 30, color: "#3b82f6" },
  { name: "Dinheiro", value: 15, color: "#10b981" },
  { name: "Transferência", value: 10, color: "#f59e0b" },
];

export default function FinanceiroPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = transactions.filter((t) =>
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "description",
      header: "Descrição",
      render: (row) => {
        const t = row as unknown as Transaction;
        return (
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${t.type === "income" ? "bg-emerald-100" : "bg-red-100"}`}>
              {t.type === "income" ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{t.description}</p>
              <p className="text-xs text-gray-400">{t.category}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "amount",
      header: "Valor",
      render: (row) => {
        const t = row as unknown as Transaction;
        return (
          <span className={`text-sm font-bold ${t.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
            {t.type === "expense" ? "- " : "+ "}{formatCurrency(t.amount)}
          </span>
        );
      },
    },
    {
      key: "method",
      header: "Método",
      render: (row) => {
        const t = row as unknown as Transaction;
        return <Badge variant="secondary" className="text-xs">{t.method}</Badge>;
      },
    },
    {
      key: "date",
      header: "Data",
      render: (row) => {
        const t = row as unknown as Transaction;
        return <span className="text-sm text-gray-500">{t.date}</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const t = row as unknown as Transaction;
        return <StatusBadge status={t.status} />;
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Financeiro"
        description="Acompanhe receitas, despesas e fluxo de caixa."
        actions={
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Receita do Mês" value="R$ 21.3k" change={12} icon={<TrendingUp />} iconColor="text-emerald-600" iconBg="bg-emerald-50" index={0} />
        <StatCard title="Despesas do Mês" value="R$ 10.1k" change={5} icon={<TrendingDown />} iconColor="text-red-500" iconBg="bg-red-50" index={1} />
        <StatCard title="Lucro Líquido" value="R$ 11.2k" change={18} icon={<DollarSign />} iconColor="text-violet-600" iconBg="bg-violet-50" index={2} />
        <StatCard title="Ticket Médio" value="R$ 82,50" change={8} icon={<TrendingUp />} iconColor="text-blue-600" iconBg="bg-blue-50" index={3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>Comparativo mensal de 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} formatter={(v) => [formatCurrency(Number(v))]} />
                <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} fill="url(#colorReceita)" name="Receita" />
                <Area type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} fill="url(#colorDespesas)" name="Despesas" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>Distribuição do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} />
                <Tooltip formatter={(v) => [`${v}%`, "Participação"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Transações</CardTitle>
              <CardDescription>Histórico de movimentações</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-48 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
              <TabsTrigger value="expense">Despesas</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} rowKey={(row) => (row as unknown as Transaction).id} />
            </TabsContent>
            <TabsContent value="income">
              <DataTable columns={columns} data={filtered.filter((t) => t.type === "income") as unknown as Record<string, unknown>[]} />
            </TabsContent>
            <TabsContent value="expense">
              <DataTable columns={columns} data={filtered.filter((t) => t.type === "expense") as unknown as Record<string, unknown>[]} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* New Transaction Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
            <DialogDescription>Registre uma nova movimentação financeira.</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input label="Descrição" placeholder="Ex: Corte - Maria Santos" />
            <Input label="Valor (R$)" type="number" placeholder="0,00" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="insumos">Insumos</SelectItem>
                    <SelectItem value="fixo">Fixo</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Método</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Método" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input label="Data" type="date" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>Registrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
