"use client";

import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export type AppointmentFormClient = {
  id: string;
  name: string;
};

export type AppointmentFormService = {
  id: string;
  name: string;
  duration: number;
  price: string;
};

export type AppointmentFormEmployee = {
  id: string;
  name: string;
};

export type AppointmentFormValue = {
  id?: string;
  clientId?: string | null;
  employeeId?: string | null;
  serviceId?: string | null;
  date?: string | null;
  startTime?: string | null;
  notes?: string | null;
};

type AppointmentFormProps = {
  initialValue?: AppointmentFormValue | null;
  clients: AppointmentFormClient[];
  services: AppointmentFormService[];
  employees: AppointmentFormEmployee[];
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (payload: {
    clientId?: string;
    employeeId: string;
    serviceId: string;
    date: string;
    startTime: string;
    notes?: string;
  }) => Promise<void> | void;
};

export function AppointmentForm({
  initialValue,
  clients,
  services,
  employees,
  isSubmitting,
  error,
  onCancel,
  onSubmit,
}: AppointmentFormProps) {
  const [clientId, setClientId] = useState(initialValue?.clientId || "");
  const [serviceId, setServiceId] = useState(initialValue?.serviceId || "");
  const [employeeId, setEmployeeId] = useState(initialValue?.employeeId || "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await onSubmit({
      clientId: clientId || undefined,
      serviceId,
      employeeId,
      date: String(formData.get("date") || ""),
      startTime: String(formData.get("startTime") || ""),
      notes: String(formData.get("notes") || "").trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <Label className="mb-1.5 block">Cliente</Label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 block">Servico</Label>
        <Select value={serviceId} onValueChange={setServiceId} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o servico" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name} - {service.duration} min
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1.5 block">Profissional</Label>
        <Select value={employeeId} onValueChange={setEmployeeId} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o profissional" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          name="date"
          label="Data"
          type="date"
          defaultValue={initialValue?.date || new Date().toISOString().slice(0, 10)}
          required
        />
        <Input
          name="startTime"
          label="Horario"
          type="time"
          defaultValue={initialValue?.startTime || "09:00"}
          required
        />
      </div>

      <Textarea
        name="notes"
        label="Observacoes"
        placeholder="Detalhes importantes do atendimento"
        defaultValue={initialValue?.notes || ""}
        rows={3}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </div>
    </form>
  );
}
