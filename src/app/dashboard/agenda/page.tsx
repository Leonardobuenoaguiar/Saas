"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  endOfWeek,
  format,
  getDay,
  parseISO,
  startOfWeek,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Grid3x3,
  List,
  Plus,
  Trash2,
} from "lucide-react";
import { AppointmentForm, type AppointmentFormValue } from "@/components/forms/appointment-form";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiDelete, apiPost, apiPut } from "@/lib/api";
import { cn, getInitials } from "@/lib/utils";
import { useApiGet } from "@/hooks/use-api";

const HOURS = Array.from({ length: 12 }, (_, index) => index + 8);
const DAY_LABELS = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"];

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

type Appointment = {
  id: string;
  clientId: string | null;
  employeeId: string | null;
  serviceId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  price: string;
  status: AppointmentStatus;
  notes: string | null;
  clientName: string | null;
  clientPhone: string | null;
  serviceName: string | null;
  serviceColor: string | null;
  employeeName: string | null;
};

type Client = {
  id: string;
  name: string;
};

type Service = {
  id: string;
  name: string;
  duration: number;
  price: string;
};

type Employee = {
  id: string;
  name: string;
};

type AppointmentPayload = {
  clientId?: string;
  employeeId: string;
  serviceId: string;
  date: string;
  startTime: string;
  notes?: string;
};

export default function AgendaPage() {
  const [view, setView] = useState<"week" | "list">("week");
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const appointmentParams = useMemo(
    () => ({
      from: format(weekStart, "yyyy-MM-dd"),
      to: format(weekEnd, "yyyy-MM-dd"),
      limit: 100,
    }),
    [weekStart, weekEnd]
  );

  const { data: appointments, isLoading, error, refetch } = useApiGet<Appointment[]>("/api/agendamentos", {
    params: appointmentParams,
  });
  const { data: clients } = useApiGet<Client[]>("/api/clientes", { params: { limit: 100, status: "active" } });
  const { data: services } = useApiGet<Service[]>("/api/servicos", { params: { limit: 100, status: "active" } });
  const { data: employees } = useApiGet<Employee[]>("/api/funcionarios", { params: { limit: 100, status: "active" } });

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
    [weekStart]
  );

  const appointmentRows = appointments || [];
  const weekLabel = `${format(weekStart, "dd MMM", { locale: ptBR })} - ${format(weekEnd, "dd MMM yyyy", {
    locale: ptBR,
  })}`;

  async function handleSubmit(payload: AppointmentPayload) {
    setIsSubmitting(true);
    setFormError(null);

    const response = selectedAppointment
      ? await apiPut<Appointment>(`/api/agendamentos/${selectedAppointment.id}`, payload)
      : await apiPost<Appointment>("/api/agendamentos", payload);

    setIsSubmitting(false);

    if (response.error) {
      setFormError(response.error);
      return;
    }

    setModalOpen(false);
    setSelectedAppointment(null);
    await refetch();
  }

  async function updateStatus(appointment: Appointment, status: AppointmentStatus) {
    const response = await apiPut<Appointment>(`/api/agendamentos/${appointment.id}`, { status });
    if (!response.error) {
      setDetailOpen(false);
      setSelectedAppointment(null);
      await refetch();
    }
  }

  async function handleDelete(appointment: Appointment) {
    const response = await apiDelete(`/api/agendamentos/${appointment.id}`);
    if (!response.error) {
      setDetailOpen(false);
      setSelectedAppointment(null);
      await refetch();
    }
  }

  function openCreateModal() {
    setSelectedAppointment(null);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(appointment: Appointment) {
    setSelectedAppointment(appointment);
    setFormError(null);
    setDetailOpen(false);
    setModalOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Agenda"
        description="Visualize e gerencie todos os agendamentos."
        actions={
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        }
      />

      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => setWeekStart((date) => subDays(date, 7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[210px] text-center text-sm font-semibold text-gray-900">{weekLabel}</span>
          <Button variant="outline" size="icon-sm" onClick={() => setWeekStart((date) => addDays(date, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            Hoje
          </Button>
        </div>

        <div className="flex rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setView("week")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
              view === "week" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Grid3x3 className="h-3.5 w-3.5" />
            Semana
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors",
              view === "list" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <List className="h-3.5 w-3.5" />
            Lista
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {view === "week" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-8 border-b border-gray-100">
                <div className="p-3 text-center text-xs text-gray-400" />
                {days.map((day, index) => (
                  <div key={day.toISOString()} className="border-l border-gray-100 p-3 text-center">
                    <p className="text-xs font-medium text-gray-500">{DAY_LABELS[index]}</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">{format(day, "dd/MM")}</p>
                  </div>
                ))}
              </div>

              {HOURS.map((hour) => (
                <div key={hour} className="grid min-h-[64px] grid-cols-8 border-b border-gray-50">
                  <div className="flex items-start justify-end px-3 py-2">
                    <span className="text-xs font-medium text-gray-400">{hour}:00</span>
                  </div>
                  {days.map((day) => {
                    const slotAppointments = appointmentRows.filter((appointment) => {
                      const date = parseISO(`${appointment.date}T00:00:00`);
                      const startHour = Number(appointment.startTime.slice(0, 2));
                      return getDay(date) === getDay(day) && appointment.date === format(day, "yyyy-MM-dd") && startHour === hour;
                    });

                    return (
                      <div key={day.toISOString()} className="border-l border-gray-100 p-1" onClick={openCreateModal}>
                        {isLoading ? (
                          <div className="h-10 animate-pulse rounded-md bg-gray-100" />
                        ) : (
                          slotAppointments.map((appointment) => (
                            <motion.div
                              key={appointment.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedAppointment(appointment);
                                setDetailOpen(true);
                              }}
                              className="cursor-pointer rounded-md border px-2 py-1 text-xs transition-opacity hover:opacity-90"
                              style={{
                                borderColor: appointment.serviceColor || "#7c3aed",
                                backgroundColor: `${appointment.serviceColor || "#7c3aed"}18`,
                                color: "#111827",
                              }}
                            >
                              <p className="truncate font-semibold">{appointment.clientName || "Cliente"}</p>
                              <p className="truncate text-gray-500">{appointment.serviceName || "Servico"}</p>
                            </motion.div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {days.map((day) => {
            const dayAppointments = appointmentRows.filter((appointment) => appointment.date === format(day, "yyyy-MM-dd"));

            return (
              <Card key={day.toISOString()}>
                <CardHeader className="px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {format(day, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </p>
                      <Badge variant="primary">{dayAppointments.length} agendamentos</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {dayAppointments.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">Nenhum agendamento</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {dayAppointments.map((appointment) => (
                        <button
                          key={appointment.id}
                          className="flex w-full items-center gap-4 px-6 py-3.5 text-left transition-colors hover:bg-gray-50"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setDetailOpen(true);
                          }}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="text-xs">
                              {getInitials(appointment.clientName || "Cliente")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {appointment.clientName || "Cliente"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {appointment.serviceName || "Servico"} - {appointment.employeeName || "Profissional"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="text-xs">{appointment.startTime}</span>
                            </div>
                            <StatusBadge status={appointment.status} />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>{selectedAppointment ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
            <DialogDescription>Preencha os dados do agendamento.</DialogDescription>
          </DialogHeader>
          <AppointmentForm
            initialValue={selectedAppointment as AppointmentFormValue | null}
            clients={clients || []}
            services={services || []}
            employees={employees || []}
            isSubmitting={isSubmitting}
            error={formError}
            onCancel={() => setModalOpen(false)}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{getInitials(selectedAppointment.clientName || "Cliente")}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{selectedAppointment.clientName || "Cliente"}</p>
                  <p className="text-sm text-gray-500">{selectedAppointment.serviceName || "Servico"}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <DetailRow label="Profissional" value={selectedAppointment.employeeName || "-"} />
                <DetailRow label="Data" value={selectedAppointment.date} />
                <DetailRow label="Horario" value={`${selectedAppointment.startTime} - ${selectedAppointment.endTime}`} />
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <StatusBadge status={selectedAppointment.status} />
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(selectedAppointment)}>
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateStatus(selectedAppointment, "completed")}>
                  Concluir
                </Button>
                <Button variant="destructive" size="sm" onClick={() => updateStatus(selectedAppointment, "cancelled")}>
                  Cancelar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(selectedAppointment)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
