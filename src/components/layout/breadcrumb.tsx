"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  agenda: "Agenda",
  funcionarios: "Funcionários",
  clientes: "Clientes",
  servicos: "Serviços",
  financeiro: "Financeiro",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
  empresa: "Perfil da Empresa",
  perfil: "Meu Perfil",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = routeLabels[segment] || segment;
    const isLast = index === segments.length - 1;
    return { label, href, isLast };
  });

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="flex items-center text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
          {crumb.isLast ? (
            <span className="font-medium text-gray-900 truncate max-w-[200px]">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className={cn(
                "text-gray-500 hover:text-gray-700 transition-colors truncate max-w-[150px]",
                index === 0 && "hidden sm:inline"
              )}
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
