/** Recolour garment pixels in a studio photo. Keeps white backdrop, ₿ orange, and print type. */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, (n >> 0) & 255];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * ((2 / 3 - t) * 6);
  return p;
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

/** Pure paper — highlights on a white tee stay out of this bucket. */
export function nearWhite(r: number, g: number, b: number) {
  return r > 248 && g > 248 && b > 248 && Math.abs(r - g) < 6 && Math.abs(g - b) < 6;
}

/** Grainy / soft studio backdrop, not cream cloth (chroma stops Bone / totes). */
export function isStudioPaper(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const avg = (r + g + b) / 3;
  return avg > 220 && max - min < 14;
}

function bitcoinOrange(r: number, g: number, b: number) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const deg = h * 360;
  return deg >= 16 && deg <= 48 && s > 0.48 && l > 0.28 && l < 0.72;
}

function flood(data: Uint8ClampedArray | Buffer, w: number, h: number, test: (r: number, g: number, b: number) => boolean) {
  const bg = new Uint8Array(w * h);
  const q: number[] = [];
  const tryPush = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = y * w + x;
    if (bg[i]) return;
    const o = i * 4;
    if (!test(data[o], data[o + 1], data[o + 2])) return;
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

function keptCount(bg: Uint8Array) {
  let kept = 0;
  for (let i = 0; i < bg.length; i++) if (!bg[i]) kept += 1;
  return kept;
}

function ringBackground(data: Uint8ClampedArray | Buffer, w: number, h: number) {
  const bg = new Uint8Array(w * h);
  const ring = Math.max(6, Math.floor(Math.min(w, h) * 0.07));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const edge = x < ring || y < ring || x >= w - ring || y >= h - ring;
      if (!edge) continue;
      const o = (y * w + x) * 4;
      if (isStudioPaper(data[o], data[o + 1], data[o + 2]) || nearWhite(data[o], data[o + 1], data[o + 2])) {
        bg[y * w + x] = 1;
      }
    }
  }
  return bg;
}

/**
 * Backdrop from the image edge. Loose paper wins when a real object remains
 * (black tee + grey halo). Tight paper wins when loose fill ate a white tee.
 */
export function markBackground(data: Uint8ClampedArray | Buffer, w: number, h: number) {
  const loose = flood(data, w, h, isStudioPaper);
  const tight = flood(data, w, h, nearWhite);
  const minKeep = w * h * 0.1;
  if (keptCount(loose) >= minKeep) return loose;
  if (keptCount(tight) >= minKeep) return tight;
  return ringBackground(data, w, h);
}

function dilate(mask: Uint8Array, w: number, h: number, radius = 2) {
  const out = new Uint8Array(mask);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          out[ny * w + nx] = 1;
        }
      }
    }
  }
  return out;
}

/** Manhattan dilate — O(n), safe on 1k+ studio photos in the browser. */
function dilateFast(mask: Uint8Array, w: number, h: number, radius: number) {
  const dist = new Int32Array(w * h);
  dist.fill(1e8);
  for (let i = 0; i < w * h; i++) if (mask[i]) dist[i] = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (x > 0) dist[i] = Math.min(dist[i], dist[i - 1] + 1);
      if (y > 0) dist[i] = Math.min(dist[i], dist[i - w] + 1);
    }
  }
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      if (x < w - 1) dist[i] = Math.min(dist[i], dist[i + 1] + 1);
      if (y < h - 1) dist[i] = Math.min(dist[i], dist[i + w] + 1);
    }
  }
  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) if (dist[i] <= radius) out[i] = 1;
  return out;
}

function median(values: number[]) {
  if (!values.length) return 0.2;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0.2;
}

/**
 * Map garment cloth to the swatch colour. Light swatches (Bone) must
 * become light even when the studio photo is ink/navy. Print and ₿ stay
 * unless the garment itself is Bitcoin orange.
 */
export function recolorRaw(
  data: Uint8ClampedArray | Buffer,
  w: number,
  h: number,
  targetHex: string,
) {
  const bg = markBackground(data, w, h);
  const [th, ts, tl] = rgbToHsl(...hexToRgb(targetHex));
  let cloth = 0;
  let orange = 0;
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    cloth += 1;
    const o = i * 4;
    if (bitcoinOrange(data[o], data[o + 1], data[o + 2])) orange += 1;
  }
  const garmentIsOrange = cloth > 0 && orange / cloth > 0.18;

  const sampleL: number[] = [];
  const orangeMask = new Uint8Array(w * h);
  const typeSeed = new Uint8Array(w * h);

  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    const o = i * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    if (!garmentIsOrange && bitcoinOrange(r, g, b)) {
      orangeMask[i] = 1;
      continue;
    }
    const [, , l] = rgbToHsl(r, g, b);
    sampleL.push(l);
  }
  const sourceL = median(sampleL);

  for (let i = 0; i < w * h; i++) {
    if (bg[i] || orangeMask[i]) continue;
    const o = i * 4;
    const [, s, l] = rgbToHsl(data[o], data[o + 1], data[o + 2]);
    const darkPrint = l < Math.min(0.34, sourceL - 0.2) && s < 0.4;
    const lightPrint = l > Math.max(0.62, sourceL + 0.2) && s < 0.3;
    if (darkPrint || lightPrint) typeSeed[i] = 1;
  }

  const halo = Math.max(4, Math.round(Math.min(w, h) / 80));
  const nearBackdrop = dilateFast(bg, w, h, halo);
  for (let i = 0; i < w * h; i++) {
    if (typeSeed[i] && nearBackdrop[i]) typeSeed[i] = 0;
  }

  const print = dilate(typeSeed, w, h, 2);
  const minL = Math.max(0.04, tl - 0.2);
  const maxL = Math.min(0.97, tl + 0.16);

  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    const o = i * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    if (orangeMask[i] || (!garmentIsOrange && bitcoinOrange(r, g, b))) continue;
    if (print[i]) {
      const [, , l] = rgbToHsl(r, g, b);
      const printDark = l < 0.42;
      if (tl > 0.62 && !printDark) {
        const [nr, ng, nb] = hslToRgb(0.07, 0.04, Math.min(0.16, 1 - l * 0.85));
        data[o] = nr;
        data[o + 1] = ng;
        data[o + 2] = nb;
      } else if (tl < 0.38 && printDark) {
        const [nr, ng, nb] = hslToRgb(0.1, 0.02, Math.max(0.88, 1 - l * 0.15));
        data[o] = nr;
        data[o + 1] = ng;
        data[o + 2] = nb;
      }
      continue;
    }
    const [, s, l] = rgbToHsl(r, g, b);
    const newL = Math.min(maxL, Math.max(minL, tl + (l - sourceL) * 0.42));
    const newS = Math.min(0.78, ts * 0.9 + s * 0.08);
    const [nr, ng, nb] = hslToRgb(th, newS, newL);
    data[o] = nr;
    data[o + 1] = ng;
    data[o + 2] = nb;
  }
  return { sourceL, targetL: tl };
}

export function recolorGarmentData(image: ImageData, targetHex: string) {
  recolorRaw(image.data, image.width, image.height, targetHex);
  return image;
}

export function paintRecolor(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  targetHex: string,
) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0);
  const snap = ctx.getImageData(0, 0, w, h);
  recolorGarmentData(snap, targetHex);
  ctx.putImageData(snap, 0, 0);
}

export function garmentLightness(data: Uint8ClampedArray | Buffer, w: number, h: number) {
  const bg = markBackground(data, w, h);
  const ls: number[] = [];
  let orange = 0;
  let cloth = 0;
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    cloth += 1;
    const o = i * 4;
    if (bitcoinOrange(data[o], data[o + 1], data[o + 2])) orange += 1;
  }
  const garmentIsOrange = cloth > 0 && orange / cloth > 0.18;
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    const o = i * 4;
    if (!garmentIsOrange && bitcoinOrange(data[o], data[o + 1], data[o + 2])) continue;
    const [, , l] = rgbToHsl(data[o], data[o + 1], data[o + 2]);
    if (l > 0.97) continue;
    ls.push(l);
  }
  return median(ls);
}
