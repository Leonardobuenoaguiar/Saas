"use client";

import { useMemo, useState } from "react";
import { Edit, Eye, Mail, MoreHorizontal, Phone, Plus, Search, Trash2 } from "lucide-react";
import { ClientForm, type ClientFormValue } from "@/components/forms/client-form";
import { DataTable, type Column } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { getInitials } from "@/lib/utils";
import { useApiGet } from "@/hooks/use-api";

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  birthDate: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
};

type ClientPayload = {
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  notes?: string;
  isActive: boolean;
};

export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      status: status === "all" ? undefined : status,
    }),
    [page, search, status]
  );

  const {
    data: clients,
    isLoading,
    error,
    pagination,
    refetch,
  } = useApiGet<Client[]>("/api/clientes", { params });

  const rows = clients || [];
  const activeCount = rows.filter((client) => client.isActive).length;
  const inactiveCount = rows.filter((client) => !client.isActive).length;

  async function handleSubmit(payload: ClientPayload) {
    setIsSubmitting(true);
    setFormError(null);

    const response = selectedClient
      ? await apiPut<Client>(`/api/clientes/${selectedClient.id}`, payload)
      : await apiPost<Client>("/api/clientes", payload);

    setIsSubmitting(false);

    if (response.error) {
      setFormError(response.error);
      return;
    }

    setModalOpen(false);
    setSelectedClient(null);
    await refetch();
  }

  async function handleDelete(client: Client) {
    const response = await apiDelete(`/api/clientes/${client.id}`);
    if (!response.error) {
      await refetch();
    }
  }

  function openCreateModal() {
    setSelectedClient(null);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(client: Client) {
    setSelectedClient(client);
    setFormError(null);
    setModalOpen(true);
  }

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "name",
      header: "Cliente",
      render: (row) => {
        const client = row as unknown as Client;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{getInitials(client.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{client.name}</p>
              <p className="text-xs text-gray-500">{client.email || "Sem email"}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "phone",
      header: "Telefone",
      render: (row) => {
        const client = row as unknown as Client;
        return <span className="text-sm text-gray-600">{client.phone || "-"}</span>;
      },
    },
    {
      key: "birthDate",
      header: "Nascimento",
      render: (row) => {
        const client = row as unknown as Client;
        return <span className="text-sm text-gray-500">{client.birthDate || "-"}</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const client = row as unknown as Client;
        return <StatusBadge status={client.isActive ? "active" : "inactive"} />;
      },
    },
    {
      key: "actions",
      header: "",
      render: (row) => {
        const client = row as unknown as Client;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedClient(client);
                  setDetailOpen(true);
                }}
              >
                <Eye className="h-4 w-4" /> Ver perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditModal(client)}>
                <Edit className="h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(client)}>
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
        title="Clientes"
        description="Gerencie a base de clientes do seu estabelecimento."
        actions={
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        }
      />

      <Tabs value={status} onValueChange={(value) => {
        setPage(1);
        setStatus(value as "all" | "active" | "inactive");
      }}>
        <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <TabsList>
            <TabsTrigger value="all">Todos ({pagination?.total || rows.length})</TabsTrigger>
            <TabsTrigger value="active">Ativos ({activeCount})</TabsTrigger>
            <TabsTrigger value="inactive">Inativos ({inactiveCount})</TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Buscar clientes..."
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <TabsContent value={status}>
          <DataTable
            columns={columns}
            data={rows as unknown as Record<string, unknown>[]}
            isLoading={isLoading}
            emptyMessage="Nenhum cliente encontrado."
            rowKey={(row) => (row as unknown as Client).id}
            currentPage={page}
            totalPages={pagination?.totalPages || 1}
            onPageChange={setPage}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{selectedClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            <DialogDescription>Preencha os dados do cliente.</DialogDescription>
          </DialogHeader>
          <ClientForm
            initialValue={selectedClient as ClientFormValue | null}
            isSubmitting={isSubmitting}
            error={formError}
            onCancel={() => setModalOpen(false)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Perfil do Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">{getInitials(selectedClient.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-bold text-gray-900">{selectedClient.name}</p>
                  <StatusBadge status={selectedClient.isActive ? "active" : "inactive"} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" /> {selectedClient.email || "Sem email"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" /> {selectedClient.phone || "Sem telefone"}
                </div>
              </div>
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs font-semibold uppercase text-gray-400">Observacoes</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedClient.notes || "Nenhuma observacao cadastrada."}
                  </p>
                </CardContent>
              </Card>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDetailOpen(false)}>
                  Fechar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setDetailOpen(false);
                    openEditModal(selectedClient);
                  }}
                >
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
