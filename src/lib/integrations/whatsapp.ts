import { integrationConfig } from "@/lib/integrations/config";

type SendWhatsAppTemplateInput = {
  to: string;
  templateName?: string;
  language?: string;
  parameters?: string[];
};

export async function sendWhatsAppTemplate(input: SendWhatsAppTemplateInput) {
  if (!integrationConfig.whatsapp.metaToken || !integrationConfig.whatsapp.phoneNumberId) {
    return { skipped: true, reason: "WhatsApp Meta API nao configurada" };
  }

  const phone = normalizePhone(input.to);
  if (!phone) return { skipped: true, reason: "Telefone invalido" };

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${integrationConfig.whatsapp.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${integrationConfig.whatsapp.metaToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "template",
        template: {
          name: input.templateName || integrationConfig.whatsapp.defaultTemplate,
          language: { code: input.language || "pt_BR" },
          components: input.parameters?.length
            ? [
                {
                  type: "body",
                  parameters: input.parameters.map((value) => ({ type: "text", text: value })),
                },
              ]
            : undefined,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(error?.error?.message || "Falha ao enviar WhatsApp");
  }

  return { skipped: false, data: await safeJson(response) };
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
