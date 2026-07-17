"use client";

import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export type EmployeeFormService = {
  id: string;
  name: string;
};

export type EmployeeFormValue = {
  id?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  isActive?: boolean | null;
  serviceIds?: string[];
};

type EmployeeFormProps = {
  initialValue?: EmployeeFormValue | null;
  services: EmployeeFormService[];
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (payload: {
    name: string;
    email?: string;
    phone?: string;
    role?: string;
    isActive: boolean;
    serviceIds: string[];
  }) => Promise<void> | void;
};

export function EmployeeForm({
  initialValue,
  services,
  isSubmitting,
  error,
  onCancel,
  onSubmit,
}: EmployeeFormProps) {
  const [isActive, setIsActive] = useState(initialValue?.isActive ?? true);
  const [serviceIds, setServiceIds] = useState<string[]>(initialValue?.serviceIds || []);

  function toggleService(serviceId: string) {
    setServiceIds((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await onSubmit({
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      role: String(formData.get("role") || "").trim(),
      isActive,
      serviceIds,
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
        placeholder="Ex: Ana Lima"
        defaultValue={initialValue?.name || ""}
        required
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="profissional@email.com"
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
        name="role"
        label="Cargo"
        placeholder="Ex: Cabeleireira senior"
        defaultValue={initialValue?.role || ""}
      />

      <div>
        <Label className="mb-2 block">Servicos que atende</Label>
        <div className="grid max-h-40 gap-2 overflow-auto rounded-lg border border-gray-200 p-3 sm:grid-cols-2">
          {services.length === 0 ? (
            <p className="text-sm text-gray-500">Cadastre servicos antes de vincular.</p>
          ) : (
            services.map((service) => (
              <label key={service.id} className="flex items-center gap-2 text-sm text-gray-700">
                <Checkbox
                  checked={serviceIds.includes(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                />
                {service.name}
              </label>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5">
        <div>
          <Label htmlFor="employee-active">Funcionario ativo</Label>
          <p className="text-xs text-gray-500">Profissionais inativos nao aparecem na pagina publica.</p>
        </div>
        <Switch id="employee-active" checked={isActive} onCheckedChange={setIsActive} />
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
