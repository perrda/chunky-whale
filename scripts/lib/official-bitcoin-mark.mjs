/**
 * Official bitboy 2010 Bitcoin mark. One file — do not invent a vertical B.
 * Coin: orange #F7931A, white ₿, ~14° clockwise.
 * Garment stamp: the same ₿ in orange, no circle.
 */
import { readFileSync } from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
export const BITCOIN_ORANGE = "#F7931A";
export const COIN_SVG = path.join(ROOT, "public/brand/bitcoin-coin.svg");
export const B_SVG = path.join(ROOT, "public/brand/bitcoin-b.svg");

export async function officialMarkPng(kind = "b", width = 256) {
  const file = kind === "coin" ? COIN_SVG : B_SVG;
  const svg = readFileSync(file);
  return sharp(svg).resize({ width, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}
