/**
 * Client Shopify Storefront API (GraphQL)
 * -----------------------------------------
 * C'est le pont entre ton front Next.js (Vercel) et le back Shopify.
 * Shopify héberge : produits, panier, checkout, paiements (Stripe/Apple Pay/Google Pay), Printful.
 * Toi tu héberges : toute la vitrine + les animations, qui tapent cette API.
 *
 * Variables d'env à mettre dans .env.local :
 *   NEXT_PUBLIC_SHOPIFY_DOMAIN=astratech-9955.myshopify.com   (ou ton domaine renommé)
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxxx                 (Storefront API access token)
 *
 * Où trouver le token : Shopify admin → Settings → Apps and sales channels
 *   → Develop apps → Create an app → Storefront API → cocher les scopes
 *   unauthenticated_read_product_listings + unauthenticated_write_checkouts.
 */

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;
const API_VERSION = "2025-01";
const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

type GraphQLResponse<T> = { data?: T; errors?: Array<{ message: string }> };

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    // ISR : le catalogue est mis en cache 60s côté Next, révalidé en tâche de fond.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Shopify API ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL: ${json.errors.map((e) => e.message).join(", ")}`);
  }
  return json.data as T;
}

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export type Money = { amount: string; currencyCode: string };

export type ProductImage = { url: string; altText: string | null; width: number; height: number };

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: Array<{ name: string; value: string }>;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  priceRange: { minVariantPrice: Money };
  variants: ProductVariant[];
  options: Array<{ name: string; values: string[] }>;
};

/* ------------------------------------------------------------------ */
/*  Fragments                                                         */
/* ------------------------------------------------------------------ */

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    featuredImage { url altText width height }
    images(first: 12) { nodes { url altText width height } }
    priceRange { minVariantPrice { amount currencyCode } }
    options { name values }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
`;

/* ------------------------------------------------------------------ */
/*  Requêtes catalogue                                               */
/* ------------------------------------------------------------------ */

function normalizeProduct(node: any): Product {
  return {
    ...node,
    images: node.images?.nodes ?? [],
    variants: node.variants?.nodes ?? [],
  };
}

export async function getAllProducts(first = 50): Promise<Product[]> {
  const data = await shopifyFetch<{ products: { nodes: any[] } }>(
    /* GraphQL */ `
      ${PRODUCT_FRAGMENT}
      query AllProducts($first: Int!) {
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
          nodes { ...ProductFields }
        }
      }
    `,
    { first }
  );
  return data.products.nodes.map(normalizeProduct);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{ product: any | null }>(
    /* GraphQL */ `
      ${PRODUCT_FRAGMENT}
      query ProductByHandle($handle: String!) {
        product(handle: $handle) { ...ProductFields }
      }
    `,
    { handle }
  );
  return data.product ? normalizeProduct(data.product) : null;
}

/* ------------------------------------------------------------------ */
/*  Panier (Cart API) → mène au checkout hébergé Shopify             */
/* ------------------------------------------------------------------ */

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: Array<{
    id: string;
    quantity: number;
    cost: { totalAmount: Money; amountPerQuantity: Money };
    merchandise: {
      id: string;
      title: string;
      price: Money;
      image: ProductImage | null;
      product: { title: string; handle: string };
    };
  }>;
};

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount { amount currencyCode }
          amountPerQuantity { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText width height }
            product { title handle }
          }
        }
      }
    }
  }
`;

function normalizeCart(cart: any): Cart {
  return { ...cart, lines: cart.lines?.nodes ?? [] };
}

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: any } }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation { cartCreate { cart { ...CartFields } } }
    `
  );
  return normalizeCart(data.cartCreate.cart);
}

export async function addToCart(cartId: string, variantId: string, quantity = 1): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: any } }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation AddLine($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
      }
    `,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] }
  );
  return normalizeCart(data.cartLinesAdd.cart);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  // quantity = 0 → Shopify retire la ligne. On laisse le back gérer ce cas.
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: any } }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation UpdateLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } }
      }
    `,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function removeFromCart(cartId: string, lineId: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: any } }>(
    /* GraphQL */ `
      ${CART_FRAGMENT}
      mutation RemoveLine($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } }
      }
    `,
    { cartId, lineIds: [lineId] }
  );
  return normalizeCart(data.cartLinesRemove.cart);
}
