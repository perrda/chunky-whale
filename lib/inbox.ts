import "server-only";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const dir = path.join(process.cwd(), ".data");

async function appendJsonl(file: string, row: Record<string, unknown>) {
  await mkdir(dir, { recursive: true });
  const dest = path.join(dir, file);
  const prev = await readFile(dest, "utf8").catch(() => "");
  await writeFile(dest, `${prev}${JSON.stringify({ ...row, at: new Date().toISOString() })}\n`);
}

export function saveNewsletter(email: string) {
  return appendJsonl("newsletter.jsonl", { email });
}

export function saveWholesale(row: { name: string; email: string; org: string; message: string }) {
  return appendJsonl("wholesale.jsonl", row);
}
