"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { TransactionForm, type TransactionFormValue } from "@/components/forms/transaction-form";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiDelete, apiPost, apiPut } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useApiGet } from "@/hooks/use-api";

type Transaction = {
  id: string;
  description: string;
  amount: string;
  type: "income" | "expense";
  category: string | null;
  paymentMethod: string | null;
  date: string;
  status: "completed" | "pending" | "cancelled";
};

type TransactionPayload = {
  description: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  paymentMethod?: string;
  date: string;
  status: "completed" | "pending" | "cancelled";
};

export default function FinanceiroPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [page, setPage] = useState(1);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
    }),
    [page, search]
  );

  const {
    data: transactions,
    isLoading,
    error,
    pagination,
    refetch,
  } = useApiGet<Transaction[]>("/api/financeiro", { params });

  const filtered = useMemo(() => {
    return (transactions || []).filter((transaction) => {
      return typeFilter === "all" || transaction.type === typeFilter;
    });
  }, [transactions, typeFilter]);

  const summary = useMemo(() => {
    const income = (transactions || [])
      .filter((transaction) => transaction.type === "income" && transaction.status !== "cancelled")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);
    const expense = (transactions || [])
      .filter((transaction) => transaction.type === "expense" && transaction.status !== "cancelled")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
      averageTicket: income > 0 ? income / Math.max(1, (transactions || []).filter((t) => t.type === "income").length) : 0,
    };
  }, [transactions]);

  async function handleSubmit(payload: TransactionPayload) {
    setIsSubmitting(true);
    setFormError(null);

    const response = editTransaction
      ? await apiPut<Transaction>(`/api/financeiro/${editTransaction.id}`, payload)
      : await apiPost<Transaction>("/api/financeiro", payload);

    setIsSubmitting(false);

    if (response.error) {
      setFormError(response.error);
      return;
    }

    setModalOpen(false);
    setEditTransaction(null);
    await refetch();
  }

  async function handleDelete(transaction: Transaction) {
    const response = await apiDelete(`/api/financeiro/${transaction.id}`);
    if (!response.error) {
      await refetch();
    }
  }

  function openCreateModal() {
    setEditTransaction(null);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(transaction: Transaction) {
    setEditTransaction(transaction);
    setFormError(null);
    setModalOpen(true);
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "description",
      header: "Descricao",
      render: (row) => {
        const transaction = row as unknown as Transaction;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                transaction.type === "income" ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              {transaction.type === "income" ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
              )}
            </div>
            <div>
              <p className="max-w-[220px] truncate text-sm font-medium text-gray-900">
                {transaction.description}
              </p>
              <p className="text-xs text-gray-400">{transaction.category || "Sem categoria"}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "amount",
      header: "Valor",
      render: (row) => {
        const transaction = row as unknown as Transaction;
        return (
          <span
            className={`text-sm font-bold ${
              transaction.type === "income" ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {transaction.type === "expense" ? "- " : "+ "}
            {formatCurrency(Number(transaction.amount))}
          </span>
        );
      },
    },
    {
      key: "paymentMethod",
      header: "Metodo",
      render: (row) => {
        const transaction = row as unknown as Transaction;
        return <Badge variant="secondary">{transaction.paymentMethod || "-"}</Badge>;
      },
    },
    {
      key: "date",
      header: "Data",
      render: (row) => {
        const transaction = row as unknown as Transaction;
        return <span className="text-sm text-gray-500">{transaction.date}</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const transaction = row as unknown as Transaction;
        return <StatusBadge status={transaction.status} />;
      },
    },
    {
      key: "actions",
      header: "",
      render: (row) => {
        const transaction = row as unknown as Transaction;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditModal(transaction)}>
                <Edit className="h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(transaction)}>
                <Trash2 className="h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Financeiro"
        description="Acompanhe receitas, despesas e fluxo de caixa."
        actions={
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Nova Transacao
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Receita"
          value={formatCurrency(summary.income)}
          change={0}
          icon={<TrendingUp />}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          index={0}
        />
        <StatCard
          title="Despesas"
          value={formatCurrency(summary.expense)}
          change={0}
          icon={<TrendingDown />}
          iconColor="text-red-500"
          iconBg="bg-red-50"
          index={1}
        />
        <StatCard
          title="Saldo"
          value={formatCurrency(summary.balance)}
          change={0}
          icon={<DollarSign />}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          index={2}
        />
        <StatCard
          title="Ticket Medio"
          value={formatCurrency(summary.averageTicket)}
          change={0}
          icon={<TrendingUp />}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          index={3}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <CardTitle>Transacoes</CardTitle>
              <CardDescription>Historico de movimentacoes financeiras</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Buscar..."
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <Tabs value={typeFilter} onValueChange={(value) => setTypeFilter(value as "all" | "income" | "expense")}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
              <TabsTrigger value="expense">Despesas</TabsTrigger>
            </TabsList>
            <TabsContent value={typeFilter}>
              <DataTable
                columns={columns}
                data={filtered as unknown as Record<string, unknown>[]}
                isLoading={isLoading}
                emptyMessage="Nenhuma transacao encontrada."
                rowKey={(row) => (row as unknown as Transaction).id}
                currentPage={page}
                totalPages={pagination?.totalPages || 1}
                onPageChange={setPage}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{editTransaction ? "Editar Transacao" : "Nova Transacao"}</DialogTitle>
            <DialogDescription>Registre receitas, despesas e ajustes financeiros.</DialogDescription>
          </DialogHeader>
          <TransactionForm
            initialValue={editTransaction as TransactionFormValue | null}
            isSubmitting={isSubmitting}
            error={formError}
            onCancel={() => setModalOpen(false)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
