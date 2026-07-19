export const integrationConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  email: {
    provider: "resend",
    apiKey: process.env.RESEND_API_KEY || "",
    from: process.env.RESEND_FROM_EMAIL || "FlowBook <noreply@flowbook.local>",
  },
  whatsapp: {
    provider: process.env.WHATSAPP_PROVIDER || "meta",
    metaToken: process.env.WHATSAPP_META_TOKEN || "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    defaultTemplate: process.env.WHATSAPP_DEFAULT_TEMPLATE || "booking_confirmation",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    uploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER || "flowbook",
  },
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  },
  google: {
    mapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    calendarAccessToken: process.env.GOOGLE_CALENDAR_ACCESS_TOKEN || "",
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
  },
  billing: {
    provider: process.env.BILLING_PROVIDER || "asaas",
    asaasApiKey: process.env.ASAAS_API_KEY || "",
    asaasBaseUrl: process.env.ASAAS_BASE_URL || "https://api-sandbox.asaas.com/v3",
    asaasWebhookToken: process.env.ASAAS_WEBHOOK_TOKEN || "",
    mercadoPagoAccessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
    mercadoPagoWebhookSecret: process.env.MERCADO_PAGO_WEBHOOK_SECRET || "",
  },
};

export function getIntegrationStatus() {
  return {
    email: Boolean(integrationConfig.email.apiKey),
    whatsapp: Boolean(integrationConfig.whatsapp.metaToken && integrationConfig.whatsapp.phoneNumberId),
    cloudinary: Boolean(
      integrationConfig.cloudinary.cloudName &&
        integrationConfig.cloudinary.apiKey &&
        integrationConfig.cloudinary.apiSecret
    ),
    posthog: Boolean(integrationConfig.posthog.apiKey),
    googleMaps: Boolean(integrationConfig.google.mapsApiKey),
    googleCalendar: Boolean(integrationConfig.google.calendarAccessToken),
    asaas: Boolean(integrationConfig.billing.asaasApiKey),
    mercadoPago: Boolean(integrationConfig.billing.mercadoPagoAccessToken),
  };
}
