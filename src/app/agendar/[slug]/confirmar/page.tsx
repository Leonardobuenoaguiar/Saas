"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { CalendarCheck, Clock, RotateCcw, Scissors, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingConfirmationPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const company = searchParams.get("empresa") || "Empresa";
  const service = searchParams.get("servico") || "Servico";
  const employee = searchParams.get("profissional") || "Profissional";
  const date = searchParams.get("data") || "";
  const time = searchParams.get("horario") || "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg"
      >
        <Card>
          <CardContent className="p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CalendarCheck className="h-8 w-8" />
            </div>

            <div className="mt-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Agendamento solicitado</h1>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Recebemos sua solicitacao. A equipe de {company} pode entrar em contato para confirmar o horario.
              </p>
            </div>

            <div className="mt-6 space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <SummaryRow icon={<Scissors className="h-4 w-4" />} label="Servico" value={service} />
              <SummaryRow icon={<UserRound className="h-4 w-4" />} label="Profissional" value={employee} />
              <SummaryRow icon={<Clock className="h-4 w-4" />} label="Horario" value={[date, time].filter(Boolean).join(" as ")} />
            </div>

            <div className="mt-6 rounded-lg border border-violet-100 bg-violet-50 px-4 py-3 text-sm leading-relaxed text-violet-800">
              Guarde essa confirmacao. Para alterar ou cancelar, fale diretamente com a empresa pelo canal de atendimento informado na pagina.
            </div>

            <Button className="mt-6 w-full" variant="primary" asChild>
              <Link href={`/agendar/${params.slug}`}>
                <RotateCcw className="h-4 w-4" />
                Fazer outro agendamento
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="truncate text-sm font-semibold text-gray-900">{value || "-"}</p>
      </div>
    </div>
  );
}
