import { writeFileSync } from "fs";
import sharp from "sharp";
import { garmentLightness, hexToRgb, recolorRaw, rgbToHsl } from "../lib/recolor-garment";

async function main() {
  const file = process.argv[2] ?? "public/products/genesis-2009-tee.png";
  const hex = process.argv[3] ?? "#EDE6D9";
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const buf = Buffer.from(data);
  recolorRaw(buf, info.width, info.height, hex);
  const got = garmentLightness(buf, info.width, info.height);
  const [, , want] = rgbToHsl(...hexToRgb(hex));
  const png = await sharp(buf, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  writeFileSync("/tmp/recolor-preview.png", png);
  console.log({ file, hex, got: Number(got.toFixed(3)), want: Number(want.toFixed(3)) });
}

main();
