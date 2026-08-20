/** Server / QA only. Do not import from client components — uses sharp. */
import sharp from "sharp";

/** True when the photo looks like a white studio / ghost-mannequin shot, not a lifestyle scene. */
export async function isStudioWhiteBackground(absPath: string): Promise<{
  ok: boolean;
  whiteBorder: number;
  darkBorder: number;
  square: boolean;
}> {
  const meta = await sharp(absPath).metadata();
  const mw = meta.width ?? 1;
  const mh = meta.height ?? 1;
  const square = Math.abs(mw / mh - 1) <= 0.08;
  const { data, info } = await sharp(absPath)
    .resize(256, 256, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const bw = Math.max(3, Math.floor(Math.min(w, h) / 16));
  let n = 0;
  let white = 0;
  let dark = 0;
  const sample = (x: number, y: number) => {
    const o = (y * w + x) * ch;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    n += 1;
    if (r > 232 && g > 232 && b > 232) white += 1;
    if (r + g + b < 240) dark += 1;
  };
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < bw; y++) {
      sample(x, y);
      sample(x, h - 1 - y);
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < bw; x++) {
      sample(x, y);
      sample(w - 1 - x, y);
    }
  }
  const whiteBorder = n ? white / n : 0;
  const darkBorder = n ? dark / n : 0;
  return {
    ok: square && whiteBorder >= 0.55 && darkBorder <= 0.2,
    whiteBorder,
    darkBorder,
    square,
  };
}
