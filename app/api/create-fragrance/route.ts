import { NextResponse } from "next/server";
import { createFragranceSchema } from "@/lib/validation/schemas";
import { assertNoFormulaPercent } from "@/lib/fragrance/create-concept";
import { isSupabaseConfigured } from "@/lib/supabase-stub/index";

// Rate-limit-ready: key on IP once a store exists. Do not accept formula percentages.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!assertNoFormulaPercent(body)) {
    return NextResponse.json(
      { ok: false, message: "This is a preference portrait. Formula percentages are not accepted." },
      { status: 400 },
    );
  }
  const parsed = createFragranceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "The portrait is incomplete." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: true,
        archived: "local",
        message: "Archived locally until the house is connected. Nothing was stored on a server.",
      },
      { status: 202 },
    );
  }

  return NextResponse.json({
    ok: false,
    message: "The archive client is configured but custom fragrance storage is not wired in this build.",
  });
}
