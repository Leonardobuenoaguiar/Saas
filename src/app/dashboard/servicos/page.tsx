"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Clock, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  status: "active" | "inactive";
  color: string;
  count: number;
};

const services: Service[] = [
  { id: "1", name: "Corte Feminino", description: "Corte moderno com acabamento profissional", duration: 60, price: 80, category: "Cabelo", status: "active", color: "bg-violet-100", count: 89 },
  { id: "2", name: "Coloração", description: "Coloração completa com produtos premium", duration: 180, price: 200, category: "Cabelo", status: "active", color: "bg-pink-100", count: 67 },
  { id: "3", name: "Escova", description: "Escova modeladora com secador profissional", duration: 45, price: 60, category: "Cabelo", status: "active", color: "bg-purple-100", count: 54 },
  { id: "4", name: "Manicure", description: "Manicure com esmaltação especial", duration: 45, price: 40, category: "Unhas", status: "active", color: "bg-rose-100", count: 102 },
  { id: "5", name: "Pedicure", description: "Pedicure completa com hidratação", duration: 60, price: 50, category: "Unhas", status: "active", color: "bg-orange-100", count: 78 },
  { id: "6", name: "Barba", description: "Corte e modelagem de barba", duration: 30, price: 35, category: "Masculino", status: "active", color: "bg-blue-100", count: 43 },
  { id: "7", name: "Corte Masculino", description: "Corte masculino com navalhinha", duration: 40, price: 50, category: "Masculino", status: "active", color: "bg-cyan-100", count: 61 },
  { id: "8", name: "Gel nas Unhas", description: "Aplicação de gel para maior durabilidade", duration: 90, price: 90, category: "Unhas", status: "inactive", color: "bg-amber-100", count: 28 },
];

const categories = [...new Set(services.map((s) => s.category))];

export default function ServicosPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = filtered.filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div>
      <PageHeader
        title="Serviços"
        description="Configure os serviços oferecidos pelo seu estabelecimento."
        actions={
          <Button variant="primary" size="sm" onClick={() => { setEditService(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4" />
            Novo Serviço
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Buscar serviços..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-auto min-w-[140px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {Object.entries(grouped).map(([category, catServices]) => (
        catServices.length > 0 && (
          <div key={category} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-sm font-semibold text-gray-700">{category}</h2>
              <Badge variant="secondary">{catServices.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {catServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-all duration-200">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl ${service.color} flex items-center justify-center text-lg`}>
                            ✂️
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.count} realizados/mês</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditService(service); setModalOpen(true); }}>
                              <Edit className="h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{service.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            {service.duration} min
                          </div>
                          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                            {formatCurrency(service.price)}
                          </div>
                        </div>
                        <StatusBadge status={service.status} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )
      ))}

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editService ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
            <DialogDescription>Configure os detalhes do serviço.</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <Input label="Nome do serviço" placeholder="Ex: Corte Feminino" defaultValue={editService?.name} />
            <Textarea label="Descrição" placeholder="Descreva o serviço..." defaultValue={editService?.description} rows={2} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Duração (minutos)" type="number" placeholder="60" defaultValue={editService?.duration} />
              <Input label="Preço (R$)" type="number" placeholder="80,00" defaultValue={editService?.price} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
              <Select defaultValue={editService?.category.toLowerCase()}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cabelo">Cabelo</SelectItem>
                  <SelectItem value="unhas">Unhas</SelectItem>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="estetica">Estética</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="service-active" defaultChecked={editService?.status !== "inactive"} />
              <Label htmlFor="service-active">Serviço ativo</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              {editService ? "Salvar" : "Criar Serviço"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
