import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    title: "Uso da plataforma",
    content:
      "O FlowBook oferece ferramentas para cadastro de clientes, servicos, profissionais, financeiro e agendamentos. O responsavel pela conta deve manter os dados atualizados e usar a plataforma de acordo com a legislacao aplicavel.",
  },
  {
    title: "Contas e seguranca",
    content:
      "Cada usuario e responsavel por proteger suas credenciais. Senhas sao armazenadas com hash e sessoes usam cookies HTTP-only, mas boas praticas como senhas fortes e acesso restrito continuam sendo indispensaveis.",
  },
  {
    title: "Dados dos clientes",
    content:
      "A empresa cadastrada controla os dados inseridos sobre seus clientes. Esses dados devem ser coletados com base legitima e usados apenas para fins relacionados ao atendimento e operacao do negocio.",
  },
  {
    title: "Disponibilidade",
    content:
      "Buscamos manter o servico estavel e seguro, mas manutencoes, indisponibilidades de infraestrutura ou integracoes externas podem afetar temporariamente o acesso.",
  },
  {
    title: "Limitacao de responsabilidade",
    content:
      "O FlowBook apoia a gestao operacional, mas nao substitui controles contabeis, juridicos, fiscais ou profissionais especificos do seu ramo.",
  },
];

export default function TermosPage() {
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
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Termos de Uso</h1>
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
