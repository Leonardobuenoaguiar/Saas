"use client";

import { useState, type FormEvent } from "react";
import { Lock, LogOut, Save, UserRound } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiPost, apiPut } from "@/lib/api";
import { useApiGet } from "@/hooks/use-api";

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  companyName: string;
  companySlug: string;
};

export default function ConfiguracoesPage() {
  const { data: user, isLoading, error, refetch } = useApiGet<CurrentUser>("/api/auth/me");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get("newPassword") || "");
    const currentPassword = String(formData.get("currentPassword") || "");

    const response = await apiPut<CurrentUser>("/api/auth/me", {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      currentPassword: currentPassword || undefined,
      newPassword: newPassword || undefined,
    });

    setIsSubmitting(false);

    if (response.error) {
      setFormError(response.error);
      return;
    }

    setMessage("Configuracoes atualizadas.");
    await refetch();
  }

  async function logout() {
    await apiPost("/api/auth/logout");
    window.location.href = "/login";
  }

  return (
    <div>
      <PageHeader
        title="Configuracoes"
        description="Gerencie sua conta, senha e preferencias de acesso."
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Atualize seus dados de acesso e contato.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {formError}
                  </div>
                )}
                {message && (
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {message}
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input name="name" label="Nome" defaultValue={user?.name || ""} required />
                  <Input name="phone" label="Telefone" defaultValue={user?.phone || ""} />
                </div>
                <Input name="email" label="Email" type="email" defaultValue={user?.email || ""} required />

                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-violet-600" />
                    <p className="text-sm font-semibold text-gray-900">Alterar senha</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input name="currentPassword" label="Senha atual" type="password" />
                    <Input name="newPassword" label="Nova senha" type="password" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="primary" loading={isSubmitting}>
                    <Save className="h-4 w-4" />
                    Salvar configuracoes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sessao</CardTitle>
              <CardDescription>Conta logada neste navegador.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user?.name || "Usuario"}</p>
                  <p className="text-xs text-gray-500">{user?.role || "owner"}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Sair da conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
