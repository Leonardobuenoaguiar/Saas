import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { createCloudinarySignature } from "@/lib/integrations/cloudinary";

const signatureSchema = z.object({
  folder: z.string().min(1).max(120).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const parsed = signatureSchema.safeParse(await request.json().catch(() => ({})));

    if (!parsed.success) {
      return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
    }

    const folder = parsed.data.folder || `flowbook/${session.companyId}`;
    const signature = createCloudinarySignature(folder);

    if (!signature.configured) {
      return NextResponse.json({ error: "Cloudinary nao configurado" }, { status: 503 });
    }

    return NextResponse.json({ data: signature });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 });
    }

    console.error("[UPLOADS/CLOUDINARY/SIGNATURE]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
