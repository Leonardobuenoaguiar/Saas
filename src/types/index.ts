export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  children?: NavItem[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee" | "owner";
  avatar?: string;
  phone?: string;
  createdAt: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  status: "active" | "inactive";
  services: string[];
  createdAt: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalAppointments: number;
  lastAppointment?: string;
  status: "active" | "inactive";
  createdAt: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  status: "active" | "inactive";
  color: string;
};

export type Appointment = {
  id: string;
  clientName: string;
  serviceName: string;
  employeeName: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  price: number;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  status: "completed" | "pending" | "cancelled";
};

export type Metric = {
  label: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
};

export type Company = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  description?: string;
  website?: string;
  cnpj?: string;
};
