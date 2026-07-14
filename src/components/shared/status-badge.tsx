"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";

type StatusType =
  | "active"
  | "inactive"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed"
  | "income"
  | "expense";

const statusConfig: Record<StatusType, { label: string; variant: BadgeProps["variant"] }> = {
  active: { label: "Ativo", variant: "success" },
  inactive: { label: "Inativo", variant: "default" },
  confirmed: { label: "Confirmado", variant: "success" },
  pending: { label: "Pendente", variant: "warning" },
  cancelled: { label: "Cancelado", variant: "danger" },
  completed: { label: "Concluído", variant: "primary" },
  income: { label: "Receita", variant: "success" },
  expense: { label: "Despesa", variant: "danger" },
};

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  if (!config) return null;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
