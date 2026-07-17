"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Mail, MoreHorizontal, Phone, Plus, Search, Trash2 } from "lucide-react";
import { EmployeeForm, type EmployeeFormValue } from "@/components/forms/employee-form";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { apiDelete, apiPost, apiPut } from "@/lib/api";
import { getInitials } from "@/lib/utils";
import { useApiGet } from "@/hooks/use-api";

type Employee = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  serviceIds: string[];
  services: string[];
};

type Service = {
  id: string;
  name: string;
};

type EmployeePayload = {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive: boolean;
  serviceIds: string[];
};

export default function FuncionariosPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employeeParams = useMemo(
    () => ({
      search: search || undefined,
      status: status === "all" ? undefined : status,
      limit: 100,
    }),
    [search, status]
  );

  const { data: employees, isLoading, error, refetch } = useApiGet<Employee[]>("/api/funcionarios", {
    params: employeeParams,
  });
  const { data: services } = useApiGet<Service[]>("/api/servicos", {
    params: { limit: 100, status: "active" },
  });

  async function handleSubmit(payload: EmployeePayload) {
    setIsSubmitting(true);
    setFormError(null);

    const response = editEmployee
      ? await apiPut<Employee>(`/api/funcionarios/${editEmployee.id}`, payload)
      : await apiPost<Employee>("/api/funcionarios", payload);

    setIsSubmitting(false);

    if (response.error) {
      setFormError(response.error);
      return;
    }

    setModalOpen(false);
    setEditEmployee(null);
    await refetch();
  }

  async function handleDelete(employee: Employee) {
    const response = await apiDelete(`/api/funcionarios/${employee.id}`);
    if (!response.error) {
      await refetch();
    }
  }

  function openCreateModal() {
    setEditEmployee(null);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(employee: Employee) {
    setEditEmployee(employee);
    setFormError(null);
    setModalOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Funcionarios"
        description="Gerencie sua equipe e configure servicos por profissional."
        actions={
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Novo Funcionario
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Buscar funcionarios..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
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

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : (employees || []).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-gray-500">
            Nenhum funcionario encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(employees || []).map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-sm">{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.role || "Profissional"}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(employee)}>
                          <Edit className="h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(employee)}>
                          <Trash2 className="h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      {employee.email || "Sem email"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      {employee.phone || "Sem telefone"}
                    </div>
                  </div>

                  <div className="mb-4 flex min-h-8 flex-wrap gap-1.5">
                    {employee.services.length > 0 ? (
                      employee.services.map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">Sem servicos vinculados</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-400">{employee.services.length} servicos</span>
                    <StatusBadge status={employee.isActive ? "active" : "inactive"} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{editEmployee ? "Editar Funcionario" : "Novo Funcionario"}</DialogTitle>
            <DialogDescription>
              {editEmployee ? "Atualize os dados do profissional." : "Adicione um novo membro a equipe."}
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            initialValue={editEmployee as EmployeeFormValue | null}
            services={services || []}
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
