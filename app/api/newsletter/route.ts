import { NextResponse } from "next/server";
import { z } from "zod";
import { guardShopPost } from "@/lib/request-guard";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const blocked = guardShopPost(req, "newsletter", 8, 10 * 60_000);
  if (blocked) return blocked;
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Need a valid email." }, { status: 400 });
  }
  console.info("newsletter", parsed.data.email);
  return NextResponse.json({ ok: true });
}
