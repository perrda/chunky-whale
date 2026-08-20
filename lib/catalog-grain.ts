import sharp from "sharp";

/** High-frequency speckle on the studio backdrop. Catalog photos must be clean white, not grain. */
export async function studioGrainScore(absPath: string): Promise<{
  grain: number;
  grainy: boolean;
}> {
  const { data, info } = await sharp(absPath)
    .resize(256, 256, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const ch = info.channels;
  const bw = Math.max(4, Math.floor(Math.min(w, h) / 14));
  let n = 0;
  let acc = 0;
  const lum = (x: number, y: number) => {
    const o = (y * w + x) * ch;
    return (data[o] + data[o + 1] + data[o + 2]) / 3;
  };
  const sample = (x: number, y: number) => {
    if (x <= 0 || y <= 0 || x >= w - 1 || y >= h - 1) return;
    const c = lum(x, y);
    if (c < 210) return;
    const high = Math.abs(c - (lum(x - 1, y) + lum(x + 1, y) + lum(x, y - 1) + lum(x, y + 1)) / 4);
    acc += high;
    n += 1;
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
  const grain = n ? acc / n : 0;
  return { grain, grainy: grain > 11 };
}
