import { products, type Product } from "./products";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

type ShopifyProduct = {
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
};

export function shopifyConfigured() {
  return Boolean(domain && token);
}

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T | null> {
  if (!domain || !token) return null;
  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Shopify Storefront error", res.status);
    return null;
  }
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (json.errors) {
    console.error("Shopify GraphQL errors", json.errors);
    return null;
  }
  return json.data ?? null;
}

export async function getCatalog(): Promise<Product[]> {
  if (!shopifyConfigured()) return products;
  const data = await shopifyFetch<{
    products: { nodes: ShopifyProduct[] };
  }>(`{
    products(first: 50) {
      nodes { handle title description availableForSale }
    }
  }`);
  if (!data?.products.nodes.length) return products;
  return products.map((local) => {
    const remote = data.products.nodes.find(
      (n) => n.handle === (local.shopifyHandle ?? local.slug),
    );
    if (!remote) return local;
    return {
      ...local,
      name: remote.title || local.name,
      description: remote.description || local.description,
    };
  });
}

export async function createShopifyCheckout(lines: { slug: string; qty: number }[]) {
  if (!shopifyConfigured()) return null;
  const merchandise = lines
    .map((l) => {
      const p = products.find((x) => x.slug === l.slug);
      return p
        ? { quantity: l.qty, merchandiseId: `gid://shopify/ProductVariant/${p.slug}` }
        : null;
    })
    .filter(Boolean);
  const data = await shopifyFetch<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(
    `mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { checkoutUrl }
        userErrors { message }
      }
    }`,
    { input: { lines: merchandise } },
  );
  return data?.cartCreate.cart?.checkoutUrl ?? null;
}
