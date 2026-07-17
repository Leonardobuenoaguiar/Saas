"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  Users,
  BarChart3,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  DollarSign,
  Clock,
  Smartphone,
  Shield,
  TrendingUp,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description: "Gerencie todos os agendamentos em uma interface visual intuitiva com arrastar e soltar.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Histórico completo de clientes, preferências e notificações automáticas.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: DollarSign,
    title: "Controle Financeiro",
    description: "Relatórios financeiros detalhados, fluxo de caixa e análise de receitas.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Smartphone,
    title: "Página Pública",
    description: "Página de agendamento personalizada para seus clientes agendarem online.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: BarChart3,
    title: "Relatórios Avançados",
    description: "Insights poderosos sobre performance, serviços mais populares e crescimento.",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Seus dados protegidos com criptografia de ponta e backup automático diário.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

const plans = [
  {
    name: "Starter",
    price: "R$ 49",
    period: "/mês",
    description: "Ideal para profissionais autônomos",
    features: [
      "Até 100 agendamentos/mês",
      "1 funcionário",
      "Página pública básica",
      "Suporte por email",
    ],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 99",
    period: "/mês",
    description: "Para equipes em crescimento",
    features: [
      "Agendamentos ilimitados",
      "Até 10 funcionários",
      "Página pública personalizada",
      "Relatórios avançados",
      "Suporte prioritário",
      "Notificações automáticas",
    ],
    cta: "Começar grátis",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "R$ 249",
    period: "/mês",
    description: "Para grandes negócios",
    features: [
      "Tudo do Pro",
      "Funcionários ilimitados",
      "Multi-unidades",
      "API access",
      "Suporte dedicado 24/7",
      "Onboarding personalizado",
    ],
    cta: "Falar com vendas",
    highlight: false,
  },
];

const testimonials = [
  {
    name: "Camila Santos",
    role: "Proprietária, Studio Beauty",
    content: "O FlowBook transformou minha gestão. Reduzi faltas em 70% com os lembretes automáticos!",
    rating: 5,
  },
  {
    name: "Dr. Rafael Mendes",
    role: "Clínica Odontológica",
    content: "Interface incrível e muito fácil de usar. Minha equipe adaptou em menos de um dia.",
    rating: 5,
  },
  {
    name: "Juliana Costa",
    role: "Barbearia Elite",
    content: "Os relatórios financeiros me ajudaram a identificar meus serviços mais lucrativos.",
    rating: 5,
  },
];

const stats = [
  { value: "12.000+", label: "Estabelecimentos" },
  { value: "2M+", label: "Agendamentos/mês" },
  { value: "98%", label: "Satisfação" },
  { value: "24/7", label: "Suporte" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 shadow-sm">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">FlowBook</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {["Funcionalidades", "Preços", "Clientes", "Blog"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button variant="primary" size="sm">
                  Começar grátis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4"
          >
            {["Funcionalidades", "Preços", "Clientes", "Blog"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button variant="primary" className="w-full">
                  Começar grátis
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-50 to-transparent rounded-full opacity-60 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="primary" className="mb-6 px-4 py-1.5 text-xs font-semibold">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                Novo: Página pública de agendamentos 2.0
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            >
              Gestão de agendamentos{" "}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                sem complicação
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 leading-relaxed"
            >
              O FlowBook centraliza sua agenda, clientes, serviços e financeiro em uma plataforma
              moderna. Foque no que importa: o seu negócio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/cadastro">
                <Button variant="primary" size="xl" className="gap-2 shadow-lg shadow-violet-200">
                  Começar gratuitamente
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/agendar/demo">
                <Button variant="outline" size="xl">
                  <Globe className="h-5 w-5" />
                  Ver demo ao vivo
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-sm text-gray-400"
            >
              14 dias grátis · Sem cartão de crédito · Cancele quando quiser
            </motion.p>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-4 h-5 rounded bg-gray-200 flex items-center px-3">
                  <span className="text-xs text-gray-400">app.flowbook.com.br/dashboard</span>
                </div>
              </div>
              {/* Fake dashboard content */}
              <div className="p-6 bg-gray-50/50 min-h-[280px]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Agendamentos", value: "142", color: "bg-violet-500" },
                    { label: "Clientes", value: "1.234", color: "bg-blue-500" },
                    { label: "Receita", value: "R$ 18.4k", color: "bg-emerald-500" },
                    { label: "Taxa de Retorno", value: "78%", color: "bg-amber-500" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
                      <div className={`h-2 w-8 rounded-full ${stat.color} mb-2`} />
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 rounded-xl bg-white border border-gray-200 p-4 h-28 shadow-sm">
                    <div className="h-3 w-24 rounded bg-gray-100 mb-3" />
                    <div className="flex items-end gap-1.5 h-16">
                      {[40, 65, 45, 80, 60, 90, 70, 85, 55, 75, 95, 65].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-violet-200 rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white border border-gray-200 p-4 h-28 shadow-sm space-y-2">
                    <div className="h-3 w-20 rounded bg-gray-100" />
                    {[85, 65, 40].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-violet-400" />
                        <div className="h-2 flex-1 rounded-full bg-gray-100">
                          <div className="h-2 rounded-full bg-violet-400" style={{ width: `${w}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 sm:text-4xl"
            >
              Tudo que você precisa em{" "}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                um só lugar
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto"
            >
              Funcionalidades pensadas para quem quer crescer com eficiência e profissionalismo.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                    <CardContent className="p-6">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.bg} mb-4`}>
                        <Icon className={`h-5 w-5 ${feature.color}`} />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="preços" className="py-20 lg:py-28 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 sm:text-4xl"
            >
              Preços simples e transparentes
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-gray-500"
            >
              14 dias grátis em todos os planos. Sem surpresas na fatura.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-6 ${
                  plan.highlight
                    ? "border-violet-500 bg-violet-600 shadow-xl shadow-violet-200"
                    : "border-gray-200 bg-white shadow-sm"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-400 text-amber-900 font-semibold px-3">
                      Mais popular
                    </Badge>
                  </div>
                )}
                <div className="mb-6">
                  <p className={`text-sm font-semibold ${plan.highlight ? "text-violet-200" : "text-gray-500"}`}>
                    {plan.name}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlight ? "text-violet-200" : "text-gray-500"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mt-1.5 text-sm ${plan.highlight ? "text-violet-200" : "text-gray-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          plan.highlight ? "text-violet-200" : "text-violet-500"
                        }`}
                      />
                      <span className={`text-sm ${plan.highlight ? "text-white" : "text-gray-700"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/cadastro">
                  <Button
                    variant={plan.highlight ? "outline" : "primary"}
                    className={`w-full ${
                      plan.highlight
                        ? "bg-white text-violet-700 hover:bg-violet-50 border-white"
                        : ""
                    }`}
                  >
                    {plan.cta}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="clientes" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 sm:text-4xl"
            >
              Amado por milhares de profissionais
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-violet-600 to-purple-700">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white sm:text-4xl"
          >
            Pronto para transformar seu negócio?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-violet-200"
          >
            Junte-se a mais de 12.000 profissionais que já usam o FlowBook.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/cadastro">
              <Button
                size="xl"
                className="bg-white text-violet-700 hover:bg-violet-50 shadow-lg"
              >
                Começar gratuitamente
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="ghost"
                size="xl"
                className="text-white hover:bg-white/10"
              >
                Já tenho uma conta
              </Button>
            </Link>
          </motion.div>
          <p className="mt-4 text-sm text-violet-300">
            14 dias grátis · Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-base font-bold text-white">FlowBook</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Gestão de agendamentos para profissionais modernos.
              </p>
            </div>
            {[
              {
                title: "Produto",
                links: ["Funcionalidades", "Preços", "Changelog", "Roadmap"],
              },
              {
                title: "Empresa",
                links: ["Sobre nós", "Blog", "Carreiras", "Imprensa"],
              },
              {
                title: "Suporte",
                links: ["Central de ajuda", "Documentação", "API", "Contato"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-white mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © 2025 FlowBook. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <Link href="/privacidade" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Privacidade
              </Link>
              <Link href="/termos" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Termos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
