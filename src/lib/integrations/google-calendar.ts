import { integrationConfig } from "@/lib/integrations/config";

type CalendarEventInput = {
  summary: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  timeZone?: string;
};

export async function createGoogleCalendarEvent(input: CalendarEventInput) {
  if (!integrationConfig.google.calendarAccessToken) {
    return { skipped: true, reason: "Google Calendar nao configurado" };
  }

  const timeZone = input.timeZone || "America/Sao_Paulo";
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      integrationConfig.google.calendarId
    )}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${integrationConfig.google.calendarAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: input.summary,
        description: input.description,
        start: { dateTime: `${input.date}T${input.startTime}:00`, timeZone },
        end: { dateTime: `${input.date}T${input.endTime}:00`, timeZone },
      }),
    }
  );

  if (!response.ok) {
    const error = await safeJson(response);
    throw new Error(error?.error?.message || "Falha ao criar evento no Google Calendar");
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
