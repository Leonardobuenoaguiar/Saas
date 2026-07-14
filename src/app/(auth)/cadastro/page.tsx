"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const businessTypes = [
  "Salão de beleza",
  "Barbearia",
  "Clínica estética",
  "Consultório médico",
  "Consultório odontológico",
  "Personal trainer",
  "Studio de pilates",
  "Outro",
];

const steps = ["Sua conta", "Seu negócio", "Pronto!"];

export default function CadastroPage() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[460px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-md">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FlowBook</span>
            </Link>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      i <= step
                        ? "bg-violet-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={`hidden sm:block text-xs font-medium ${
                      i === step ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px max-w-[40px] ${i < step ? "bg-violet-300" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <h1 className="text-xl font-bold text-gray-900">Crie sua conta</h1>
                  <p className="mt-1.5 text-sm text-gray-500">14 dias grátis, sem cartão de crédito.</p>
                </div>

                <form onSubmit={handleNext} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Nome" placeholder="João" required />
                    <Input label="Sobrenome" placeholder="Silva" required />
                  </div>
                  <Input label="Email" type="email" placeholder="seu@email.com" required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                        className="flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm pr-10 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
                      onCheckedChange={(c) => setAgreed(!!c)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                      Concordo com os{" "}
                      <a href="#" className="text-violet-600 hover:text-violet-700">Termos de Serviço</a>{" "}
                      e a{" "}
                      <a href="#" className="text-violet-600 hover:text-violet-700">Política de Privacidade</a>
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
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <h1 className="text-xl font-bold text-gray-900">Seu negócio</h1>
                  <p className="mt-1.5 text-sm text-gray-500">Conte um pouco sobre sua empresa.</p>
                </div>

                <form onSubmit={handleNext} className="space-y-4">
                  <Input label="Nome do estabelecimento" placeholder="Ex: Studio Beauty" required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Tipo de negócio
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase().replace(/\s/g, "-")}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input label="Telefone" type="tel" placeholder="(11) 99999-9999" />
                  <Input label="Cidade" placeholder="São Paulo" required />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => setStep(0)}
                    >
                      Voltar
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      loading={loading}
                      onClick={handleSubmit}
                    >
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
                className="text-center py-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Conta criada!</h2>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  Bem-vindo ao FlowBook! Sua conta está pronta.
                  Você tem 14 dias de acesso gratuito.
                </p>
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" className="w-full mt-6">
                    Ir para o Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          {step < 2 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Já tem uma conta?{" "}
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
