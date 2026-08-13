import { NextResponse } from "next/server";
import { printfulConfigured } from "@/lib/printful";
import { shopifyConfigured } from "@/lib/shopify";

export async function GET() {
  return NextResponse.json({
    printful: printfulConfigured(),
    shopify: shopifyConfigured(),
    note: "Catalog is local until Printful variant IDs and Shopify handles are set.",
  });
}
