import { NextResponse } from "next/server";
import { publicCapabilities } from "@/lib/config/capabilities";

export async function GET() {
  return NextResponse.json({ ok: true, ...publicCapabilities() });
}
