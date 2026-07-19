// ─── Application Constants ──────────────────────────────────────────────────

export const APP_NAME = "FlowBook";
export const APP_DESCRIPTION = "Plataforma moderna de gestão de agendamentos";

// ─── Auth ───────────────────────────────────────────────────────────────────

export const AUTH_COOKIE_NAME = "flowbook_session";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds
export const BCRYPT_SALT_ROUNDS = 12;
export const JWT_EXPIRATION = "30d";

// ─── Pagination ─────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ─── Business Types ─────────────────────────────────────────────────────────

export const BUSINESS_TYPES = [
  "Salão de beleza",
  "Barbearia",
  "Clínica estética",
  "Consultório médico",
  "Consultório odontológico",
  "Personal trainer",
  "Studio de pilates",
  "Pet shop",
  "Tatuagem e piercing",
  "Outro",
] as const;

// ─── Service Categories ─────────────────────────────────────────────────────

export const SERVICE_CATEGORIES = [
  "Cabelo",
  "Unhas",
  "Estética",
  "Masculino",
  "Saúde",
  "Fitness",
  "Outro",
] as const;

// ─── Payment Methods ────────────────────────────────────────────────────────

export const PAYMENT_METHODS = [
  "PIX",
  "Cartão de crédito",
  "Cartão de débito",
  "Dinheiro",
  "Transferência",
] as const;

// ─── Transaction Categories ─────────────────────────────────────────────────

export const TRANSACTION_CATEGORIES = [
  "Serviços",
  "Produtos",
  "Insumos",
  "Aluguel",
  "Salários",
  "Marketing",
  "Equipamentos",
  "Impostos",
  "Outros",
] as const;

// ─── Days of Week ───────────────────────────────────────────────────────────

export const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
] as const;

// ─── Appointment Status Labels ──────────────────────────────────────────────

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
  no_show: "Não compareceu",
};

// ─── Colors for Services ────────────────────────────────────────────────────

export const SERVICE_COLORS = [
  "#7c3aed", // violet
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#8b5cf6", // purple
  "#f97316", // orange
  "#14b8a6", // teal
] as const;

export const SAAS_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "R$ 49",
    description: "Para profissionais autonomos que querem sair do improviso.",
    cta: "Comecar no Starter",
    highlight: false,
    limits: {
      appointmentsPerMonth: 100,
      employees: 1,
      reminders: "email",
    },
    features: [
      "Ate 100 agendamentos por mes",
      "1 profissional",
      "Pagina publica de agendamento",
      "Clientes e historico basico",
      "Suporte por email",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 99",
    description: "Para studios, barbearias e esteticas com equipe.",
    cta: "Comecar no Pro",
    highlight: true,
    limits: {
      appointmentsPerMonth: null,
      employees: 10,
      reminders: "email_whatsapp",
    },
    features: [
      "Agendamentos ilimitados",
      "Ate 10 profissionais",
      "Relatorios de receita e servicos",
      "Base preparada para lembretes",
      "Suporte prioritario",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "R$ 249",
    description: "Para operacoes maiores que precisam de mais controle.",
    cta: "Falar com vendas",
    highlight: false,
    limits: {
      appointmentsPerMonth: null,
      employees: null,
      reminders: "advanced",
    },
    features: [
      "Tudo do Pro",
      "Profissionais ilimitados",
      "Multiunidade em roadmap",
      "Auditoria e permissoes avancadas",
      "Onboarding assistido",
    ],
  },
] as const;
