import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    title: "Dados coletados",
    content:
      "Coletamos dados de conta, empresa, profissionais, clientes, servicos, agendamentos e movimentacoes financeiras informados pelos usuarios da plataforma.",
  },
  {
    title: "Finalidade",
    content:
      "Usamos os dados para autenticar usuarios, operar o SaaS, exibir agendas, gerar relatorios, melhorar a experiencia e manter a seguranca do ambiente.",
  },
  {
    title: "Protecao",
    content:
      "Aplicamos isolamento por empresa, cookies HTTP-only, hash de senhas, validacao de entrada e filtros de autorizacao nas consultas protegidas.",
  },
  {
    title: "Compartilhamento",
    content:
      "Nao vendemos dados pessoais. Dados podem ser processados por provedores de infraestrutura, banco de dados, hospedagem e servicos essenciais para funcionamento da plataforma.",
  },
  {
    title: "Retencao e exclusao",
    content:
      "Dados sao mantidos enquanto a conta estiver ativa ou conforme obrigacoes legais e operacionais. Solicite ajustes ou exclusoes quando necessario.",
  },
];

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>

        <Card>
          <CardContent className="p-8">
            <div className="mb-8 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Politica de Privacidade</h1>
                <p className="mt-2 text-sm text-gray-500">Ultima atualizacao: julho de 2026</p>
              </div>
            </div>

            <div className="space-y-6">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{section.content}</p>
                </section>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
