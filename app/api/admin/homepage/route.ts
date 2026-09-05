import { NextResponse } from "next/server";
import { z } from "zod";
import { writeFile } from "node:fs/promises";
import { getAdminState } from "@/lib/admin/auth";

const schema = z.object({
  heroKicker: z.string().min(1).max(80),
  heroTitle: z.string().min(1).max(80),
  heroLine: z.string().min(1).max(160),
  featuredSlug: z.string().min(1).max(80),
  comingSoonLine: z.string().min(1).max(160),
  finderCta: z.string().min(1).max(160),
  createCta: z.string().min(1).max(160),
  nextDropCta: z.string().min(1).max(160),
});

export async function POST(request: Request) {
  const state = await getAdminState();
  if (!state.authenticated) {
    return NextResponse.json({ ok: false, message: "Admin session required." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "The homepage fields need another look." }, { status: 400 });
  }

  try {
    await writeFile("/tmp/rehmat-panjab-homepage-cms.json", JSON.stringify(parsed.data, null, 2), "utf8");
    return NextResponse.json({
      ok: true,
      message:
        "Wrote a preview file under /tmp. Production still reads data/homepage-cms.ts until you replace that module and deploy.",
    });
  } catch {
    return NextResponse.json({
      ok: false,
      message: "Filesystem write is not allowed here. Download the JSON and edit data/homepage-cms.ts.",
    });
  }
}
