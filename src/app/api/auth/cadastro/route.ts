import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, companies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { registerSchema } from "@/lib/validators";
import { hashPassword, createSession, generateSlug } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, companyName, businessType, phone, city } =
      parsed.data;

    // Check if email already exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 409 }
      );
    }

    // Generate slug for the company
    let slug = generateSlug(companyName);

    // Ensure slug is unique
    const existingSlug = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.slug, slug))
      .limit(1);

    if (existingSlug.length > 0) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create company
    const [company] = await db
      .insert(companies)
      .values({
        name: companyName,
        slug,
        businessType: businessType || null,
        city: city || null,
      })
      .returning({ id: companies.id });

    // Create user (owner)
    const [user] = await db
      .insert(users)
      .values({
        companyId: company.id,
        name,
        email,
        passwordHash,
        role: "owner",
        phone: phone || null,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    // Create session
    await createSession({
      userId: user.id,
      companyId: company.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: company.id,
        },
        message: "Conta criada com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[AUTH/CADASTRO]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
