import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  org: z.string().min(2),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Fill every field — a short note is enough." },
      { status: 400 },
    );
  }
  console.info("wholesale", parsed.data);
  return NextResponse.json({ ok: true });
}
