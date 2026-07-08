import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductByHandle, type Product } from "@/lib/shopify";
import { ProductBuy } from "@/components/product-buy";
import { PRODUCT_PHOTO } from "@/lib/assets";

const brandTitle = (title: string) => title.replace(/^GRYD\s*/i, "redline26 ");
const brandHtml = (html: string) => html.replace(/GRYD/g, "redline26").replace(/Gryd/g, "redline26");

const COPY_BY_HANDLE: Record<string, { title: string; html: string }> = {
  "gryd-home-beton": {
    title: "redline26 Home / Bleu nuit",
    html:
      "<p><strong>Drop 01 · Secteur A1.</strong> Le maillot fondation de redline26. Bleu nuit, crème papier et touche or : une pièce inspirée des affiches football vintage, pensée pour rester 100% originale.</p><p>Imprimé à la demande. Aucune affiliation à une fédération, un club ou une marque existante.</p>",
  },
  "gryd-away-craie": {
    title: "redline26 Away / Crème papier",
    html:
      "<p><strong>Drop 01 · Secteur B2.</strong> Une base crème, des détails rouge archive et une lecture plus lifestyle. Le maillot garde l'énergie du football sans reprendre de blason, sponsor ou équipe réelle.</p><p>Série numérotée, coupe unisexe, imprimée à la demande.</p>",
  },
  "gryd-third-signal": {
    title: "redline26 Third / Rouge archive",
    html:
      "<p><strong>Drop 01 · Secteur C3.</strong> La pièce la plus frontale du drop : rouge archive, crème papier, lignes nettes et énergie poster. Une silhouette football/streetwear originale, sans référence protégée.</p><p>Impression à la demande, série limitée numérotée, coupe unisexe.</p>",
  },
  "redline26-keeper-or-nuit": {
    title: "redline26 Keeper / Or nuit",
    html:
      "<p><strong>Drop 01 · Secteur D4.</strong> L'édition gardien : or nuit, coupe technique, énergie poster. Une pièce football/streetwear 100% originale — aucun blason, sponsor ou sélection réelle.</p><p>Impression à la demande, série limitée numérotée, coupe unisexe.</p>",
  },
};

function displayCopy(product: Product) {
  return (
    COPY_BY_HANDLE[product.handle] ?? {
      title: brandTitle(product.title),
      html: brandHtml(product.descriptionHtml),
    }
  );
}

const DEMO: Record<string, Product> = {
  "gryd-home-beton": demo("gryd-home-beton", "redline26 Home / Bleu nuit", "55.00"),
  "gryd-away-craie": demo("gryd-away-craie", "redline26 Away / Crème papier", "55.00"),
  "gryd-third-signal": demo("gryd-third-signal", "redline26 Third / Rouge archive", "60.00"),
  "redline26-keeper-or-nuit": demo("redline26-keeper-or-nuit", "redline26 Keeper / Or nuit", "60.00"),
};

function demo(handle: string, title: string, price: string): Product {
  return {
    id: handle,
    handle,
    title,
    description: "Maillot redline26 imprimé à la demande. Série numérotée.",
    descriptionHtml: "<p>Maillot redline26 imprimé à la demande à Paris. Série limitée numérotée. Coupe unisexe.</p>",
    featuredImage: { url: PRODUCT_PHOTO, altText: `Maillot ${title}`, width: 1024, height: 1024 },
    images: [{ url: PRODUCT_PHOTO, altText: `Maillot ${title}`, width: 1024, height: 1024 }],
    priceRange: { minVariantPrice: { amount: price, currencyCode: "EUR" } },
    options: [{ name: "Taille", values: ["S", "M", "L", "XL"] }],
    variants: ["S", "M", "L", "XL"].map((s) => ({
      id: `${handle}-${s}`,
      title: s,
      availableForSale: true,
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

  const copy = displayCopy(product);
  const image = product.featuredImage?.url ?? PRODUCT_PHOTO;

  return (
    <div className="pdp">
      <Link href="/shop" className="pdp-back">← Retour au shop</Link>

      <div className="pdp-grid">
        <div className="pdp-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={product.featuredImage?.altText ? brandTitle(product.featuredImage.altText) : copy.title} />
        </div>

        <div className="pdp-info">
          <span className="pdp-kicker">Drop 01 · Pièce originale</span>
          <h1 className="display">{copy.title}</h1>
          <div className="pdp-desc" dangerouslySetInnerHTML={{ __html: copy.html }} />
          <ProductBuy product={product} />
          <div className="pdp-notes">
            <span>Impression à la demande</span>
            <span>Expédié sous 5–8 jours</span>
            <span>Retours 14 j</span>
          </div>
        </div>
      </div>

      <style>{`
        .pdp{position:relative;z-index:2;max-width:1220px;margin:0 auto;padding:118px 32px 90px}
        .pdp-back{display:inline-block;font-size:13px;font-weight:700;color:var(--muted);margin-bottom:36px}
        .pdp-back:hover{color:var(--signal)}
        .pdp-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:start}
        .pdp-visual{position:relative;aspect-ratio:1/1.1;background:var(--wash);border:1px solid var(--line-soft);border-radius:16px;overflow:hidden}
        .pdp-visual img{width:100%;height:100%;object-fit:cover}
        .pdp-kicker{display:block;font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:var(--signal);margin-bottom:20px}
        .pdp-info h1{font-size:clamp(30px,4.4vw,52px);line-height:.96;margin-bottom:22px}
        .pdp-desc{font-size:15px;line-height:1.8;color:var(--muted);margin-bottom:34px}
        .pdp-desc :global(strong){color:var(--ink)}
        .pdp-desc :global(p)+:global(p){margin-top:14px}
        .pdp-notes{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
        .pdp-notes span{border:1px solid var(--line);border-radius:999px;padding:9px 15px;font-size:12px;font-weight:700;color:var(--muted)}
        @media(max-width:820px){.pdp{padding:100px 18px 64px}.pdp-grid{grid-template-columns:1fr;gap:30px}}
      `}</style>
    </div>
  );
}
