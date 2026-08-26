import { NextResponse } from "next/server";
import { z } from "zod";
import { saveWholesale } from "@/lib/inbox";
import { guardShopPost } from "@/lib/request-guard";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  org: z.string().min(2),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  const blocked = guardShopPost(req, "wholesale", 5, 10 * 60_000);
  if (blocked) return blocked;
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Fill every field — a short note is enough." },
      { status: 400 },
    );
  }
  await saveWholesale(parsed.data);
  return NextResponse.json({ ok: true });
}
