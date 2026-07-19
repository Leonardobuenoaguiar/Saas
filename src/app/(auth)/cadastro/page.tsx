"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS_TYPES } from "@/lib/constants";
import { apiPost } from "@/lib/api";

const steps = ["Sua conta", "Seu negocio", "Pronto"];

export default function CadastroPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [business, setBusiness] = useState({
    companyName: "",
    businessType: "",
    phone: "",
    city: "",
  });

  function handleNext(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setStep(1);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await apiPost("/api/auth/cadastro", {
      ...account,
      ...business,
    });

    setLoading(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    setStep(2);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[460px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-md">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FlowBook</span>
            </Link>
          </div>

          <div className="mb-8 flex items-center justify-center gap-2">
            {steps.map((item, index) => (
              <React.Fragment key={item}>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      index <= step ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < step ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <span
                    className={`hidden text-xs font-medium sm:block ${
                      index === step ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {item}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-px max-w-[40px] flex-1 ${index < step ? "bg-violet-300" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-6">
                  <h1 className="text-xl font-bold text-gray-900">Crie sua conta</h1>
                  <p className="mt-1.5 text-sm text-gray-500">14 dias gratis, sem cartao de credito.</p>
                </div>

                <form onSubmit={handleNext} className="space-y-4">
                  <Input
                    label="Nome completo"
                    placeholder="Joao Silva"
                    value={account.name}
                    onChange={(event) => setAccount((current) => ({ ...current, name: event.target.value }))}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    value={account.email}
                    onChange={(event) => setAccount((current) => ({ ...current, email: event.target.value }))}
                    required
                  />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Senha</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimo 8 caracteres"
                        required
                        minLength={8}
                        value={account.password}
                        onChange={(event) => setAccount((current) => ({ ...current, password: event.target.value }))}
                        className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={agreed}
                      onCheckedChange={(checked) => setAgreed(!!checked)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="cursor-pointer text-sm leading-relaxed">
                      Concordo com os{" "}
                      <Link href="/termos" className="text-violet-600 hover:text-violet-700">
                        Termos de Uso
                      </Link>{" "}
                      e a{" "}
                      <Link href="/privacidade" className="text-violet-600 hover:text-violet-700">
                        Politica de Privacidade
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full" disabled={!agreed}>
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-6">
                  <h1 className="text-xl font-bold text-gray-900">Seu negocio</h1>
                  <p className="mt-1.5 text-sm text-gray-500">Conte um pouco sobre sua empresa.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <Input
                    label="Nome do estabelecimento"
                    placeholder="Ex: Studio Beauty"
                    value={business.companyName}
                    onChange={(event) => setBusiness((current) => ({ ...current, companyName: event.target.value }))}
                    required
                  />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Tipo de negocio</label>
                    <Select
                      value={business.businessType}
                      onValueChange={(value) => setBusiness((current) => ({ ...current, businessType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    label="Telefone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={business.phone}
                    onChange={(event) => setBusiness((current) => ({ ...current, phone: event.target.value }))}
                  />
                  <Input
                    label="Cidade"
                    placeholder="Sao Paulo"
                    value={business.city}
                    onChange={(event) => setBusiness((current) => ({ ...current, city: event.target.value }))}
                    required
                  />

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(0)}>
                      Voltar
                    </Button>
                    <Button type="submit" variant="primary" size="lg" className="flex-1" loading={loading}>
                      {!loading && "Criar conta"}
                      {!loading && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Conta criada!</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Bem-vindo ao FlowBook. Sua sessao ja esta ativa.
                </p>
                <Button variant="primary" size="lg" className="mt-6 w-full" onClick={() => router.replace("/dashboard")}>
                  Ir para o Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>

          {step < 2 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Ja tem uma conta?{" "}
              <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700">
                Entrar
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
