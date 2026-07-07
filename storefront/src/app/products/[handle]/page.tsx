import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductByHandle, type Product } from "@/lib/shopify";
import { ProductBuy } from "@/components/product-buy";

const DEMO: Record<string, Product> = {
  "gryd-home-beton": demo("gryd-home-beton", "GRYD Home / Béton", "55.00"),
  "gryd-away-craie": demo("gryd-away-craie", "GRYD Away / Craie", "55.00"),
  "gryd-third-signal": demo("gryd-third-signal", "GRYD Third / Signal", "60.00"),
};

function demo(handle: string, title: string, price: string): Product {
  return {
    id: handle, handle, title,
    description: "Maillot GRYD imprimé à la demande. Série numérotée.",
    descriptionHtml: "<p>Maillot GRYD imprimé à la demande à Paris. Série limitée numérotée. Coupe unisexe.</p>",
    featuredImage: null, images: [],
    priceRange: { minVariantPrice: { amount: price, currencyCode: "EUR" } },
    options: [{ name: "Taille", values: ["S", "M", "L", "XL"] }],
    variants: ["S", "M", "L", "XL"].map((s) => ({
      id: `${handle}-${s}`, title: s, availableForSale: true,
      price: { amount: price, currencyCode: "EUR" },
      selectedOptions: [{ name: "Taille", value: s }],
    })),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  let product: Product | null = null;
  try {
    product = await getProductByHandle(handle);
  } catch {
    product = null;
  }
  if (!product) product = DEMO[handle] ?? null;
  if (!product) notFound();

  return (
    <div className="pdp">
      <Link href="/#drop" className="pdp-back">← Retour à la grille</Link>

      <div className="pdp-grid">
        <div className="pdp-visual">
          {product.featuredImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.featuredImage.url} alt={product.featuredImage.altText ?? product.title} />
          ) : (
            <div className="jersey-lg" aria-hidden />
          )}
        </div>

        <div className="pdp-info">
          <h1 className="display">{product.title}</h1>
          <div
            className="pdp-desc"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
          <ProductBuy product={product} />
          <p className="pdp-ship">Impression à la demande · expédié sous 5–8 jours · retours 14 j</p>
        </div>
      </div>

      <style>{`
        .pdp{position:relative;z-index:2;padding:120px 40px 80px;max-width:1200px;margin:0 auto}
        .pdp-back{display:inline-block;font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.6;margin-bottom:40px}
        .pdp-back:hover{opacity:1;color:var(--signal)}
        .pdp-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:60px;align-items:start}
        .pdp-visual{position:relative;aspect-ratio:4/5;background:radial-gradient(circle at 50% 40%,var(--concrete-700),var(--concrete-900));border:1px solid var(--line);overflow:hidden}
        .pdp-visual img{width:100%;height:100%;object-fit:cover}
        .jersey-lg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:60%;aspect-ratio:1/1.15}
        .jersey-lg::before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,var(--concrete-700),var(--concrete-800));clip-path:polygon(0 18%,22% 18%,32% 6%,68% 6%,78% 18%,100% 18%,100% 32%,82% 40%,82% 100%,18% 100%,18% 40%,0 32%);border:1px solid rgba(228,255,58,.3)}
        .jersey-lg::after{content:"07";position:absolute;top:42%;left:50%;transform:translateX(-50%);font-size:72px;font-weight:800;color:var(--signal)}
        .pdp-info h1{font-size:clamp(32px,5vw,56px);margin-bottom:24px;line-height:.95}
        .pdp-desc{font-size:15px;line-height:1.8;opacity:.65;margin-bottom:36px}
        .pdp-ship{font-size:12px;letter-spacing:.08em;opacity:.4;margin-top:22px}
        @media(max-width:820px){.pdp{padding:100px 22px 60px}.pdp-grid{grid-template-columns:1fr;gap:34px}}
      `}</style>
    </div>
  );
}
