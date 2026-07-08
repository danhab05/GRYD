import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllProducts, type Product } from "@/lib/shopify";
import { Jersey } from "@/components/jersey";

export const metadata: Metadata = {
  title: "redline26 — Shop",
  description: "Tous les maillots redline26 : catalogue simple, fond blanc, pièces originales imprimées à la demande.",
};

const PHOTO = "/redline26/product-photo.jpg";

const DEMO: Product[] = [
  demo("gryd-home-beton", "redline26 Home / Bleu nuit", "55.00"),
  demo("gryd-away-craie", "redline26 Away / Crème papier", "55.00"),
  demo("gryd-third-signal", "redline26 Third / Rouge archive", "60.00"),
];

function demo(handle: string, title: string, price: string): Product {
  return {
    id: handle,
    handle,
    title,
    description: "Maillot redline26 original.",
    descriptionHtml: "<p>Maillot redline26 original.</p>",
    featuredImage: { url: PHOTO, altText: `Maillot ${title}`, width: 1024, height: 1024 },
    images: [{ url: PHOTO, altText: `Maillot ${title}`, width: 1024, height: 1024 }],
    priceRange: { minVariantPrice: { amount: price, currencyCode: "EUR" } },
    options: [{ name: "Taille", values: ["S", "M", "L", "XL"] }],
    variants: [],
  };
}

type Colorway = "beton" | "craie" | "signal";

function colorwayFor(handle: string, i: number): Colorway {
  const h = handle.toLowerCase();
  if (h.includes("home") || h.includes("beton")) return "beton";
  if (h.includes("away") || h.includes("craie")) return "craie";
  if (h.includes("third") || h.includes("signal")) return "signal";
  return (["beton", "craie", "signal"] as Colorway[])[i % 3];
}

const money = (amount: string, currency = "EUR") =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(amount));

const brandTitle = (title: string) => title.replace(/^GRYD\s*/i, "redline26 ");

function productLabel(handle: string, i: number) {
  if (handle.includes("third")) return "Meilleure vente";
  if (i === 0) return "Nouveau";
  return "Bientôt disponible";
}

export default async function ShopPage() {
  let products: Product[];
  try {
    const live = await getAllProducts(12);
    products = live.length ? live : DEMO;
  } catch {
    products = DEMO;
  }

  return (
    <div className="shop">
      <header className="shop-head">
        <h1>Maillots redline26 ({products.length})</h1>
        <Link href="/notre-histoire">Notre histoire</Link>
      </header>

      <div className="filters" aria-label="Filtres catalogue">
        <button>Filtres (1)</button>
        <button>Genre</button>
        <button>Prix</button>
        <button>Tailles</button>
      </div>

      <section className="shop-grid" aria-label="Catalogue maillots">
        {products.map((product, i) => (
          <Link href={`/products/${product.handle}`} className="shop-card" key={product.id}>
            <div className="visual">
              {product.featuredImage ? (
                <Image
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ? brandTitle(product.featuredImage.altText) : brandTitle(product.title)}
                  fill
                  sizes="(max-width: 820px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="visual-jersey">
                  <Jersey face="front" colorway={colorwayFor(product.handle, i)} />
                </div>
              )}
            </div>
            <div className="swatches" aria-hidden>
              <span />
              <span />
            </div>
            <p className="label">{productLabel(product.handle, i)}</p>
            <h2>{brandTitle(product.title)}</h2>
            <p className="desc">Maillot de foot redline26 original pour adulte</p>
            <p className="price">{money(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</p>
          </Link>
        ))}
      </section>

      <style>{`
        .shop{position:relative;z-index:2;background:#fff;color:#050505;min-height:100vh;padding:92px 0 60px;font-family:"Helvetica Neue",Arial,sans-serif}
        .shop :global(.display){letter-spacing:-.02em}
        .shop-head{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:28px 32px 20px;border-bottom:1px solid #e7e7e7;background:#fff;position:sticky;top:0;z-index:12}
        .shop-head h1{font-size:22px;line-height:1.1;font-weight:800;letter-spacing:-.02em}
        .shop-head a{font-size:13px;font-weight:800;text-decoration:underline;text-underline-offset:4px}
        .filters{display:flex;gap:8px;overflow-x:auto;padding:18px 32px;border-bottom:1px solid #e7e7e7;background:#fff;position:sticky;top:71px;z-index:11}
        .filters button{background:#fff;border:1px solid #cfcfcf;border-radius:999px;padding:10px 18px;font-size:14px;font-weight:800;white-space:nowrap;color:#050505}
        .filters button:first-child{border-color:#050505}
        .shop-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#e8e8e8}
        .shop-card{display:block;background:#fff;padding-bottom:24px;min-width:0}
        .visual{position:relative;aspect-ratio:1/1.16;background:#f3f3f3;overflow:hidden}
        .visual::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 68%,rgba(0,0,0,.04));pointer-events:none}
        .visual-jersey{position:absolute;left:50%;top:50%;width:68%;transform:translate(-50%,-52%);filter:drop-shadow(0 20px 24px rgba(0,0,0,.18))}
        .swatches{display:flex;gap:7px;padding:14px 18px 0}
        .swatches span{width:18px;height:18px;border-radius:50%;border:1px solid #cfcfcf;background:#0b5d7c}
        .swatches span:nth-child(2){background:#e1161d}
        .label{padding:10px 18px 0;color:#b00f17;font-size:14px;font-weight:900;line-height:1.2}
        .shop-card h2{padding:6px 18px 0;font-size:16px;line-height:1.25;font-weight:800;letter-spacing:-.01em}
        .desc{padding:4px 18px 0;color:#707072;font-size:15px;line-height:1.35}
        .price{padding:10px 18px 0;font-size:16px;font-weight:900}
        @media(max-width:1020px){.shop-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:760px){.shop{padding-top:80px}.shop-head{padding:26px 18px 18px}.filters{top:67px;padding:14px 18px}.shop-grid{grid-template-columns:repeat(2,1fr)}.shop-card h2,.desc,.price,.label{padding-left:12px;padding-right:12px}.swatches{padding-left:12px}.visual-jersey{width:78%}}
      `}</style>
    </div>
  );
}
