import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getIntegrationStatus, integrationConfig } from "@/lib/integrations/config";

export async function GET() {
  try {
    await requireAuth();

    return NextResponse.json({
      data: {
        status: getIntegrationStatus(),
        providers: {
          email: integrationConfig.email.provider,
          whatsapp: integrationConfig.whatsapp.provider,
          billing: integrationConfig.billing.provider,
          mapsMode: integrationConfig.google.mapsApiKey ? "api" : "external-link",
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

    console.error("[INTEGRATIONS/STATUS]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
