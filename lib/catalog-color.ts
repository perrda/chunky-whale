/** Server / QA only. Do not import from client components — uses path/sharp. */
import path from "path";
import sharp from "sharp";
import { CLOTHING_COLORS } from "./drop-07";
import { needsRecolor, products as allProducts, productImage, RETIRED_SLUGS, takesColourways, type Product } from "./products";
import { garmentLightness, hexToRgb, recolorRaw, rgbToHsl } from "./recolor-garment";

const CHECK_COLORS = CLOTHING_COLORS.filter((c) =>
  ["bone", "ink", "navy", "royal"].includes(c.id),
);

export type ColorMatchIssue = {
  slug: string;
  name: string;
  color: string;
  image: string;
  targetL: number;
  gotL: number;
  detail: string;
};

async function loadRaw(abs: string) {
  const { data, info } = await sharp(abs)
    .resize(320, 320, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data: Buffer.from(data), w: info.width, h: info.height };
}

export async function auditColorMatch(
  products: Product[] = allProducts.filter((p) => !p.retired && !RETIRED_SLUGS.has(p.slug)),
  publicDir = path.join(process.cwd(), "public"),
): Promise<ColorMatchIssue[]> {
  const issues: ColorMatchIssue[] = [];
  for (const p of products) {
    if (takesColourways(p) !== "garment") continue;
    const seen = new Set<string>();
    for (const swatch of CHECK_COLORS) {
      const rel = productImage(p, swatch.id).replace(/^\//, "");
      const abs = path.join(publicDir, rel);
      const key = `${rel}|${swatch.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      let raw: { data: Buffer; w: number; h: number };
      try {
        raw = await loadRaw(abs);
      } catch {
        continue;
      }
      const realPhoto = !needsRecolor(p, swatch.id);
      if (!realPhoto) recolorRaw(raw.data, raw.w, raw.h, swatch.hex);
      const gotL = garmentLightness(raw.data, raw.w, raw.h);
      const [, , targetL] = rgbToHsl(...hexToRgb(swatch.hex));
      const drift = Math.abs(gotL - targetL);
      const allowed = targetL > 0.7 ? 0.28 : targetL < 0.2 ? 0.22 : 0.26;
      if (drift > allowed) {
        issues.push({
          slug: p.slug,
          name: p.name,
          color: swatch.label,
          image: `/${rel}`,
          targetL,
          gotL,
          detail: `${realPhoto ? "Studio photo" : "Recolour"} for ${swatch.label} is lightness ${gotL.toFixed(2)} (want ~${targetL.toFixed(2)}). The swatch and the picture must match.`,
        });
      }
    }
  }
  return issues;
}
