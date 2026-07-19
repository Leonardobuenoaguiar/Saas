import { integrationConfig } from "@/lib/integrations/config";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(input: SendEmailInput) {
  if (!integrationConfig.email.apiKey) {
    return { skipped: true, reason: "RESEND_API_KEY nao configurada" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${integrationConfig.email.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: integrationConfig.email.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(error?.message || "Falha ao enviar email");
  }

  return { skipped: false, data: await safeJson(response) };
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
