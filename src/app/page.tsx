"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Menu,
  MessageCircle,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SAAS_PLANS } from "@/lib/constants";

const navItems = [
  { label: "Dores", href: "#dores" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Recursos", href: "#recursos" },
  { label: "Precos", href: "#precos" },
];

const pains = [
  "Agenda perdida em conversas de WhatsApp",
  "Cliente esquecendo horario e faltando",
  "Profissional sem visao clara do dia",
  "Controle financeiro separado em planilha",
];

const features = [
  {
    icon: CalendarCheck,
    title: "Agenda online por link",
    description: "Seu cliente escolhe servico, profissional, data e horario em uma pagina publica simples de usar no celular.",
  },
  {
    icon: MessageCircle,
    title: "Preparado para lembretes",
    description: "Estrutura pronta para notificacoes por email e WhatsApp, reduzindo faltas e mensagens repetitivas.",
  },
  {
    icon: Users,
    title: "Historico de clientes",
    description: "Veja contatos, observacoes e recorrencia para atender melhor e vender mais no retorno.",
  },
  {
    icon: CreditCard,
    title: "Financeiro simples",
    description: "Acompanhe entradas, despesas e receitas do mes sem transformar a rotina em contabilidade pesada.",
  },
  {
    icon: BarChart3,
    title: "Relatorios de crescimento",
    description: "Descubra servicos populares, horarios fortes, cancelamentos e faturamento com dados reais.",
  },
  {
    icon: ShieldCheck,
    title: "Base segura para SaaS",
    description: "Autenticacao com cookie httpOnly, validacao de dados, isolamento por empresa e protecao de rotas.",
  },
];

const steps = [
  "Cadastre sua empresa",
  "Crie servicos e profissionais",
  "Compartilhe seu link de agendamento",
  "Acompanhe agenda, clientes e financeiro",
];

const testimonials = [
  {
    name: "Camila Rocha",
    role: "Studio de beleza",
    text: "Antes eu confirmava tudo manualmente. Agora o cliente agenda pelo link e eu acordo com a agenda organizada.",
  },
  {
    name: "Marcos Vieira",
    role: "Barbearia",
    text: "O diferencial foi parar de perder horario no WhatsApp. O painel mostra o dia inteiro de um jeito muito claro.",
  },
  {
    name: "Bianca Lopes",
    role: "Estetica facial",
    text: "Consigo ver quais procedimentos mais vendem e quais clientes voltam. Ficou muito mais facil tomar decisao.",
  },
];

const comparison = [
  { old: "Agendamentos espalhados no WhatsApp", flowbook: "Link publico com horarios organizados" },
  { old: "Confirmacao manual e repetitiva", flowbook: "Fluxo pronto para lembretes automaticos" },
  { old: "Planilha para clientes e caixa", flowbook: "Clientes, agenda e financeiro no mesmo painel" },
  { old: "Sem saber quais servicos vendem mais", flowbook: "Relatorios por servico, status e receita" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm">
              <Zap className="h-4 w-4" />
            </span>
            <span className="text-lg font-bold">FlowBook</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href="/cadastro">
                Testar gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
            <div className="space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-2 border-t border-gray-100 pt-4">
              <Button variant="outline" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button variant="primary" asChild>
                <Link href="/cadastro">Testar gratis</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="border-b border-gray-100">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_520px] lg:px-8 lg:py-20">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <Badge variant="primary" className="mb-5">
                <Sparkles className="h-3.5 w-3.5" />
                Feito para beleza, barbearia e estetica
              </Badge>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                Agenda online para lotar horarios sem depender do WhatsApp
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
                O FlowBook ajuda negocios de atendimento com hora marcada a vender pelo link,
                organizar profissionais, reduzir faltas e entender o financeiro em um painel simples.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="primary" size="xl" asChild>
                  <Link href="/cadastro">
                    Comecar teste gratis
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link href="/agendar/studio-flow-beauty">Ver pagina de agendamento</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-500">Sem cartao de credito. Configure sua agenda em poucos minutos.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl border border-gray-200 bg-white shadow-xl"
            >
              <div className="border-b border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Agenda de hoje</p>
                    <p className="text-xs text-gray-500">Studio Flow Beauty</p>
                  </div>
                  <Badge variant="success">Online</Badge>
                </div>
              </div>
              <div className="space-y-3 p-4">
                {[
                  ["09:00", "Corte + barba", "Marcos", "Confirmado"],
                  ["10:30", "Design de sobrancelha", "Bianca", "Pendente"],
                  ["14:00", "Limpeza de pele", "Camila", "Confirmado"],
                  ["16:30", "Manicure", "Aline", "Confirmado"],
                ].map(([time, service, professional, status]) => (
                  <div key={`${time}-${service}`} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">
                    <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                      {time}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">{service}</p>
                      <p className="text-xs text-gray-500">{professional}</p>
                    </div>
                    <span className="hidden rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 sm:inline">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 border-t border-gray-100">
                {[
                  ["28", "agendamentos"],
                  ["R$ 4,8k", "na semana"],
                  ["82%", "retorno"],
                ].map(([value, label]) => (
                  <div key={label} className="p-4 text-center">
                    <p className="text-lg font-extrabold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="dores" className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
              <div>
                <p className="text-sm font-semibold text-violet-700">O problema real</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-950">Seu atendimento cresce, mas a agenda vira gargalo.</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  O FlowBook foi desenhado para pequenos negocios que querem parecer profissionais
                  antes mesmo de ter uma grande equipe administrativa.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {pains.map((pain) => (
                  <div key={pain} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <CheckCircle className="mb-3 h-5 w-5 text-violet-600" />
                    <p className="text-sm font-semibold text-gray-800">{pain}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold text-violet-700">Como funciona</p>
                <h2 className="mt-2 text-3xl font-bold text-gray-950">Do cadastro ao primeiro agendamento.</h2>
              </div>
              <Button variant="outline" asChild>
                <Link href="/cadastro">
                  Comecar agora
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-sm font-bold text-violet-700">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="recursos" className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-semibold text-violet-700">Recursos</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-950">Tudo que ajuda a vender e operar melhor.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="h-full">
                    <CardContent className="p-5">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-semibold text-violet-700">Comparativo</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-950">Troque improviso por processo.</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                A venda fica mais facil quando o cliente entende que o sistema economiza tempo todo dia.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {comparison.map((item) => (
                <div key={item.old} className="grid gap-0 border-b border-gray-100 last:border-b-0 sm:grid-cols-2">
                  <div className="bg-gray-50 p-4 text-sm text-gray-500">{item.old}</div>
                  <div className="p-4 text-sm font-semibold text-gray-900">{item.flowbook}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold text-violet-700">Depoimentos</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-950">Criado para negocios de atendimento.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name}>
                  <CardContent className="p-5">
                    <div className="mb-3 flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">&quot;{testimonial.text}&quot;</p>
                    <div className="mt-5">
                      <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="precos" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold text-violet-700">Planos</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-950">Comece simples e cresca quando precisar.</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {SAAS_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-xl border p-6 shadow-sm ${
                    plan.highlight ? "border-violet-500 bg-violet-600 text-white" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`text-sm font-semibold ${plan.highlight ? "text-violet-100" : "text-violet-700"}`}>{plan.name}</p>
                      <p className="mt-2 text-4xl font-extrabold">{plan.price}</p>
                      <p className={`mt-1 text-sm ${plan.highlight ? "text-violet-100" : "text-gray-500"}`}>{plan.description}</p>
                    </div>
                    {plan.highlight && <Badge className="bg-white text-violet-700">Popular</Badge>}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? "text-violet-100" : "text-violet-600"}`} />
                        <span className={plan.highlight ? "text-white" : "text-gray-700"}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-7 w-full ${plan.highlight ? "border-white bg-white text-violet-700 hover:bg-violet-50" : ""}`}
                    variant={plan.highlight ? "outline" : "primary"}
                    asChild
                  >
                    <Link href="/cadastro">{plan.cta}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-violet-600 py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Scissors className="mx-auto mb-5 h-9 w-9" />
            <h2 className="text-3xl font-bold">Seu proximo cliente pode agendar sem mandar mensagem.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-violet-100">
              Configure sua empresa, compartilhe o link e use o dashboard para acompanhar tudo com clareza.
            </p>
            <Button className="mt-8 bg-white text-violet-700 hover:bg-violet-50" size="xl" asChild>
              <Link href="/cadastro">
                Criar minha agenda
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-950 py-10 text-gray-400">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                <Clock className="h-4 w-4" />
              </span>
              <span className="font-bold">FlowBook</span>
            </div>
            <p className="mt-2 text-sm">Agenda online e gestao para negocios com hora marcada.</p>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/termos" className="hover:text-white">Termos</Link>
            <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
