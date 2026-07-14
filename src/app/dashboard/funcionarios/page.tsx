"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreHorizontal, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/lib/utils";

const employees = [
  {
    id: "1", name: "Ana Lima", email: "ana@flowbook.com", phone: "(11) 99999-0001",
    role: "Cabeleireira Sênior", status: "active" as const,
    services: ["Corte", "Coloração", "Escova"], appointments: 142, rating: 4.9,
  },
  {
    id: "2", name: "Carlos Souza", email: "carlos@flowbook.com", phone: "(11) 99999-0002",
    role: "Barbeiro", status: "active" as const,
    services: ["Barba", "Corte Masculino"], appointments: 98, rating: 4.8,
  },
  {
    id: "3", name: "Paula Costa", email: "paula@flowbook.com", phone: "(11) 99999-0003",
    role: "Manicure / Pedicure", status: "active" as const,
    services: ["Manicure", "Pedicure", "Gel"], appointments: 87, rating: 4.7,
  },
  {
    id: "4", name: "Roberto Martins", email: "roberto@flowbook.com", phone: "(11) 99999-0004",
    role: "Cabeleireiro", status: "inactive" as const,
    services: ["Corte", "Escova"], appointments: 34, rating: 4.5,
  },
];

export default function FuncionariosPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<typeof employees[0] | null>(null);

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Funcionários"
        description="Gerencie sua equipe e configure serviços por profissional."
        actions={
          <Button variant="primary" size="sm" onClick={() => { setEditEmployee(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4" />
            Novo Funcionário
          </Button>
        }
      />

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Buscar funcionários..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <Select>
          <SelectTrigger className="w-auto min-w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((employee, i) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-sm">{getInitials(employee.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setEditEmployee(employee); setModalOpen(true); }}>
                        <Edit className="h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 className="h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    {employee.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                    {employee.phone}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {employee.services.map((service) => (
                    <Badge key={service} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{employee.appointments}</p>
                    <p className="text-xs text-gray-400">Agendamentos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">⭐ {employee.rating}</p>
                    <p className="text-xs text-gray-400">Avaliação</p>
                  </div>
                  <StatusBadge status={employee.status} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editEmployee ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
            <DialogDescription>
              {editEmployee ? "Atualize os dados do profissional." : "Adicione um novo membro à equipe."}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nome" placeholder="Nome" defaultValue={editEmployee?.name.split(" ")[0]} />
              <Input label="Sobrenome" placeholder="Sobrenome" defaultValue={editEmployee?.name.split(" ")[1]} />
            </div>
            <Input label="Email" type="email" placeholder="email@exemplo.com" defaultValue={editEmployee?.email} />
            <Input label="Telefone" placeholder="(11) 99999-9999" defaultValue={editEmployee?.phone} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cargo</label>
              <Select defaultValue={editEmployee?.role.toLowerCase()}>
                <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cabeleireira">Cabeleireira</SelectItem>
                  <SelectItem value="barbeiro">Barbeiro</SelectItem>
                  <SelectItem value="manicure">Manicure / Pedicure</SelectItem>
                  <SelectItem value="esteticista">Esteticista</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="status" defaultChecked={editEmployee?.status === "active"} />
              <Label htmlFor="status">Funcionário ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              {editEmployee ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
