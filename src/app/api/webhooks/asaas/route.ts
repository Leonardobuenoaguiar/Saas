import { NextResponse } from "next/server";
import { integrationConfig } from "@/lib/integrations/config";

export async function POST(request: Request) {
  const token = request.headers.get("asaas-access-token");

  if (integrationConfig.billing.asaasWebhookToken && token !== integrationConfig.billing.asaasWebhookToken) {
    return NextResponse.json({ error: "Webhook nao autorizado" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  console.info("[WEBHOOK/ASAAS]", payload?.event || "evento_recebido");

  return NextResponse.json({ received: true });
}
