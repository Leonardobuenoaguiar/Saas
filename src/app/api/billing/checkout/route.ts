import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, requireAuth } from "@/lib/auth";
import { createBillingCheckout } from "@/lib/integrations/billing";
import { SAAS_PLANS } from "@/lib/constants";

const checkoutSchema = z.object({
  planId: z.enum(["starter", "pro", "business"]).default("pro"),
});

const planAmounts: Record<string, number> = {
  starter: 49,
  pro: 99,
  business: 249,
};

export async function POST(request: Request) {
  try {
    await requireAuth();
    const user = await getCurrentUser();
    const parsed = checkoutSchema.safeParse(await request.json().catch(() => ({})));

    if (!parsed.success) {
      return NextResponse.json({ error: "Plano invalido" }, { status: 400 });
    }

    const plan = SAAS_PLANS.find((item) => item.id === parsed.data.planId) || SAAS_PLANS[1];
    const checkout = await createBillingCheckout({
      name: user?.name || "Cliente FlowBook",
      email: user?.email || "",
      planId: plan.id,
      planName: plan.name,
      amount: planAmounts[plan.id],
    });

    if (checkout.skipped) {
      return NextResponse.json({ error: checkout.reason }, { status: 503 });
    }

    return NextResponse.json({ data: checkout });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

    console.error("[BILLING/CHECKOUT]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
