"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, DollarSign, Edit, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { ServiceForm, type ServiceFormValue } from "@/components/forms/service-form";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
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
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useApiGet } from "@/hooks/use-api";

type Service = {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: string;
  category: string | null;
  color: string | null;
  isActive: boolean;
};

export default function ServicosPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useMemo(
    () => ({
      search: search || undefined,
      limit: 100,
    }),
    [search]
  );

  const { data: services, isLoading, error, refetch } = useApiGet<Service[]>("/api/servicos", {
    params,
  });

  const filtered = useMemo(() => {
    return (services || []).filter((service) => {
      return categoryFilter === "all" || service.category === categoryFilter;
    });
  }, [services, categoryFilter]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Service[]>>((acc, service) => {
      const category = service.category || "Outro";
      acc[category] = acc[category] || [];
      acc[category].push(service);
      return acc;
    }, {});
  }, [filtered]);

  async function handleSubmit(payload: Parameters<typeof ServiceForm>[0]["onSubmit"] extends (value: infer V) => unknown ? V : never) {
    setIsSubmitting(true);
    setFormError(null);

    const response = editService
      ? await apiPut<Service>(`/api/servicos/${editService.id}`, payload)
      : await apiPost<Service>("/api/servicos", payload);

    setIsSubmitting(false);

    if (response.error) {
      setFormError(response.error);
      return;
    }

    setModalOpen(false);
    setEditService(null);
    await refetch();
  }

  async function handleDelete(service: Service) {
    const response = await apiDelete(`/api/servicos/${service.id}`);
    if (!response.error) {
      await refetch();
    }
  }

  function openCreateModal() {
    setFormError(null);
    setEditService(null);
    setModalOpen(true);
  }

  function openEditModal(service: Service) {
    setFormError(null);
    setEditService(service);
    setModalOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Servicos"
        description="Configure os servicos oferecidos pelo seu estabelecimento."
        actions={
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Novo Servico
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Buscar servicos..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-auto min-w-[160px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {SERVICE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
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
            <Skeleton key={index} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-gray-500">
            Nenhum servico encontrado.
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([category, categoryServices]) => (
          <div key={category} className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-700">{category}</h2>
              <Badge variant="secondary">{categoryServices.length}</Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {categoryServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card className="transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-xl"
                            style={{ backgroundColor: `${service.color || "#7c3aed"}22` }}
                          >
                            <div
                              className="m-3 h-4 w-4 rounded-full"
                              style={{ backgroundColor: service.color || "#7c3aed" }}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.category || "Sem categoria"}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(service)}>
                              <Edit className="h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(service)}>
                              <Trash2 className="h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="mb-3 min-h-[32px] text-xs leading-relaxed text-gray-500">
                        {service.description || "Sem descricao cadastrada."}
                      </p>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            {service.duration} min
                          </div>
                          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                            {formatCurrency(Number(service.price))}
                          </div>
                        </div>
                        <StatusBadge status={service.isActive ? "active" : "inactive"} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{editService ? "Editar Servico" : "Novo Servico"}</DialogTitle>
            <DialogDescription>Configure preco, duracao e visibilidade do servico.</DialogDescription>
          </DialogHeader>
          <ServiceForm
            initialValue={editService as ServiceFormValue | null}
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
