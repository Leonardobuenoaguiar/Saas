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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_CATEGORIES, SERVICE_COLORS } from "@/lib/constants";

export type ServiceFormValue = {
  id?: string;
  name?: string | null;
  description?: string | null;
  duration?: number | null;
  price?: string | number | null;
  category?: string | null;
  color?: string | null;
  isActive?: boolean | null;
};

type ServiceFormProps = {
  initialValue?: ServiceFormValue | null;
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (payload: {
    name: string;
    description?: string;
    duration: number;
    price: number;
    category?: string;
    color?: string;
    isActive: boolean;
  }) => Promise<void> | void;
};

export function ServiceForm({
  initialValue,
  isSubmitting,
  error,
  onCancel,
  onSubmit,
}: ServiceFormProps) {
  const [category, setCategory] = useState(initialValue?.category || "Outro");
  const [color, setColor] = useState(initialValue?.color || SERVICE_COLORS[0]);
  const [isActive, setIsActive] = useState(initialValue?.isActive ?? true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await onSubmit({
      name: String(formData.get("name") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      duration: Number(formData.get("duration") || 0),
      price: Number(formData.get("price") || 0),
      category,
      color,
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
        label="Nome do servico"
        placeholder="Ex: Corte feminino"
        defaultValue={initialValue?.name || ""}
        required
      />
      <Textarea
        name="description"
        label="Descricao"
        placeholder="Descreva o que esta incluso"
        defaultValue={initialValue?.description || ""}
        rows={3}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          name="duration"
          label="Duracao (min)"
          type="number"
          min={5}
          max={480}
          step={5}
          defaultValue={initialValue?.duration || 60}
          required
        />
        <Input
          name="price"
          label="Preco (R$)"
          type="number"
          min={0}
          step="0.01"
          defaultValue={initialValue?.price ? Number(initialValue.price) : 0}
          required
        />
      </div>

      <div>
        <Label className="mb-1.5 block">Categoria</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_CATEGORIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Cor</Label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_COLORS.map((item) => (
            <button
              key={item}
              type="button"
              aria-label={`Selecionar cor ${item}`}
              onClick={() => setColor(item)}
              className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-105"
              style={{
                backgroundColor: item,
                borderColor: color === item ? "#111827" : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5">
        <div>
          <Label htmlFor="service-active">Servico ativo</Label>
          <p className="text-xs text-gray-500">Servicos inativos nao aparecem na pagina publica.</p>
        </div>
        <Switch id="service-active" checked={isActive} onCheckedChange={setIsActive} />
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
