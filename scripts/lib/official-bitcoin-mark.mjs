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

/** Official ₿ with a visible clockwise lean for tees, sweats, hats. */
export async function garmentMarkPng(width = 256) {
  const base = await officialMarkPng("b", Math.round(width * 1.28));
  return sharp(base)
    .rotate(GARMENT_LEAN_DEG, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize({
      width,
      height: width,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}
