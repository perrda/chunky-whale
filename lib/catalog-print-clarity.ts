/** Server / QA only. Do not import from client components — uses fs/sharp. */
import path from "path";
import sharp from "sharp";
import { largestOrangeMarkTilt } from "./catalog-bitcoin-mark";
import { printSpecForFile, normalizeSlogan } from "./catalog-print-lines";
import { recolorRaw, rgbToHsl } from "./recolor-garment";
import type { Product } from "./products";

const PHOTO_LOOSE = new Set(["21m-hat.png"]);

export type PrintClarityIssue = {
  slug: string;
  name: string;
  image: string;
  detail: string;
};

function nearWhite(r: number, g: number, b: number) {
  const [, s, l] = rgbToHsl(r, g, b);
  return (r > 232 && g > 232 && b > 232) || (l > 0.91 && s < 0.12);
}

function orange(r: number, g: number, b: number) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const deg = h * 360;
  return deg >= 12 && deg <= 54 && s > 0.32 && l > 0.2 && l < 0.86;
}

function floodBg(data: Buffer, w: number, h: number) {
  const bg = new Uint8Array(w * h);
  const q: number[] = [];
  const tryPush = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (bg[i]) return;
    const o = i * 4;
    if (!nearWhite(data[o], data[o + 1], data[o + 2])) return;
    bg[i] = 1;
    q.push(i);
  };
  for (let x = 0; x < w; x++) {
    tryPush(x, 0);
    tryPush(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    tryPush(0, y);
    tryPush(w - 1, y);
  }
  while (q.length) {
    const i = q.pop()!;
    const x = i % w;
    const y = (i - x) / w;
    tryPush(x + 1, y);
    tryPush(x - 1, y);
    tryPush(x, y + 1);
    tryPush(x, y - 1);
  }
  return bg;
}

type Blob = { cells: number[]; area: number; minx: number; maxx: number; miny: number; maxy: number };

function blobsFrom(mask: Uint8Array, w: number, h: number, minArea: number) {
  const seen = new Uint8Array(w * h);
  const blobs: Blob[] = [];
  for (let start = 0; start < w * h; start++) {
    if (!mask[start] || seen[start]) continue;
    const stack = [start];
    const cells: number[] = [];
    let minx = w;
    let maxx = 0;
    let miny = h;
    let maxy = 0;
    seen[start] = 1;
    while (stack.length) {
      const i = stack.pop()!;
      cells.push(i);
      const x = i % w;
      const y = (i - x) / w;
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const n = ny * w + nx;
        if (seen[n] || !mask[n]) continue;
        seen[n] = 1;
        stack.push(n);
      }
    }
    if (cells.length < minArea) continue;
    blobs.push({ cells, area: cells.length, minx, maxx, miny, maxy });
  }
  return blobs;
}

function perimeter(blob: Blob, mask: Uint8Array, w: number, h: number) {
  let p = 0;
  for (const i of blob.cells) {
    const x = i % w;
    const y = (i - x) / w;
    if (x === 0 || y === 0 || x === w - 1 || y === h - 1) {
      p += 1;
      continue;
    }
    if (!mask[i - 1] || !mask[i + 1] || !mask[i - w] || !mask[i + w]) p += 1;
  }
  return p;
}

async function loadRaw(abs: string, size = 640) {
  const { data, info } = await sharp(abs)
    .resize(size, size, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), w: info.width, h: info.height };
}

function scorePrint(data: Buffer, w: number, h: number, glass: boolean) {
  const bg = floodBg(data, w, h);
  let clothN = 0;
  let clothL = 0;
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    const o = i * 4;
    if (orange(data[o], data[o + 1], data[o + 2])) continue;
    clothL += rgbToHsl(data[o], data[o + 1], data[o + 2])[2];
    clothN += 1;
  }
  clothL = clothN ? clothL / clothN : 0.2;

  const print = new Uint8Array(w * h);
  const mark = new Uint8Array(w * h);
  let printN = 0;
  let markN = 0;
  let markOff = 0;
  const chestTop = Math.floor(h * 0.14);
  const chestBot = Math.floor(h * 0.72);
  const chestLeft = Math.floor(w * 0.16);
  const chestRight = Math.floor(w * 0.84);

  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    const x = i % w;
    const y = (i - x) / w;
    if (orange(data[o], data[o + 1], data[o + 2])) {
      mark[i] = 1;
      markN += 1;
      if (bg[i]) markOff += 1;
      continue;
    }
    if (bg[i]) continue;
    if (x < chestLeft || x > chestRight || y < chestTop || y > chestBot) continue;
    const [, s, l] = rgbToHsl(data[o], data[o + 1], data[o + 2]);
    const contrast = Math.abs(l - clothL);
    const lightOnDark = !glass && clothL < 0.45 && l > 0.78 && s < 0.2;
    const darkOnLight = (glass || clothL >= 0.45) && l < 0.22 && s < 0.28;
    if ((lightOnDark || darkOnLight) && contrast > 0.35) {
      print[i] = 1;
      printN += 1;
    }
  }

  const letterBlobs = blobsFrom(print, w, h, Math.max(18, Math.floor(w * h * 0.00025)));
  const crumbs = blobsFrom(print, w, h, 2).filter((b) => b.area < 16);
  let jagged = 0;
  let solid = 0;
  for (const blob of letterBlobs) {
    const peri = perimeter(blob, print, w, h);
    const compact = (4 * Math.PI * blob.area) / Math.max(1, peri * peri);
    const bw = blob.maxx - blob.minx + 1;
    const bh = blob.maxy - blob.miny + 1;
    const fill = blob.area / Math.max(1, bw * bh);
    if (compact < 0.045 || fill < 0.22) jagged += 1;
    else solid += 1;
  }

  const garment = w * h - [...bg].filter(Boolean).length;
  return {
    clothL,
    printN,
    markN,
    markOff,
    garment,
    letters: letterBlobs.length,
    crumbs: crumbs.length,
    jagged,
    solid,
    printRatio: garment > 0 ? printN / garment : 0,
  };
}

export async function auditOnePrint(
  abs: string,
  product: Product,
  image: string,
): Promise<PrintClarityIssue[]> {
  const file = path.basename(image);
  const spec = printSpecForFile(file);
  const glass = /whiskey|shot/.test(file);
  const loose = PHOTO_LOOSE.has(file);
  const issues: PrintClarityIssue[] = [];
  const push = (detail: string) =>
    issues.push({ slug: product.slug, name: product.name, image, detail });

  let raw = await loadRaw(abs);
  let s = scorePrint(raw.data, raw.w, raw.h, glass);

  if (!spec?.markOnly && !loose) {
    const lettersExpected = (spec?.lines.join("") ?? "XXXX").replace(/\s/g, "").length;
    const minPrint = raw.w * raw.h * (lettersExpected < 8 ? 0.0012 : 0.003);
    if (s.printN < minPrint) {
      push("Chest print is missing or too faint. Buyer must read the line on the photo.");
    }
    if (s.printRatio > 0.18) {
      push("Chest looks flooded (leftover slogan or a stamp box). Wipe the old line and restamp Inter.");
    }
    if (s.solid >= 3 && s.crumbs > s.solid * 14 + 80) {
      push(
        `Type is distressed / speckled (${s.crumbs} crumbs vs ${s.solid} solid letters). Stamp solid Inter — no grunge, no leftover HODL.`,
      );
    }
    if (s.jagged > s.solid && s.letters > 2) {
      push("Letters are broken or jagged. Rebuild from a blank ghost with the high-DPI Inter stamp.");
    }
    if (s.solid < 2 && (spec?.lines.length ?? 1) > 0) {
      push("Cannot find complete letters on the garment. The writing must be readable at card size.");
    }
  }

  const mark = await largestOrangeMarkTilt(abs);
  if (!glass && !loose) {
    if (!mark.found) {
      push("Official ₿ is missing or unreadable on the product.");
    } else if (!mark.clockwise && (mark.primary || /bitcoin-daddy|bitcoin-mummy|b-mark|btc-b/.test(product.slug))) {
      push("Bitcoin ₿ must lean right (clockwise). Never upright or left-leaning.");
    }
    if (s.markOff > 8) {
      push("₿ is hanging off the product into the white backdrop. Keep the mark fully on the object.");
    }
  }

  if (spec && !spec.markOnly && spec.lines.length) {
    const onPhoto = normalizeSlogan(spec.lines.join(" "));
    const title = normalizeSlogan(product.name);
    if (onPhoto && title && !title.includes(onPhoto) && !onPhoto.includes(title)) {
      const overlap = onPhoto.split(" ").some((w) => w.length > 3 && (title.includes(w) || w.includes(title.split(" ")[0] ?? "____")));
      if (!overlap) {
        push(`Photo line “${spec.lines.join(" ")}” does not match title “${product.name}”.`);
      }
    }
  }

  if (!loose && !glass && !spec?.markOnly) {
    for (const [label, hex] of [
      ["Bone", "#EDE6D9"],
      ["Ink", "#0B0C0E"],
    ] as const) {
      const copy = Buffer.from(raw.data);
      recolorRaw(copy, raw.w, raw.h, hex);
      const after = scorePrint(copy, raw.w, raw.h, false);
      if (after.solid < 2 || after.printN < raw.w * raw.h * 0.003) {
        push(`Recolour to ${label} smashed the writing. Print pixels must stay solid letters.`);
      }
      if (after.solid >= 3 && after.crumbs > after.solid * 16 + 90) {
        push(`Recolour to ${label} made the type look distressed. Protect letter edges.`);
      }
    }
  }

  return issues;
}

export async function auditPrintClarity(
  products: Product[],
  publicDir = path.join(process.cwd(), "public"),
): Promise<PrintClarityIssue[]> {
  const issues: PrintClarityIssue[] = [];
  for (const p of products) {
    const shots = [p.image, ...Object.values(p.imagesByColor ?? {})].filter((v, i, a) => a.indexOf(v) === i);
    for (const image of shots) {
      const abs = path.join(publicDir, image.replace(/^\//, ""));
      try {
        issues.push(...(await auditOnePrint(abs, p, image)));
      } catch (err) {
        issues.push({
          slug: p.slug,
          name: p.name,
          image,
          detail: `Could not read photo for print QA (${err instanceof Error ? err.message : "error"}).`,
        });
      }
    }
  }
  return issues;
}
