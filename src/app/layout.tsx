import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FlowBook — Gestão de Agendamentos",
    template: "%s | FlowBook",
  },
  description: "Plataforma moderna de gestão de agendamentos para salões, clínicas e estúdios.",
  keywords: ["agendamento", "gestão", "salão", "clínica", "saas"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
