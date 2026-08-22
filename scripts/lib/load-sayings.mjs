import { readFileSync } from "fs";
import path from "path";

export function drop12Marks() {
  const src = readFileSync(path.join(process.cwd(), "lib/sayings.json"), "utf8");
  return JSON.parse(src).marks;
}

export function sayingJobs(kind) {
  return drop12Marks().map((m) => ({
    file: `${m.id}-${kind}.png`,
    lines: m[kind] ?? m.tee,
    fill: m.fill,
    face: m.face,
  }));
}
