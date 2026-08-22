/**
 * Official bitboy 2010 Bitcoin mark. One file — do not invent a vertical B.
 * Coin: orange #F7931A, white ₿, ~14° clockwise.
 * Garment stamp: the same ₿ in orange, rotated so the lean is obvious on a shirt.
 */
import { readFileSync } from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
export const BITCOIN_ORANGE = "#F7931A";
export const COIN_SVG = path.join(ROOT, "public/brand/bitcoin-coin.svg");
export const B_SVG = path.join(ROOT, "public/brand/bitcoin-b.svg");

/** Extra clockwise degrees on garments so the official italic reads as lean-right at card size. */
export const GARMENT_LEAN_DEG = 16;

export async function officialMarkPng(kind = "b", width = 256) {
  const file = kind === "coin" ? COIN_SVG : B_SVG;
  const svg = readFileSync(file);
  return sharp(svg).resize({ width, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

/** Official ₿ with a visible clockwise lean — rotate in SVG, then rasterise once. */
export async function garmentMarkPng(width = 256) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}" viewBox="-8 -8 52 62">
  <g transform="rotate(${GARMENT_LEAN_DEG} 18 23)">
    <g transform="translate(-16 -10)">
      <path fill="${BITCOIN_ORANGE}" d="M46.11,27.441c0.636-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4,5.614c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439,5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934,3.75s2.605,0.597,2.55,0.634c1.423,0.355,1.679,1.296,1.636,2.044l-1.637,6.571c0.098,0.025,0.225,0.061,0.365,0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296,9.205c-0.174,0.432-0.615,1.08-1.609,0.834,0.035,0.051-2.552-0.637-2.552-0.637l-1.75,4.037,4.588,1.144c0.85,0.213,1.684,0.436,2.504,0.646l-1.453,5.834,3.507,0.875,1.438-5.782c0.958,0.26,1.888,0.5,2.798,0.726l-1.434,5.745,3.511,0.875,1.453-5.823c6.009,1.137,10.522,0.676,12.419-4.759,1.528-4.38-0.076-6.909-3.226-8.559,2.294-0.529,4.022-2.04,4.483-5.155zm-8.022,11.249c-1.085,4.363-8.426,2.003-10.806,1.412l2.081-8.342c2.38,0.594,10.046,1.772,8.725,6.93zm1.086-11.312c-0.99,3.966-7.1,1.951-9.082,1.457l1.684-6.748c1.982,0.494,8.365,1.416,7.398,5.291z"/>
    </g>
  </g>
</svg>`;
  return sharp(Buffer.from(svg))
    .resize({
      width,
      height: width,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}
