"use client";

import React, { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  lastAppointment: string;
  status: "active" | "inactive";
  spent: string;
};

const clients: Client[] = [
  { id: "1", name: "Maria Santos", email: "maria@email.com", phone: "(11) 98765-4321", totalAppointments: 24, lastAppointment: "10/06/2025", status: "active", spent: "R$ 2.880" },
  { id: "2", name: "João Silva", email: "joao@email.com", phone: "(11) 97654-3210", totalAppointments: 18, lastAppointment: "08/06/2025", status: "active", spent: "R$ 1.440" },
  { id: "3", name: "Lucia Ferreira", email: "lucia@email.com", phone: "(11) 96543-2109", totalAppointments: 12, lastAppointment: "05/06/2025", status: "active", spent: "R$ 960" },
  { id: "4", name: "Pedro Costa", email: "pedro@email.com", phone: "(11) 95432-1098", totalAppointments: 8, lastAppointment: "01/06/2025", status: "inactive", spent: "R$ 640" },
  { id: "5", name: "Ana Oliveira", email: "ana@email.com", phone: "(11) 94321-0987", totalAppointments: 31, lastAppointment: "09/06/2025", status: "active", spent: "R$ 3.720" },
  { id: "6", name: "Roberto Lima", email: "roberto@email.com", phone: "(11) 93210-9876", totalAppointments: 6, lastAppointment: "28/05/2025", status: "inactive", spent: "R$ 480" },
];

export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [page, setPage] = useState(1);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

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
              <p className="text-xs text-gray-500">{client.email}</p>
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
        return <span className="text-sm text-gray-600">{client.phone}</span>;
      },
    },
    {
      key: "totalAppointments",
      header: "Agendamentos",
      render: (row) => {
        const client = row as unknown as Client;
        return (
          <span className="text-sm font-semibold text-gray-900">{client.totalAppointments}</span>
        );
      },
    },
    {
      key: "spent",
      header: "Total Gasto",
      render: (row) => {
        const client = row as unknown as Client;
        return (
          <span className="text-sm font-semibold text-emerald-600">{client.spent}</span>
        );
      },
    },
    {
      key: "lastAppointment",
      header: "Último Agendamento",
      render: (row) => {
        const client = row as unknown as Client;
        return <span className="text-sm text-gray-500">{client.lastAppointment}</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const client = row as unknown as Client;
        return <StatusBadge status={client.status} />;
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
              <DropdownMenuItem onClick={() => { setSelectedClient(client); setDetailOpen(true); }}>
                <Eye className="h-4 w-4" /> Ver perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedClient(client); setModalOpen(true); }}>
                <Edit className="h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
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
          <Button variant="primary" size="sm" onClick={() => { setSelectedClient(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        }
      />

      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <TabsList>
            <TabsTrigger value="all">Todos ({clients.length})</TabsTrigger>
            <TabsTrigger value="active">Ativos ({clients.filter((c) => c.status === "active").length})</TabsTrigger>
            <TabsTrigger value="inactive">Inativos ({clients.filter((c) => c.status === "inactive").length})</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Buscar clientes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <TabsContent value="all">
          <DataTable
            columns={columns}
            data={filtered as unknown as Record<string, unknown>[]}
            rowKey={(row) => (row as unknown as Client).id}
            currentPage={page}
            totalPages={Math.ceil(filtered.length / 10)}
            onPageChange={setPage}
          />
        </TabsContent>
        <TabsContent value="active">
          <DataTable
            columns={columns}
            data={filtered.filter((c) => c.status === "active") as unknown as Record<string, unknown>[]}
          />
        </TabsContent>
        <TabsContent value="inactive">
          <DataTable
            columns={columns}
            data={filtered.filter((c) => c.status === "inactive") as unknown as Record<string, unknown>[]}
          />
        </TabsContent>
      </Tabs>

      {/* New/Edit Client Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            <DialogDescription>Preencha os dados do cliente.</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nome" placeholder="Nome" defaultValue={selectedClient?.name.split(" ")[0]} />
              <Input label="Sobrenome" placeholder="Sobrenome" defaultValue={selectedClient?.name.split(" ")[1]} />
            </div>
            <Input label="Email" type="email" placeholder="email@exemplo.com" defaultValue={selectedClient?.email} />
            <Input label="Telefone" placeholder="(11) 99999-9999" defaultValue={selectedClient?.phone} />
            <Input label="Data de nascimento" type="date" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              {selectedClient ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Client Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Perfil do Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">{getInitials(selectedClient.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-bold text-gray-900">{selectedClient.name}</p>
                  <StatusBadge status={selectedClient.status} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" /> {selectedClient.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" /> {selectedClient.phone}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{selectedClient.totalAppointments}</p>
                    <p className="text-xs text-gray-500">Visitas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-lg font-bold text-emerald-600">{selectedClient.spent}</p>
                    <p className="text-xs text-gray-500">Gasto total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{selectedClient.lastAppointment}</p>
                    <p className="text-xs text-gray-500">Última visita</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Fechar</Button>
            <Button variant="primary" onClick={() => { setDetailOpen(false); setModalOpen(true); }}>
              Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
