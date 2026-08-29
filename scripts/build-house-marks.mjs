/**
 * Build circular house marks from the official Chunky Whale lock.
 * Does not invent a new whale — only circular-crops / retones the same mark.
 *
 * Preferred input (Designer PASS files, if present on the machine):
 *   /workspace/chunky-whale/mark-dark-circle-{64,180,512,800}.png
 *   /workspace/chunky-whale/mark-light-circle-{64,180,512,800}.png
 * Fallback: official X / repo lock (public/brand/chunky-whale-dark.png or
 * chunky-whale-x-avatar.jpg), circular crop. Light lock is the same whale
 * with ivory body on a white disc; orange rim + eye stay.
 */
import { existsSync, mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const HOUSE = "/workspace/chunky-whale";
const OUT = path.join(ROOT, "public/brand");
const SIZES = [64, 180, 512, 800];
const DARK_DISC = { r: 0x0b, g: 0x0d, b: 0x10, alpha: 1 };
const LIGHT_DISC = { r: 255, g: 255, b: 255, alpha: 1 };
const IVORY = { r: 245, g: 241, b: 232 };

function housePath(kind, size) {
  return path.join(HOUSE, `mark-${kind}-circle-${size}.png`);
}

function outPath(kind, size) {
  return path.join(OUT, `mark-${kind}-circle-${size}.png`);
}

function isOrange(r, g, b) {
  return r > 150 && r - b > 70 && r > g + 15 && b < 120;
}

function isDarkDisc(r, g, b) {
  return r < 18 && g < 20 && b < 26;
}

async function copyHouseFiles() {
  const missing = [];
  for (const kind of ["dark", "light"]) {
    for (const size of SIZES) {
      const src = housePath(kind, size);
      if (!existsSync(src)) missing.push(src);
    }
  }
  if (missing.length) return false;
  for (const kind of ["dark", "light"]) {
    for (const size of SIZES) {
      await sharp(housePath(kind, size)).png().toFile(outPath(kind, size));
    }
  }
  return true;
}

async function loadOfficialSource() {
  const candidates = [
    path.join(OUT, "chunky-whale-dark.png"),
    path.join(OUT, "chunky-whale-x-avatar.jpg"),
    "/tmp/whale-fetch2/x400.jpg",
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const tmp = path.join("/tmp", `whale-source-${path.basename(file)}`);
    await sharp(file).toFile(tmp);
    return tmp;
  }
  throw new Error("No official whale source on disk");
}

async function rasterAt(src, size) {
  return sharp(src)
    .resize(size, size, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

function circleMask(size, x, y) {
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const r = size / 2 - 0.5;
  const d = Math.hypot(x - cx, y - cy);
  if (d <= r - 0.75) return 1;
  if (d >= r + 0.75) return 0;
  return Math.max(0, Math.min(1, r + 0.75 - d));
}

function recolorLight(r, g, b) {
  if (isOrange(r, g, b)) return [r, g, b];
  if (isDarkDisc(r, g, b)) return [LIGHT_DISC.r, LIGHT_DISC.g, LIGHT_DISC.b];
  // Same whale body → ivory. Keep a whisper of source luminance so edges stay.
  const t = Math.min(1, (r + g + b) / 90);
  return [
    Math.round(IVORY.r * (0.92 + 0.08 * t)),
    Math.round(IVORY.g * (0.92 + 0.08 * t)),
    Math.round(IVORY.b * (0.92 + 0.08 * t)),
  ];
}

function recolorDark(r, g, b) {
  if (isOrange(r, g, b)) return [r, g, b];
  if (isDarkDisc(r, g, b)) return [DARK_DISC.r, DARK_DISC.g, DARK_DISC.b];
  return [r, g, b];
}

async function writeCircle(src, kind, size) {
  const { data, info } = await rasterAt(src, size);
  const out = Buffer.alloc(size * size * 4);
  const rec = kind === "light" ? recolorLight : recolorDark;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * info.channels;
      const o = (y * size + x) * 4;
      const [r, g, b] = rec(data[i], data[i + 1], data[i + 2]);
      const a = circleMask(size, x, y);
      out[o] = r;
      out[o + 1] = g;
      out[o + 2] = b;
      out[o + 3] = Math.round(255 * a);
    }
  }
  await sharp(out, { raw: { width: size, height: size, channels: 4 } })
    .png()
    .toFile(outPath(kind, size));
}

async function writeChromeAliases() {
  await sharp(outPath("light", 800)).png().toFile(path.join(OUT, "chunky-whale-logo.png"));
  await sharp(outPath("light", 800)).png().toFile(path.join(OUT, "chunky-whale-light.png"));
  await sharp(outPath("dark", 800)).png().toFile(path.join(OUT, "chunky-whale-dark.png"));

  await sharp(outPath("dark", 64)).resize(32, 32).png().toFile(path.join(ROOT, "app/icon.png"));
  await sharp(outPath("light", 180)).png().toFile(path.join(ROOT, "app/apple-icon.png"));

  const ogW = 1200;
  const ogH = 630;
  const mark = 512;
  const left = Math.round((ogW - mark) / 2);
  const top = Math.round((ogH - mark) / 2);
  await sharp({
    create: { width: ogW, height: ogH, channels: 4, background: { ...DARK_DISC, alpha: 1 } },
  })
    .composite([{ input: outPath("dark", 512), left, top }])
    .png()
    .toFile(path.join(OUT, "og-chunky-whale.png"));
}

mkdirSync(OUT, { recursive: true });
const fromHouse = await copyHouseFiles();
if (fromHouse) {
  console.log("house marks: copied Designer PASS files from", HOUSE);
} else {
  const src = await loadOfficialSource();
  console.log("house marks: no /workspace/chunky-whale files; circular crop of", src);
  for (const kind of ["dark", "light"]) {
    for (const size of SIZES) await writeCircle(src, kind, size);
  }
}
await writeChromeAliases();
console.log("house marks: wrote circular locks + favicon/apple/og aliases");
