"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowRight, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
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

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 mb-5">
                  <Mail className="h-6 w-6 text-violet-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Recuperar senha</h1>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                  Informe seu email e enviaremos instruções para redefinir sua senha.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <Input
                    label="Email cadastrado"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={loading}
                  >
                    {!loading && "Enviar instruções"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 mx-auto mb-4">
                  <CheckCircle className="h-7 w-7 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Email enviado!</h2>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  Enviamos as instruções para{" "}
                  <strong className="text-gray-700">{email}</strong>.
                  Verifique também sua caixa de spam.
                </p>
                <p className="mt-4 text-xs text-gray-400">
                  O link expira em 1 hora.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mt-6"
                  onClick={() => setSent(false)}
                >
                  Reenviar email
                </Button>
              </motion.div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
