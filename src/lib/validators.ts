import { z } from "zod";

// ─── Auth Schemas ───────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(255),
  email: z
    .string()
    .email("Email inválido")
    .max(255)
    .transform((v) => v.toLowerCase().trim()),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres").max(128),
  companyName: z
    .string()
    .min(2, "Nome da empresa deve ter pelo menos 2 caracteres")
    .max(255),
  businessType: z.string().optional(),
  phone: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .transform((v) => v.toLowerCase().trim()),
});

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).max(255).optional(),
    email: z.string().email().max(255).transform((v) => v.toLowerCase().trim()).optional(),
    phone: z.string().max(20).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8).max(128).optional(),
  })
  .refine((data) => !data.newPassword || !!data.currentPassword, {
    message: "Senha atual obrigatoria para alterar a senha",
    path: ["currentPassword"],
  });

// ─── Company Schemas ────────────────────────────────────────────────────────

export const updateCompanySchema = z.object({
  name: z.string().min(2).max(255).optional(),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens")
    .optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(20).optional(),
  cnpj: z.string().max(18).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(2).optional(),
  description: z.string().max(1000).optional(),
  website: z.string().url().max(255).optional().or(z.literal("")),
  businessType: z.string().max(100).optional(),
});

// ─── Service Schemas ────────────────────────────────────────────────────────

export const createServiceSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório").max(255),
  description: z.string().max(500).optional(),
  duration: z.coerce
    .number()
    .int()
    .min(5, "Duração mínima é 5 minutos")
    .max(480, "Duração máxima é 8 horas"),
  price: z.coerce.number().min(0, "Preço deve ser positivo"),
  category: z.string().max(100).optional(),
  color: z.string().max(20).optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

// ─── Employee Schemas ───────────────────────────────────────────────────────

export const createEmployeeSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório").max(255),
  email: z.string().email("Email inválido").max(255).optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  role: z.string().max(100).optional(),
  isActive: z.boolean().optional().default(true),
  serviceIds: z.array(z.string().uuid()).optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

// ─── Client Schemas ─────────────────────────────────────────────────────────

export const createClientSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório").max(255),
  email: z.string().email("Email inválido").max(255).optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  birthDate: z.string().optional(),
  notes: z.string().max(1000).optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateClientSchema = createClientSchema.partial();

// ─── Appointment Schemas ────────────────────────────────────────────────────

export const createAppointmentSchema = z.object({
  clientId: z.string().uuid().optional(),
  employeeId: z.string().uuid("Selecione um profissional"),
  serviceId: z.string().uuid("Selecione um serviço"),
  date: z.string().min(1, "Data é obrigatória"),
  startTime: z.string().min(1, "Horário é obrigatório"),
  notes: z.string().max(500).optional(),
  // For public bookings (client without account)
  clientName: z.string().max(255).optional(),
  clientPhone: z.string().max(20).optional(),
  clientEmail: z.string().email().max(255).optional().or(z.literal("")),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]).optional(),
  date: z.string().optional(),
  startTime: z.string().optional(),
  employeeId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  notes: z.string().max(500).optional(),
});

// ─── Transaction Schemas ────────────────────────────────────────────────────

export const createTransactionSchema = z.object({
  description: z.string().min(2, "Descrição é obrigatória").max(500),
  amount: z.coerce.number().positive("Valor deve ser positivo"),
  type: z.enum(["income", "expense"]),
  category: z.string().max(100).optional(),
  paymentMethod: z.string().max(50).optional(),
  date: z.string().min(1, "Data é obrigatória"),
  status: z.enum(["completed", "pending", "cancelled"]).optional().default("completed"),
});

export const updateTransactionSchema = createTransactionSchema.partial();

// ─── Working Hours Schema ───────────────────────────────────────────────────

export const workingHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  isActive: z.boolean().default(true),
  employeeId: z.string().uuid().optional(),
});

export const publicSlugSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
});

// ─── Query Params ───────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().max(200).optional(),
  status: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// ─── Type exports ───────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
