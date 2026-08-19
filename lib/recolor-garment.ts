/** Recolour garment pixels in a studio photo. Keeps white backdrop, ₿ orange, and ink/bone type. */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
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
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
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

function nearWhite(r: number, g: number, b: number) {
  const [, s, l] = rgbToHsl(r, g, b);
  return (r > 232 && g > 232 && b > 232) || (l > 0.91 && s < 0.12);
}

function bitcoinOrange(r: number, g: number, b: number) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const deg = h * 360;
  return deg >= 16 && deg <= 48 && s > 0.48 && l > 0.28 && l < 0.72;
}

function markBackground(data: Uint8ClampedArray, w: number, h: number) {
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

export function recolorGarmentData(image: ImageData, targetHex: string) {
  const { data, width: w, height: h } = image;
  const bg = markBackground(data, w, h);
  const [th, ts, tl] = rgbToHsl(...hexToRgb(targetHex));

  let garment = 0;
  let orange = 0;
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    garment++;
    const o = i * 4;
    if (bitcoinOrange(data[o], data[o + 1], data[o + 2])) orange++;
  }
  const protectOrange = garment > 0 && orange / garment < 0.14;

  for (let i = 0; i < w * h; i++) {
    if (bg[i]) continue;
    const o = i * 4;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const [hh, s, l] = rgbToHsl(r, g, b);

    if (protectOrange && bitcoinOrange(r, g, b)) continue;
    if (l > 0.86 && s < 0.18) continue;
    if (l < 0.1 && s < 0.25) continue;

    const outL = Math.min(0.92, Math.max(0.06, l * 0.72 + tl * 0.28));
    const [nr, ng, nb] = hslToRgb(th, Math.min(0.72, ts * 0.92 + s * 0.08), outL);
    data[o] = nr;
    data[o + 1] = ng;
    data[o + 2] = nb;
    void hh;
  }
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
