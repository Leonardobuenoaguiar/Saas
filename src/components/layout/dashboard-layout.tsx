"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen, isMobile, toggle, close } = useSidebar();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isOpen} isMobile={isMobile} onClose={close} />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Navbar onToggleSidebar={toggle} />
        <main className="flex-1 overflow-y-auto">
          <div className={cn("p-4 lg:p-6 max-w-screen-2xl mx-auto w-full")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
