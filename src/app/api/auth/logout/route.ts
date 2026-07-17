import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("[AUTH/LOGOUT]", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
