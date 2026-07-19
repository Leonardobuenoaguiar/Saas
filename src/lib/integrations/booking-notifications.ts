import { createGoogleCalendarEvent } from "@/lib/integrations/google-calendar";
import { captureEvent } from "@/lib/integrations/posthog";
import { sendEmail } from "@/lib/integrations/email";
import { sendWhatsAppTemplate } from "@/lib/integrations/whatsapp";

type BookingNotificationInput = {
  appointmentId: string;
  companyId: string;
  companyName: string;
  companyEmail?: string | null;
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  serviceName: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
};

export async function notifyBookingRequested(input: BookingNotificationInput) {
  const html = buildBookingEmailHtml(input);
  const text = `${input.clientName}, seu agendamento de ${input.serviceName} em ${input.companyName} foi solicitado para ${input.date} as ${input.startTime}.`;

  const tasks: Array<Promise<unknown>> = [
    captureEvent({
      event: "booking_requested",
      distinctId: input.companyId,
      properties: {
        appointmentId: input.appointmentId,
        serviceName: input.serviceName,
        employeeName: input.employeeName,
        hasClientEmail: Boolean(input.clientEmail),
        hasClientPhone: Boolean(input.clientPhone),
      },
    }),
    createGoogleCalendarEvent({
      summary: `${input.serviceName} - ${input.clientName}`,
      description: `Agendamento solicitado pelo FlowBook. Profissional: ${input.employeeName}.`,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
    }),
  ];

  if (input.clientEmail) {
    tasks.push(
      sendEmail({
        to: input.clientEmail,
        subject: `Agendamento solicitado em ${input.companyName}`,
        html,
        text,
      })
    );
  }

  if (input.companyEmail) {
    tasks.push(
      sendEmail({
        to: input.companyEmail,
        subject: "Novo agendamento solicitado",
        html,
        text: `Novo agendamento: ${input.clientName}, ${input.serviceName}, ${input.date} ${input.startTime}.`,
      })
    );
  }

  if (input.clientPhone) {
    tasks.push(
      sendWhatsAppTemplate({
        to: input.clientPhone,
        parameters: [input.clientName, input.serviceName, input.date, input.startTime, input.companyName],
      })
    );
  }

  const results = await Promise.allSettled(tasks);
  return results.map((result) => (result.status === "fulfilled" ? result.value : { error: result.reason?.message }));
}

function buildBookingEmailHtml(input: BookingNotificationInput) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <h1 style="font-size: 22px;">Agendamento solicitado</h1>
      <p>Ola, ${escapeHtml(input.clientName)}.</p>
      <p>Recebemos sua solicitacao de agendamento em <strong>${escapeHtml(input.companyName)}</strong>.</p>
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 18px 0;">
        <p><strong>Servico:</strong> ${escapeHtml(input.serviceName)}</p>
        <p><strong>Profissional:</strong> ${escapeHtml(input.employeeName)}</p>
        <p><strong>Data:</strong> ${escapeHtml(input.date)}</p>
        <p><strong>Horario:</strong> ${escapeHtml(input.startTime)}</p>
      </div>
      <p>A empresa pode entrar em contato para confirmar o horario.</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
