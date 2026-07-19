"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Scissors,
  DollarSign,
  BarChart3,
  Settings,
  Building2,
  X,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useApiGet } from "@/hooks/use-api";

const navItems = [
  {
    group: "Principal",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Agenda", href: "/dashboard/agenda", icon: Calendar, badge: 3 },
    ],
  },
  {
    group: "Gestão",
    items: [
      { label: "Funcionários", href: "/dashboard/funcionarios", icon: UserCheck },
      { label: "Clientes", href: "/dashboard/clientes", icon: Users },
      { label: "Serviços", href: "/dashboard/servicos", icon: Scissors },
    ],
  },
  {
    group: "Financeiro",
    items: [
      { label: "Financeiro", href: "/dashboard/financeiro", icon: DollarSign },
      { label: "Relatórios", href: "/dashboard/relatorios", icon: BarChart3 },
    ],
  },
  {
    group: "Configurações",
    items: [
      { label: "Perfil da Empresa", href: "/dashboard/empresa", icon: Building2 },
      { label: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, isMobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: user } = useApiGet<{ name: string; role: string }>("/api/auth/me");

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 shadow-sm">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-base font-bold text-gray-900 overflow-hidden whitespace-nowrap"
              >
                FlowBook
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navItems.map((group) => (
          <div key={group.group}>
            <AnimatePresence>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={isMobile ? onClose : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                      "group relative",
                      isActive
                        ? "bg-violet-50 text-violet-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute inset-0 rounded-lg bg-violet-50"
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-violet-600" : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="overflow-hidden whitespace-nowrap flex-1 flex items-center justify-between"
                        >
                          {item.label}
                          {"badge" in item && item.badge && (
                            <Badge variant="primary" className="ml-auto text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-100 p-3">
        <Link
          href="/dashboard/configuracoes"
          onClick={isMobile ? onClose : undefined}
          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs">
              {(user?.name || "Usuario")
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-medium text-gray-900 whitespace-nowrap">{user?.name || "Usuario"}</p>
                <p className="text-xs text-gray-500 whitespace-nowrap">{user?.role || "Conta"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
          )}
        </AnimatePresence>
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: isOpen ? 0 : -280 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="fixed left-0 top-0 z-50 h-screen w-[260px] bg-white border-r border-gray-200 shadow-xl lg:hidden"
        >
          {sidebarContent}
        </motion.aside>
      </>
    );
  }

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 72 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      className="relative hidden lg:flex h-screen flex-col bg-white border-r border-gray-200 shrink-0 overflow-hidden"
    >
      {sidebarContent}
      {/* Collapse toggle */}
      <button
        className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm text-gray-400 hover:text-gray-600 transition-colors z-10"
        style={{ display: "none" }}
      >
        <ChevronLeft className={cn("h-3 w-3 transition-transform", !isOpen && "rotate-180")} />
      </button>
    </motion.aside>
  );
}
