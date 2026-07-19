import { NextResponse } from "next/server";
import { integrationConfig } from "@/lib/integrations/config";

export async function POST(request: Request) {
  const signature = request.headers.get("x-signature");

  if (integrationConfig.billing.mercadoPagoWebhookSecret && !signature) {
    return NextResponse.json({ error: "Webhook nao autorizado" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  console.info("[WEBHOOK/MERCADO_PAGO]", payload?.type || payload?.action || "evento_recebido");

  return NextResponse.json({ received: true });
}
