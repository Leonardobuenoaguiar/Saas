"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, HelpCircle, LogOut, Menu, Search } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiPost } from "@/lib/api";
import { getInitials } from "@/lib/utils";
import { useApiGet } from "@/hooks/use-api";

interface NavbarProps {
  onToggleSidebar: () => void;
}

type CurrentUser = {
  name: string;
  email: string;
  role: string;
  companySlug: string;
};

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const router = useRouter();
  const { data: user } = useApiGet<CurrentUser>("/api/auth/me");

  async function logout() {
    await apiPost("/api/auth/logout");
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm lg:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleSidebar}
        className="lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleSidebar}
        className="hidden lg:flex"
        aria-label="Alternar sidebar"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="hidden flex-1 md:flex">
        <Breadcrumb />
      </div>

      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-2">
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="h-8 w-48 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:w-64 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <Button variant="ghost" size="icon-sm" className="hidden md:flex">
          <HelpCircle className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-violet-600 ring-2 ring-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between py-3">
              <span className="text-sm font-semibold text-gray-900">Notificacoes</span>
              <Badge variant="primary">Demo</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-sm text-gray-500">
              As notificacoes por email/WhatsApp entram em uma proxima etapa.
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-gray-100">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{getInitials(user?.name || "Usuario")}</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-xs font-semibold text-gray-900">{user?.name || "Usuario"}</span>
                <span className="text-xs text-gray-500">{user?.role || "Conta"}</span>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-gray-400 md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="pb-2">
              <p className="font-semibold text-gray-900">{user?.name || "Usuario"}</p>
              <p className="text-xs font-normal text-gray-500">{user?.email || ""}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/configuracoes">Minha conta</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/empresa">Perfil da Empresa</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user?.companySlug && (
              <DropdownMenuItem asChild>
                <Link href={`/agendar/${user.companySlug}`} className="text-violet-600">
                  Ver pagina publica
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
