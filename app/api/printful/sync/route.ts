import { NextResponse } from "next/server";
import { printfulConfigured } from "@/lib/printful";
import { shopifyConfigured } from "@/lib/shopify";

function opsAllowed(req: Request) {
  const secret = process.env.OPS_SECRET || process.env.PRINTFUL_SYNC_SECRET;
  if (process.env.NODE_ENV !== "production") return true;
  const auth = req.headers.get("authorization");
  return Boolean(secret && auth === `Bearer ${secret}`);
}

export async function GET(req: Request) {
  if (!opsAllowed(req)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    printful: printfulConfigured(),
    shopify: shopifyConfigured(),
    note: "Catalog is local until Printful variant IDs and Shopify handles are set.",
  });
}
