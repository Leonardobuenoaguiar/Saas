"use client";

import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export type ClientFormValue = {
  id?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  notes?: string | null;
  isActive?: boolean | null;
};

type ClientFormProps = {
  initialValue?: ClientFormValue | null;
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (payload: {
    name: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    notes?: string;
    isActive: boolean;
  }) => Promise<void> | void;
};

export function ClientForm({
  initialValue,
  isSubmitting,
  error,
  onCancel,
  onSubmit,
}: ClientFormProps) {
  const [isActive, setIsActive] = useState(initialValue?.isActive ?? true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await onSubmit({
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      birthDate: String(formData.get("birthDate") || ""),
      notes: String(formData.get("notes") || "").trim(),
      isActive,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <Input
        name="name"
        label="Nome completo"
        placeholder="Ex: Maria Santos"
        defaultValue={initialValue?.name || ""}
        required
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="cliente@email.com"
          defaultValue={initialValue?.email || ""}
        />
        <Input
          name="phone"
          label="Telefone"
          placeholder="(11) 99999-9999"
          defaultValue={initialValue?.phone || ""}
        />
      </div>

      <Input
        name="birthDate"
        label="Data de nascimento"
        type="date"
        defaultValue={initialValue?.birthDate || ""}
      />

      <Textarea
        name="notes"
        label="Observacoes"
        placeholder="Preferencias, restricoes ou historico relevante"
        defaultValue={initialValue?.notes || ""}
        rows={3}
      />

      <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5">
        <div>
          <Label htmlFor="client-active">Cliente ativo</Label>
          <p className="text-xs text-gray-500">Clientes inativos ficam ocultos em filtros operacionais.</p>
        </div>
        <Switch id="client-active" checked={isActive} onCheckedChange={setIsActive} />
      </div>

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
