import { integrationConfig } from "@/lib/integrations/config";

export type CreateCheckoutInput = {
  name: string;
  email: string;
  phone?: string | null;
  planId: string;
  planName: string;
  amount: number;
};

export async function createBillingCheckout(input: CreateCheckoutInput) {
  if (integrationConfig.billing.provider === "mercado-pago") {
    return createMercadoPagoPreference(input);
  }

  return createAsaasPaymentLink(input);
}

async function createAsaasPaymentLink(input: CreateCheckoutInput) {
  if (!integrationConfig.billing.asaasApiKey) {
    return { skipped: true, reason: "ASAAS_API_KEY nao configurada" };
  }

  const customerResponse = await fetch(`${integrationConfig.billing.asaasBaseUrl}/customers`, {
    method: "POST",
    headers: asaasHeaders(),
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone || undefined,
      externalReference: input.email,
    }),
  });

  if (!customerResponse.ok) {
    throw new Error("Falha ao criar cliente no Asaas");
  }

  const customer = await customerResponse.json();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const paymentResponse = await fetch(`${integrationConfig.billing.asaasBaseUrl}/payments`, {
    method: "POST",
    headers: asaasHeaders(),
    body: JSON.stringify({
      customer: customer.id,
      billingType: "UNDEFINED",
      value: input.amount,
      dueDate: dueDate.toISOString().slice(0, 10),
      description: `FlowBook ${input.planName}`,
      externalReference: input.planId,
    }),
  });

  if (!paymentResponse.ok) {
    throw new Error("Falha ao criar cobranca no Asaas");
  }

  const payment = await paymentResponse.json();
  return { skipped: false, provider: "asaas", checkoutUrl: payment.invoiceUrl, raw: payment };
}

async function createMercadoPagoPreference(input: CreateCheckoutInput) {
  if (!integrationConfig.billing.mercadoPagoAccessToken) {
    return { skipped: true, reason: "MERCADO_PAGO_ACCESS_TOKEN nao configurado" };
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${integrationConfig.billing.mercadoPagoAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          id: input.planId,
          title: `FlowBook ${input.planName}`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: input.amount,
        },
      ],
      payer: {
        name: input.name,
        email: input.email,
      },
      external_reference: input.planId,
    }),
  });

  if (!response.ok) {
    throw new Error("Falha ao criar preferencia no Mercado Pago");
  }

  const preference = await response.json();
  return { skipped: false, provider: "mercado-pago", checkoutUrl: preference.init_point, raw: preference };
}

function asaasHeaders() {
  return {
    access_token: integrationConfig.billing.asaasApiKey,
    "Content-Type": "application/json",
  };
}
