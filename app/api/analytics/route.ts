import { NextResponse } from "next/server";
import { analyticsEventSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = analyticsEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
