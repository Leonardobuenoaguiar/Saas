import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  time,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ──────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["owner", "admin", "employee"]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);
export const transactionStatusEnum = pgEnum("transaction_status", [
  "completed",
  "pending",
  "cancelled",
]);

// ─── Companies (Multi-tenant root) ─────────────────────────────────────────

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  cnpj: varchar("cnpj", { length: 18 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  description: text("description"),
  logoUrl: text("logo_url"),
  website: varchar("website", { length: 255 }),
  businessType: varchar("business_type", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Users (Authentication) ─────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("owner").notNull(),
  phone: varchar("phone", { length: 20 }),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Employees ──────────────────────────────────────────────────────────────

export const employees = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 100 }),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Services ───────────────────────────────────────────────────────────────

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }),
  color: varchar("color", { length: 20 }).default("#7c3aed"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Employee ↔ Service (N:N) ───────────────────────────────────────────────

export const employeeServices = pgTable("employee_services", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: uuid("employee_id")
    .references(() => employees.id, { onDelete: "cascade" })
    .notNull(),
  serviceId: uuid("service_id")
    .references(() => services.id, { onDelete: "cascade" })
    .notNull(),
});

// ─── Clients ────────────────────────────────────────────────────────────────

export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  birthDate: date("birth_date"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Appointments ───────────────────────────────────────────────────────────

export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "set null" }),
  employeeId: uuid("employee_id")
    .references(() => employees.id, { onDelete: "set null" }),
  serviceId: uuid("service_id")
    .references(() => services.id, { onDelete: "set null" }),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: appointmentStatusEnum("status").default("pending").notNull(),
  notes: text("notes"),
  clientName: varchar("client_name", { length: 255 }), // for public bookings without client record
  clientPhone: varchar("client_phone", { length: 20 }),
  clientEmail: varchar("client_email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Transactions ───────────────────────────────────────────────────────────

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  appointmentId: uuid("appointment_id").references(() => appointments.id, {
    onDelete: "set null",
  }),
  description: varchar("description", { length: 500 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  category: varchar("category", { length: 100 }),
  paymentMethod: varchar("payment_method", { length: 50 }),
  date: date("date").notNull(),
  status: transactionStatusEnum("status").default("completed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Working Hours ──────────────────────────────────────────────────────────

export const workingHours = pgTable("working_hours", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id")
    .references(() => companies.id, { onDelete: "cascade" })
    .notNull(),
  employeeId: uuid("employee_id").references(() => employees.id, {
    onDelete: "cascade",
  }),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday, 6=Saturday
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});
