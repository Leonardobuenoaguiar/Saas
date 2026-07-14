"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Filter,
  Grid3x3,
  List,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { getInitials } from "@/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);
const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const appointments = [
  {
    id: "1", client: "Maria Santos", service: "Corte e Escova", employee: "Ana Lima",
    day: 0, hour: 9, duration: 2, status: "confirmed" as const, color: "bg-violet-100 border-violet-300 text-violet-800",
  },
  {
    id: "2", client: "João Silva", service: "Barba", employee: "Carlos Souza",
    day: 0, hour: 10, duration: 1, status: "confirmed" as const, color: "bg-blue-100 border-blue-300 text-blue-800",
  },
  {
    id: "3", client: "Lucia Ferreira", service: "Manicure", employee: "Paula Costa",
    day: 1, hour: 11, duration: 1, status: "pending" as const, color: "bg-amber-100 border-amber-300 text-amber-800",
  },
  {
    id: "4", client: "Pedro Costa", service: "Corte", employee: "Ana Lima",
    day: 2, hour: 14, duration: 1, status: "confirmed" as const, color: "bg-emerald-100 border-emerald-300 text-emerald-800",
  },
  {
    id: "5", client: "Ana Oliveira", service: "Coloração", employee: "Paula Costa",
    day: 3, hour: 10, duration: 3, status: "confirmed" as const, color: "bg-pink-100 border-pink-300 text-pink-800",
  },
  {
    id: "6", client: "Roberto Lima", service: "Corte", employee: "Carlos Souza",
    day: 4, hour: 9, duration: 1, status: "cancelled" as const, color: "bg-red-100 border-red-300 text-red-800",
  },
  {
    id: "7", client: "Fernanda Ramos", service: "Escova", employee: "Ana Lima",
    day: 5, hour: 13, duration: 2, status: "confirmed" as const, color: "bg-violet-100 border-violet-300 text-violet-800",
  },
];

export default function AgendaPage() {
  const [view, setView] = useState<"week" | "list">("week");
  const [newApptOpen, setNewApptOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<typeof appointments[0] | null>(null);
  const [currentWeek, setCurrentWeek] = useState("10 - 16 de Junho, 2025");

  return (
    <div>
      <PageHeader
        title="Agenda"
        description="Visualize e gerencie todos os agendamentos."
        actions={
          <Button variant="primary" size="sm" onClick={() => setNewApptOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        }
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => {}}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-gray-900 min-w-[200px] text-center">
            {currentWeek}
          </span>
          <Button variant="outline" size="icon-sm" onClick={() => {}}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            Hoje
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setView("week")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${view === "week" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <Grid3x3 className="h-3.5 w-3.5" />
              Semana
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${view === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              <List className="h-3.5 w-3.5" />
              Lista
            </button>
          </div>
        </div>
      </div>

      {view === "week" ? (
        /* Week View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-8 border-b border-gray-100">
                <div className="p-3 text-xs text-gray-400 text-center" />
                {DAYS.map((day, i) => (
                  <div
                    key={day}
                    className={`p-3 text-center border-l border-gray-100 ${i === 0 ? "bg-violet-50" : ""}`}
                  >
                    <p className="text-xs font-medium text-gray-500">{day}</p>
                    <p className={`text-sm font-bold mt-0.5 ${i === 0 ? "text-violet-600" : "text-gray-900"}`}>
                      {10 + i}
                    </p>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-gray-50 min-h-[60px]">
                  <div className="px-3 py-2 flex items-start justify-end">
                    <span className="text-xs text-gray-400 font-medium">{hour}:00</span>
                  </div>
                  {DAYS.map((_, dayIdx) => {
                    const dayAppts = appointments.filter(
                      (a) => a.day === dayIdx && a.hour === hour
                    );
                    return (
                      <div
                        key={dayIdx}
                        className="border-l border-gray-100 p-1 relative"
                        onClick={() => setNewApptOpen(true)}
                      >
                        {dayAppts.map((appt) => (
                          <motion.div
                            key={appt.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppt(appt);
                            }}
                            className={`rounded-md border px-2 py-1 cursor-pointer hover:opacity-90 transition-opacity ${appt.color}`}
                            style={{ minHeight: `${appt.duration * 56}px` }}
                          >
                            <p className="text-xs font-semibold leading-tight truncate">{appt.client}</p>
                            <p className="text-xs opacity-75 truncate">{appt.service}</p>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        /* List View */
        <div className="space-y-3">
          {DAYS.slice(0, 5).map((day, dayIdx) => {
            const dayAppts = appointments.filter((a) => a.day === dayIdx);
            return (
              <Card key={day}>
                <CardHeader className="py-3 px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{day}, {10 + dayIdx} de Junho</p>
                      <Badge variant="primary">{dayAppts.length} agendamentos</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {dayAppts.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">Nenhum agendamento</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {dayAppts.map((appt) => (
                        <div
                          key={appt.id}
                          className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedAppt(appt)}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">{getInitials(appt.client)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{appt.client}</p>
                            <p className="text-xs text-gray-500">{appt.service} · {appt.employee}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="text-xs">{appt.hour}:00</span>
                            </div>
                            <StatusBadge status={appt.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* New Appointment Modal */}
      <Dialog open={newApptOpen} onOpenChange={setNewApptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>Preencha os dados do agendamento.</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <Input label="Cliente" placeholder="Nome ou busque um cliente..." />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Serviço</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione o serviço" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="corte">Corte Feminino</SelectItem>
                  <SelectItem value="coloracao">Coloração</SelectItem>
                  <SelectItem value="manicure">Manicure</SelectItem>
                  <SelectItem value="barba">Barba</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Profissional</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione o profissional" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ana">Ana Lima</SelectItem>
                  <SelectItem value="carlos">Carlos Souza</SelectItem>
                  <SelectItem value="paula">Paula Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Data" type="date" />
              <Input label="Horário" type="time" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewApptOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => setNewApptOpen(false)}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appointment Detail Modal */}
      <Dialog open={!!selectedAppt} onOpenChange={() => setSelectedAppt(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {selectedAppt && (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{getInitials(selectedAppt.client)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{selectedAppt.client}</p>
                  <p className="text-sm text-gray-500">{selectedAppt.service}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Profissional</span>
                  <span className="font-medium text-gray-900">{selectedAppt.employee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Horário</span>
                  <span className="font-medium text-gray-900">{selectedAppt.hour}:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <StatusBadge status={selectedAppt.status} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedAppt(null)}>Fechar</Button>
            <Button variant="destructive" size="sm">Cancelar</Button>
            <Button variant="primary" size="sm">Editar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
