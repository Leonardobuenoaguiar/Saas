"use client";

import { useState, type FormEvent } from "react";
import { Bell, CheckCircle, CreditCard, KeyRound, Lock, LogOut, Save, UserRound } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { apiPost, apiPut } from "@/lib/api";
import { SAAS_PLANS } from "@/lib/constants";
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

type IntegrationStatus = {
  status: Record<string, boolean>;
  providers: {
    email: string;
    whatsapp: string;
    billing: string;
    mapsMode: string;
  };
};

export default function ConfiguracoesPage() {
  const { data: user, isLoading, error, refetch } = useApiGet<CurrentUser>("/api/auth/me");
  const { data: integrations } = useApiGet<IntegrationStatus>("/api/integrations/status");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
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

  async function startCheckout() {
    setIsCheckoutLoading(true);
    setFormError(null);

    const response = await apiPost<{ checkoutUrl?: string }>("/api/billing/checkout", { planId: "pro" });
    setIsCheckoutLoading(false);

    if (response.error) {
      setFormError(response.error);
      return;
    }

    if (response.data?.checkoutUrl) {
      window.location.href = response.data.checkoutUrl;
    }
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
              <CardTitle>Plano atual</CardTitle>
              <CardDescription>Base preparada para cobranca recorrente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-violet-700">
                  <CreditCard className="h-4 w-4" />
                  <p className="text-sm font-semibold">Pro em teste</p>
                </div>
                <p className="text-xs leading-relaxed text-violet-800">
                  Use esta etapa para validar clientes. Depois, conectamos gateway de pagamento e limites reais por plano.
                </p>
              </div>
              <div className="mt-4 space-y-2">
                {SAAS_PLANS[1].features.slice(0, 4).map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </div>
                ))}
              </div>
              <Button className="mt-5 w-full" variant="primary" loading={isCheckoutLoading} onClick={startCheckout}>
                <CreditCard className="h-4 w-4" />
                Testar checkout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>APIs conectadas</CardTitle>
              <CardDescription>Status das integracoes do SaaS.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                ["Email", integrations?.status.email],
                ["WhatsApp", integrations?.status.whatsapp],
                ["Cloudinary", integrations?.status.cloudinary],
                ["PostHog", integrations?.status.posthog],
                ["Google Calendar", integrations?.status.googleCalendar],
                ["Google Maps", integrations?.status.googleMaps],
                ["Asaas", integrations?.status.asaas],
                ["Mercado Pago", integrations?.status.mercadoPago],
              ].map(([label, enabled]) => (
                <div key={String(label)} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-violet-600" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                    {enabled ? "Ativa" : "Pendente"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificacoes</CardTitle>
              <CardDescription>Canais que serao usados nos lembretes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <PreferenceRow title="Email para novos agendamentos" description="Avise a empresa quando alguem solicitar horario." defaultChecked />
              <PreferenceRow title="Lembrete para cliente" description="Preparado para email e WhatsApp antes do atendimento." defaultChecked />
              <PreferenceRow title="Resumo diario" description="Receba a agenda do dia no inicio do expediente." />
            </CardContent>
          </Card>

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

function PreferenceRow({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
      <div className="flex min-w-0 items-start gap-3">
        <Bell className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{description}</p>
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
