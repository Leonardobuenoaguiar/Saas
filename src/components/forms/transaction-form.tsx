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
import { PAYMENT_METHODS, TRANSACTION_CATEGORIES } from "@/lib/constants";

export type TransactionFormValue = {
  id?: string;
  description?: string | null;
  amount?: string | number | null;
  type?: "income" | "expense" | null;
  category?: string | null;
  paymentMethod?: string | null;
  date?: string | null;
  status?: "completed" | "pending" | "cancelled" | null;
};

type TransactionFormProps = {
  initialValue?: TransactionFormValue | null;
  isSubmitting?: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (payload: {
    description: string;
    amount: number;
    type: "income" | "expense";
    category?: string;
    paymentMethod?: string;
    date: string;
    status: "completed" | "pending" | "cancelled";
  }) => Promise<void> | void;
};

export function TransactionForm({
  initialValue,
  isSubmitting,
  error,
  onCancel,
  onSubmit,
}: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">(initialValue?.type || "income");
  const [category, setCategory] = useState(initialValue?.category || TRANSACTION_CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = useState(initialValue?.paymentMethod || PAYMENT_METHODS[0]);
  const [status, setStatus] = useState<"completed" | "pending" | "cancelled">(
    initialValue?.status || "completed"
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await onSubmit({
      description: String(formData.get("description") || "").trim(),
      amount: Number(formData.get("amount") || 0),
      type,
      category,
      paymentMethod,
      date: String(formData.get("date") || ""),
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label className="mb-1.5 block">Tipo</Label>
          <Select value={type} onValueChange={(value) => setType(value as "income" | "expense")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Receita</SelectItem>
              <SelectItem value="expense">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as "completed" | "pending" | "cancelled")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Concluida</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Input
        name="description"
        label="Descricao"
        placeholder="Ex: Corte - Maria Santos"
        defaultValue={initialValue?.description || ""}
        required
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          name="amount"
          label="Valor (R$)"
          type="number"
          min={0}
          step="0.01"
          defaultValue={initialValue?.amount ? Number(initialValue.amount) : 0}
          required
        />
        <Input
          name="date"
          label="Data"
          type="date"
          defaultValue={initialValue?.date || new Date().toISOString().slice(0, 10)}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label className="mb-1.5 block">Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block">Metodo</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
