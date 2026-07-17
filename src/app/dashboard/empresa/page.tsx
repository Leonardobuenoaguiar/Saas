"use client";

import { useState, type FormEvent } from "react";
import { Building2, ExternalLink, Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiPut } from "@/lib/api";
import { useApiGet } from "@/hooks/use-api";

type CompanyData = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  cnpj: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  description: string | null;
  website: string | null;
  businessType: string | null;
};

export default function EmpresaPage() {
  const { data, isLoading, error, refetch } = useApiGet<CompanyData & { workingHours: unknown[] }>("/api/empresas");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const response = await apiPut<CompanyData>("/api/empresas", {
      name: String(formData.get("name") || "").trim(),
      slug: String(formData.get("slug") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      cnpj: String(formData.get("cnpj") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      state: String(formData.get("state") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      website: String(formData.get("website") || "").trim(),
      businessType: String(formData.get("businessType") || "").trim(),
    });

    setIsSubmitting(false);

    if (response.error) {
      setFormError(response.error);
      return;
    }

    setMessage("Dados da empresa atualizados.");
    await refetch();
  }

  return (
    <div>
      <PageHeader
        title="Perfil da Empresa"
        description="Configure os dados que aparecem para seus clientes."
        actions={
          data?.slug ? (
            <Button variant="outline" size="sm" asChild>
              <a href={`/agendar/${data.slug}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                Ver pagina publica
              </a>
            </Button>
          ) : undefined
        }
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Dados publicos</CardTitle>
            <CardDescription>Essas informacoes alimentam sua pagina de agendamento.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
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
                  <Input name="name" label="Nome da empresa" defaultValue={data?.name || ""} required />
                  <Input name="slug" label="Slug publico" defaultValue={data?.slug || ""} required />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input name="email" label="Email" type="email" defaultValue={data?.email || ""} />
                  <Input name="phone" label="Telefone" defaultValue={data?.phone || ""} />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input name="businessType" label="Ramo" defaultValue={data?.businessType || ""} />
                  <Input name="cnpj" label="CNPJ" defaultValue={data?.cnpj || ""} />
                  <Input name="website" label="Website" defaultValue={data?.website || ""} />
                </div>
                <Input name="address" label="Endereco" defaultValue={data?.address || ""} />
                <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                  <Input name="city" label="Cidade" defaultValue={data?.city || ""} />
                  <Input name="state" label="UF" maxLength={2} defaultValue={data?.state || ""} />
                </div>
                <Textarea
                  name="description"
                  label="Descricao"
                  rows={4}
                  defaultValue={data?.description || ""}
                  placeholder="Conte aos clientes o que sua empresa oferece."
                />
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" loading={isSubmitting}>
                    <Save className="h-4 w-4" />
                    Salvar empresa
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagina publica</CardTitle>
            <CardDescription>Link para clientes agendarem online.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Building2 className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{data?.name || "Sua empresa"}</p>
              <p className="mt-1 break-all text-xs text-gray-500">
                {data?.slug ? `/agendar/${data.slug}` : "Configure um slug para publicar sua agenda."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
