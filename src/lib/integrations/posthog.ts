import { integrationConfig } from "@/lib/integrations/config";

type CaptureEventInput = {
  event: string;
  distinctId: string;
  properties?: Record<string, unknown>;
};

export async function captureEvent(input: CaptureEventInput) {
  if (!integrationConfig.posthog.apiKey) {
    return { skipped: true, reason: "PostHog nao configurado" };
  }

  const response = await fetch(`${integrationConfig.posthog.host}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: integrationConfig.posthog.apiKey,
      event: input.event,
      distinct_id: input.distinctId,
      properties: input.properties || {},
    }),
  });

  if (!response.ok) {
    throw new Error("Falha ao registrar evento no PostHog");
  }

  return { skipped: false };
}
