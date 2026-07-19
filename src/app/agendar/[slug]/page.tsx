"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Phone, Scissors, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiPost } from "@/lib/api";
import { buildGoogleMapsSearchUrl } from "@/lib/integrations/maps";
import { formatCurrency } from "@/lib/utils";

type PublicCompany = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  description: string | null;
  logoUrl: string | null;
  businessType: string | null;
};

type PublicService = {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: string;
  category: string | null;
  color: string | null;
};

type PublicEmployee = {
  id: string;
  name: string;
  role: string | null;
  avatarUrl: string | null;
  serviceIds: string[];
};

type WorkingHour = {
  id: string;
  employeeId: string | null;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

type PublicBookingData = {
  company: PublicCompany;
  services: PublicService[];
  employees: PublicEmployee[];
  workingHours: WorkingHour[];
};

const fallbackSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function PublicBookingPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;
  const [data, setData] = useState<PublicBookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetch(`/api/publico/${slug}`);
        const json = await response.json();

        if (!isMounted) return;

        if (!response.ok) {
          setError(json.error || "Pagina de agendamento nao encontrada.");
          return;
        }

        setData(json.data);
        setSelectedServiceId(json.data.services[0]?.id || "");
        setSelectedEmployeeId(json.data.employees[0]?.id || "");
      } catch {
        if (isMounted) setError("Nao foi possivel carregar a pagina de agendamento.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const selectedService = data?.services.find((service) => service.id === selectedServiceId) || null;
  const mapsUrl = data
    ? buildGoogleMapsSearchUrl([data.company.address, data.company.city, data.company.state])
    : "";
  const availableEmployees = useMemo(() => {
    if (!data || !selectedServiceId) return [];
    return data.employees.filter((employee) => {
      return employee.serviceIds.length === 0 || employee.serviceIds.includes(selectedServiceId);
    });
  }, [data, selectedServiceId]);

  const timeSlots = useMemo(() => {
    if (!data || !selectedDate) return fallbackSlots;
    const date = new Date(`${selectedDate}T00:00:00`);
    const dayOfWeek = date.getDay();
    const hours = data.workingHours.filter((hour) => {
      const matchesEmployee = !hour.employeeId || hour.employeeId === selectedEmployeeId;
      return hour.dayOfWeek === dayOfWeek && matchesEmployee && hour.isActive;
    });

    if (hours.length === 0) return fallbackSlots;

    return hours.flatMap((hour) => buildSlots(hour.startTime, hour.endTime, selectedService?.duration || 60));
  }, [data, selectedDate, selectedEmployeeId, selectedService?.duration]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!selectedServiceId || !selectedEmployeeId || !selectedDate || !selectedTime) {
      setError("Selecione servico, profissional, data e horario.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);

    const response = await apiPost<{ id: string; date: string; startTime: string; endTime: string; status: string }>(`/api/publico/${slug}/agendar`, {
      serviceId: selectedServiceId,
      employeeId: selectedEmployeeId,
      date: selectedDate,
      startTime: selectedTime,
      clientName: String(formData.get("clientName") || "").trim(),
      clientPhone: String(formData.get("clientPhone") || "").trim(),
      clientEmail: String(formData.get("clientEmail") || "").trim(),
      notes: String(formData.get("notes") || "").trim(),
    });

    setIsSubmitting(false);

    if (response.error) {
      setError(response.error);
      return;
    }

    const query = new URLSearchParams({
      data: response.data?.date || selectedDate,
      horario: response.data?.startTime || selectedTime,
      servico: selectedService?.name || "Servico",
      profissional: data?.employees.find((employee) => employee.id === selectedEmployeeId)?.name || "Profissional",
      empresa: data?.company.name || "Empresa",
    });

    router.push(`/agendar/${slug}/confirmar?${query.toString()}`);
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="h-48 animate-pulse rounded-xl bg-white" />
        </div>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-base font-semibold text-gray-900">Agenda indisponivel</p>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <Calendar className="h-3.5 w-3.5" />
                Agendamento online
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{data.company.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
                {data.company.description || "Escolha um servico, profissional e horario disponivel."}
              </p>
            </div>
            <div className="space-y-1 text-sm text-gray-500">
              {data.company.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-violet-500" />
                  {data.company.phone}
                </p>
              )}
              {(data.company.city || data.company.address) && (
                <a
                  className="flex items-center gap-2 transition-colors hover:text-violet-700"
                  href={mapsUrl || undefined}
                  target={mapsUrl ? "_blank" : undefined}
                  rel={mapsUrl ? "noreferrer" : undefined}
                >
                  <MapPin className="h-4 w-4 text-violet-500" />
                  {[data.company.address, data.company.city, data.company.state].filter(Boolean).join(", ")}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.4fr_0.8fr] lg:px-8">
        <div className="space-y-6">
          <BookingSection title="1. Escolha o servico" icon={<Scissors className="h-4 w-4" />}>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => {
                    setSelectedServiceId(service.id);
                    setSelectedTime("");
                  }}
                  className={`rounded-xl border bg-white p-4 text-left transition-all ${
                    selectedServiceId === service.id
                      ? "border-violet-500 ring-2 ring-violet-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <p className="mt-1 text-xs text-gray-500">{service.description || service.category}</p>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(Number(service.price))}</span>
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    {service.duration} min
                  </p>
                </button>
              ))}
            </div>
          </BookingSection>

          <BookingSection title="2. Profissional" icon={<UserRound className="h-4 w-4" />}>
            <div className="grid gap-3 sm:grid-cols-3">
              {availableEmployees.map((employee) => (
                <button
                  key={employee.id}
                  type="button"
                  onClick={() => setSelectedEmployeeId(employee.id)}
                  className={`rounded-xl border bg-white p-4 text-left transition-all ${
                    selectedEmployeeId === employee.id
                      ? "border-violet-500 ring-2 ring-violet-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">{employee.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{employee.role || "Profissional"}</p>
                </button>
              ))}
            </div>
          </BookingSection>

          <BookingSection title="3. Data e horario" icon={<Calendar className="h-4 w-4" />}>
            <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
              <Input
                label="Data"
                type="date"
                value={selectedDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setSelectedTime("");
                }}
                required
              />
              <div>
                <p className="mb-1.5 text-sm font-medium text-gray-700">Horarios</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`h-9 rounded-lg border text-sm font-medium transition-colors ${
                        selectedTime === slot
                          ? "border-violet-600 bg-violet-600 text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </BookingSection>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-sm font-semibold text-gray-900">Seus dados</p>
                <p className="text-xs text-gray-500">Usaremos essas informacoes para confirmar o horario.</p>
              </div>
              {error && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}
              <Input name="clientName" label="Nome completo" required />
              <Input name="clientPhone" label="Telefone" required />
              <Input name="clientEmail" label="Email" type="email" />
              <Textarea name="notes" label="Observacoes" rows={3} />
              <div className="rounded-lg bg-gray-50 p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Servico</span>
                  <span className="font-semibold text-gray-900">{selectedService?.name || "-"}</span>
                </div>
                <div className="mt-2 flex justify-between gap-3">
                  <span className="text-gray-500">Valor</span>
                  <span className="font-semibold text-gray-900">
                    {selectedService ? formatCurrency(Number(selectedService.price)) : "-"}
                  </span>
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
                Solicitar agendamento
              </Button>
            </CardContent>
          </Card>
        </aside>
      </form>
    </main>
  );
}

function BookingSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          {icon}
        </span>
        {title}
      </div>
      {children}
    </section>
  );
}

function buildSlots(startTime: string, endTime: string, duration: number) {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  let cursor = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  const step = Math.max(15, duration);

  while (cursor + duration <= end) {
    const hour = Math.floor(cursor / 60).toString().padStart(2, "0");
    const minute = (cursor % 60).toString().padStart(2, "0");
    slots.push(`${hour}:${minute}`);
    cursor += step;
  }

  return slots;
}
