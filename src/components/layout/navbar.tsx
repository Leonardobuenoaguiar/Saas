"use client";

import React from "react";
import Link from "next/link";
import { Menu, Bell, Search, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleSidebar}
        className="lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Desktop collapse button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleSidebar}
        className="hidden lg:flex"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Breadcrumb */}
      <div className="hidden md:flex flex-1">
        <Breadcrumb />
      </div>

      <div className="flex-1 md:hidden" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="h-8 w-48 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all duration-200 focus:w-64"
            />
          </div>
        </div>

        {/* Help */}
        <Button variant="ghost" size="icon-sm" className="hidden md:flex">
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-violet-600 ring-2 ring-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between py-3">
              <span className="text-sm font-semibold text-gray-900">Notificações</span>
              <Badge variant="primary">3 novas</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { title: "Novo agendamento", desc: "Maria Silva agendou corte para amanhã", time: "2 min atrás" },
              { title: "Pagamento recebido", desc: "R$ 150,00 confirmado via PIX", time: "1 hora atrás" },
              { title: "Lembrete", desc: "João Santos tem consulta em 30 minutos", time: "2 horas atrás" },
            ].map((n, i) => (
              <DropdownMenuItem key={i} className="flex-col items-start p-3 cursor-pointer">
                <div className="flex items-start gap-3 w-full">
                  <div className="h-2 w-2 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{n.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-violet-600 font-medium py-2">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100 transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">AS</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-xs font-semibold text-gray-900">Ana Silva</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
              <ChevronDown className="hidden md:block h-3.5 w-3.5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="pb-2">
              <p className="font-semibold text-gray-900">Ana Silva</p>
              <p className="text-xs text-gray-500 font-normal">ana@flowbook.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/perfil">Meu Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/empresa">Perfil da Empresa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/configuracoes">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/agendamento/minha-empresa" className="text-violet-600">
                Ver página pública
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="text-red-500">
                Sair
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
