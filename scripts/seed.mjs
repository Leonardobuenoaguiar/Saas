import "dotenv/config";
import bcrypt from "bcryptjs";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const ADMIN_EMAIL = "admin@flowbook.local";
const ADMIN_PASSWORD = "FlowBook@123";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const client = await pool.connect();

  try {
    await client.query("begin");

    const company = await upsertCompany(client);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await client.query(
      `
        insert into users (company_id, name, email, password_hash, role, phone)
        values ($1, $2, $3, $4, 'owner', $5)
        on conflict (email) do update set
          company_id = excluded.company_id,
          name = excluded.name,
          password_hash = excluded.password_hash,
          role = excluded.role,
          phone = excluded.phone,
          is_active = true,
          updated_at = now()
      `,
      [company.id, "Ana Silva", ADMIN_EMAIL, passwordHash, "(11) 99999-0000"]
    );

    const services = [];
    for (const service of serviceSeed) {
      services.push(await upsertByName(client, "services", company.id, service));
    }

    const employees = [];
    for (const employee of employeeSeed) {
      employees.push(await upsertByName(client, "employees", company.id, employee));
    }

    await client.query(
      "delete from employee_services where employee_id = any($1::uuid[])",
      [employees.map((employee) => employee.id)]
    );

    for (const employee of employees) {
      const serviceIds = services
        .filter((service) => service.employeeNames.includes(employee.name))
        .map((service) => service.id);

      for (const serviceId of serviceIds) {
        await client.query(
          "insert into employee_services (employee_id, service_id) values ($1, $2)",
          [employee.id, serviceId]
        );
      }
    }

    const clients = [];
    for (const customer of clientSeed) {
      clients.push(await upsertClient(client, company.id, customer));
    }

    await client.query("delete from working_hours where company_id = $1", [company.id]);
    for (const employee of employees) {
      for (const dayOfWeek of [1, 2, 3, 4, 5, 6]) {
        await client.query(
          `
            insert into working_hours (company_id, employee_id, day_of_week, start_time, end_time, is_active)
            values ($1, $2, $3, '08:00', '18:00', true)
          `,
          [company.id, employee.id, dayOfWeek]
        );
      }
    }

    await seedAppointments(client, company.id, clients, employees, services);
    await seedTransactions(client, company.id);

    await client.query("commit");

    console.log("Seed concluido.");
    console.log(`Login demo: ${ADMIN_EMAIL}`);
    console.log(`Senha demo: ${ADMIN_PASSWORD}`);
    console.log(`Pagina publica: /agendar/${company.slug}`);
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function upsertCompany(client) {
  const result = await client.query(
    `
      insert into companies (
        name, slug, email, phone, address, city, state, description, website, business_type
      )
      values (
        'Studio Flow Beauty',
        'studio-flow-beauty',
        'contato@studioflow.local',
        '(11) 4002-8922',
        'Av. Paulista, 1000',
        'Sao Paulo',
        'SP',
        'Atendimento profissional com agenda online, equipe especializada e servicos selecionados.',
        'https://flowbook.local',
        'Salao de beleza'
      )
      on conflict (slug) do update set
        name = excluded.name,
        email = excluded.email,
        phone = excluded.phone,
        address = excluded.address,
        city = excluded.city,
        state = excluded.state,
        description = excluded.description,
        website = excluded.website,
        business_type = excluded.business_type,
        is_active = true,
        updated_at = now()
      returning id, slug
    `
  );

  return result.rows[0];
}

async function upsertByName(client, table, companyId, data) {
  const existing = await client.query(
    `select id from ${table} where company_id = $1 and name = $2 limit 1`,
    [companyId, data.name]
  );

  if (existing.rows[0]) {
    if (table === "services") {
      await client.query(
        `
          update services
          set description = $3, duration = $4, price = $5, category = $6, color = $7, is_active = true, updated_at = now()
          where id = $1 and company_id = $2
        `,
        [existing.rows[0].id, companyId, data.description, data.duration, data.price, data.category, data.color]
      );
    } else {
      await client.query(
        `
          update employees
          set email = $3, phone = $4, role = $5, is_active = true, updated_at = now()
          where id = $1 and company_id = $2
        `,
        [existing.rows[0].id, companyId, data.email, data.phone, data.role]
      );
    }

    return { ...data, id: existing.rows[0].id };
  }

  if (table === "services") {
    const inserted = await client.query(
      `
        insert into services (company_id, name, description, duration, price, category, color, is_active)
        values ($1, $2, $3, $4, $5, $6, $7, true)
        returning id
      `,
      [companyId, data.name, data.description, data.duration, data.price, data.category, data.color]
    );

    return { ...data, id: inserted.rows[0].id };
  }

  const inserted = await client.query(
    `
      insert into employees (company_id, name, email, phone, role, is_active)
      values ($1, $2, $3, $4, $5, true)
      returning id
    `,
    [companyId, data.name, data.email, data.phone, data.role]
  );

  return { ...data, id: inserted.rows[0].id };
}

async function upsertClient(client, companyId, data) {
  const existing = await client.query(
    "select id from clients where company_id = $1 and email = $2 limit 1",
    [companyId, data.email]
  );

  if (existing.rows[0]) {
    await client.query(
      `
        update clients
        set name = $3, phone = $4, notes = $5, is_active = true, updated_at = now()
        where id = $1 and company_id = $2
      `,
      [existing.rows[0].id, companyId, data.name, data.phone, data.notes]
    );
    return { ...data, id: existing.rows[0].id };
  }

  const inserted = await client.query(
    `
      insert into clients (company_id, name, email, phone, notes, is_active)
      values ($1, $2, $3, $4, $5, true)
      returning id
    `,
    [companyId, data.name, data.email, data.phone, data.notes]
  );

  return { ...data, id: inserted.rows[0].id };
}

async function seedAppointments(client, companyId, clients, employees, services) {
  const today = new Date();
  const dates = Array.from({ length: 8 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date.toISOString().slice(0, 10);
  });

  const rows = [
    [clients[0], employees[0], services[0], dates[0], "09:00", "confirmed"],
    [clients[1], employees[1], services[5], dates[0], "10:30", "confirmed"],
    [clients[2], employees[2], services[3], dates[1], "11:00", "pending"],
    [clients[3], employees[0], services[1], dates[2], "14:00", "confirmed"],
    [clients[4], employees[2], services[4], dates[3], "15:30", "pending"],
  ];

  for (const [customer, employee, service, date, startTime, status] of rows) {
    const exists = await client.query(
      `
        select id from appointments
        where company_id = $1 and employee_id = $2 and date = $3 and start_time = $4
        limit 1
      `,
      [companyId, employee.id, date, startTime]
    );

    if (exists.rows[0]) continue;

    const endTime = addMinutesToTime(startTime, service.duration);
    await client.query(
      `
        insert into appointments (
          company_id, client_id, employee_id, service_id, date, start_time, end_time, price, status, notes,
          client_name, client_phone, client_email
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `,
      [
        companyId,
        customer.id,
        employee.id,
        service.id,
        date,
        startTime,
        endTime,
        service.price,
        status,
        "Seed demo",
        customer.name,
        customer.phone,
        customer.email,
      ]
    );
  }
}

async function seedTransactions(client, companyId) {
  const today = new Date().toISOString().slice(0, 10);
  const rows = [
    ["Corte feminino - Maria Santos", 90, "income", "Servicos", "PIX", today, "completed"],
    ["Coloracao - Ana Oliveira", 220, "income", "Servicos", "Cartao de credito", today, "completed"],
    ["Produtos profissionais", 180, "expense", "Insumos", "Cartao de debito", today, "completed"],
    ["Marketing local", 120, "expense", "Marketing", "PIX", today, "pending"],
  ];

  for (const row of rows) {
    const exists = await client.query(
      "select id from transactions where company_id = $1 and description = $2 and date = $3 limit 1",
      [companyId, row[0], row[5]]
    );

    if (exists.rows[0]) continue;

    await client.query(
      `
        insert into transactions (company_id, description, amount, type, category, payment_method, date, status)
        values ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [companyId, ...row]
    );
  }
}

function addMinutesToTime(time, minutes) {
  const [hour, minute] = time.split(":").map(Number);
  const total = hour * 60 + minute + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

const serviceSeed = [
  {
    name: "Corte Feminino",
    description: "Corte moderno com finalizacao profissional.",
    duration: 60,
    price: 90,
    category: "Cabelo",
    color: "#7c3aed",
    employeeNames: ["Ana Lima"],
  },
  {
    name: "Coloracao",
    description: "Coloracao completa com diagnostico de fios.",
    duration: 180,
    price: 220,
    category: "Cabelo",
    color: "#ec4899",
    employeeNames: ["Ana Lima"],
  },
  {
    name: "Escova",
    description: "Escova modeladora com protecao termica.",
    duration: 45,
    price: 65,
    category: "Cabelo",
    color: "#8b5cf6",
    employeeNames: ["Ana Lima"],
  },
  {
    name: "Manicure",
    description: "Manicure completa com esmalte premium.",
    duration: 45,
    price: 45,
    category: "Unhas",
    color: "#f59e0b",
    employeeNames: ["Paula Costa"],
  },
  {
    name: "Pedicure",
    description: "Pedicure com hidratacao.",
    duration: 60,
    price: 55,
    category: "Unhas",
    color: "#10b981",
    employeeNames: ["Paula Costa"],
  },
  {
    name: "Barba",
    description: "Modelagem de barba com toalha quente.",
    duration: 30,
    price: 40,
    category: "Masculino",
    color: "#3b82f6",
    employeeNames: ["Carlos Souza"],
  },
];

const employeeSeed = [
  {
    name: "Ana Lima",
    email: "ana@studioflow.local",
    phone: "(11) 99999-0001",
    role: "Cabeleireira senior",
  },
  {
    name: "Carlos Souza",
    email: "carlos@studioflow.local",
    phone: "(11) 99999-0002",
    role: "Barbeiro",
  },
  {
    name: "Paula Costa",
    email: "paula@studioflow.local",
    phone: "(11) 99999-0003",
    role: "Manicure e pedicure",
  },
];

const clientSeed = [
  {
    name: "Maria Santos",
    email: "maria@email.local",
    phone: "(11) 98765-4321",
    notes: "Prefere horarios pela manha.",
  },
  {
    name: "Joao Silva",
    email: "joao@email.local",
    phone: "(11) 97654-3210",
    notes: "Cliente recorrente de barba.",
  },
  {
    name: "Lucia Ferreira",
    email: "lucia@email.local",
    phone: "(11) 96543-2109",
    notes: "Gosta de esmaltes claros.",
  },
  {
    name: "Ana Oliveira",
    email: "ana.oliveira@email.local",
    phone: "(11) 94321-0987",
    notes: "Coloracao a cada 45 dias.",
  },
  {
    name: "Pedro Costa",
    email: "pedro@email.local",
    phone: "(11) 95432-1098",
    notes: "Corte rapido no intervalo do almoco.",
  },
];

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
