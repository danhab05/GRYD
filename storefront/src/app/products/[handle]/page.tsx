import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProductByHandle, type Product } from "@/lib/shopify";
import { ProductBuy } from "@/components/product-buy";
import { PRODUCT_PHOTO } from "@/lib/assets";

const brandTitle = (title: string) => title.replace(/^GRYD\s*/i, "redline26 ");
const brandHtml = (html: string) => html.replace(/GRYD/g, "redline26").replace(/Gryd/g, "redline26");
const SAFE_ASSETS = [
  { src: "/redline26/IMG-20260707-WA0079.jpg", alt: "Illustration football rose et crème" },
  { src: "/redline26/IMG-20260707-WA0080.jpg", alt: "Texture crampon noir et rose" },
];

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
};

function displayCopy(product: Product) {
  return COPY_BY_HANDLE[product.handle] ?? {
    title: brandTitle(product.title),
    html: brandHtml(product.descriptionHtml),
  };
}

const DEMO: Record<string, Product> = {
  "gryd-home-beton": demo("gryd-home-beton", "redline26 Home / Béton", "55.00"),
  "gryd-away-craie": demo("gryd-away-craie", "redline26 Away / Craie", "55.00"),
  "gryd-third-signal": demo("gryd-third-signal", "redline26 Third / Signal", "60.00"),
};

function demo(handle: string, title: string, price: string): Product {
  return {
    id: handle, handle, title,
    description: "Maillot redline26 imprimé à la demande. Série numérotée.",
    descriptionHtml: "<p>Maillot redline26 imprimé à la demande à Paris. Série limitée numérotée. Coupe unisexe.</p>",
    featuredImage: { url: PRODUCT_PHOTO, altText: `Maillot ${title}`, width: 1024, height: 1024 },
    images: [{ url: PRODUCT_PHOTO, altText: `Maillot ${title}`, width: 1024, height: 1024 }],
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

  const copy = displayCopy(product);

  return (
    <div className="pdp">
      <Link href="/#drop" className="pdp-back">← Retour à la grille</Link>

      <div className="pdp-grid">
        <div className="pdp-visual">
          <span className="pdp-sector">Drop 01 · Pièce originale</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.featuredImage?.url ?? PRODUCT_PHOTO}
            alt={product.featuredImage?.altText ? brandTitle(product.featuredImage.altText) : copy.title}
          />
          <div className="pdp-visual-mark display" aria-hidden>redline26</div>
        </div>

        <div className="pdp-info">
          <div className="pdp-kicker">Secteur produit · Paris</div>
          <h1 className="display">{copy.title}</h1>
          <div
            className="pdp-desc"
            dangerouslySetInnerHTML={{ __html: copy.html }}
          />
          <ProductBuy product={product} />
          <div className="pdp-notes" aria-label="Informations produit">
            <span>Impression à la demande</span>
            <span>Expédié sous 5-8 jours</span>
            <span>Retours 14 j</span>
          </div>
        </div>
      </div>

      <section className="pdp-board" aria-label="Moodboard redline26">
        <div>
          <span>Inspiration visuelle</span>
          <h2 className="display">Même tension graphique, zéro copie.</h2>
        </div>
        <div className="pdp-board-images">
          {SAFE_ASSETS.map((asset) => (
            <figure key={asset.src}>
              <Image src={asset.src} alt={asset.alt} fill sizes="(max-width:820px) 90vw, 28vw" />
            </figure>
          ))}
        </div>
      </section>

      <style>{`
        .pdp{position:relative;z-index:2;padding:120px 40px 90px;max-width:1220px;margin:0 auto}
        .pdp::before{content:"";position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 20% 18%,rgba(225,22,29,.1),transparent 26%),linear-gradient(115deg,transparent 0 58%,rgba(244,233,211,.035) 58% 59%,transparent 59%);pointer-events:none}
        .pdp-back{display:inline-block;font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.6;margin-bottom:40px}
        .pdp-back:hover{opacity:1;color:var(--signal)}
        .pdp-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:60px;align-items:start}
        .pdp-visual{position:relative;aspect-ratio:4/5;background:radial-gradient(circle at 50% 38%,rgba(225,22,29,.16),transparent 22%),radial-gradient(circle at 50% 45%,var(--concrete-700),var(--concrete-900) 66%);border:1px solid var(--line);overflow:hidden;box-shadow:0 38px 100px rgba(0,0,0,.34)}
        .pdp-visual::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(242,240,235,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(242,240,235,.07) 1px,transparent 1px);background-size:72px 72px;mask-image:radial-gradient(circle at 50% 42%,#000 20%,transparent 72%)}
        .pdp-sector{position:absolute;top:22px;left:22px;z-index:2;border:1px solid var(--line);background:rgba(10,11,13,.48);padding:8px 12px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--signal)}
        .pdp-visual img{width:100%;height:100%;object-fit:cover}
        .jersey-lg{position:absolute;top:50%;left:50%;transform:translate(-50%,-52%) rotate(-1deg);width:min(58%,360px);filter:drop-shadow(0 34px 42px rgba(0,0,0,.58));z-index:1}
        .pdp-visual-mark{position:absolute;right:-.08em;bottom:-.12em;font-size:clamp(78px,13vw,180px);line-height:.8;color:rgba(242,240,235,.045);letter-spacing:-.05em;pointer-events:none}
        .pdp-kicker{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--signal);margin-bottom:22px}
        .pdp-info h1{font-size:clamp(32px,5vw,56px);margin-bottom:24px;line-height:.95}
        .pdp-desc{font-size:15px;line-height:1.8;opacity:.65;margin-bottom:36px}
        .pdp-notes{display:grid;grid-template-columns:1fr;gap:1px;margin-top:24px;background:var(--line);border:1px solid var(--line)}
        .pdp-notes span{background:rgba(22,24,28,.8);padding:14px 16px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.72}
        .pdp-board{display:grid;grid-template-columns:.75fr 1.25fr;gap:1px;background:var(--line);border:1px solid var(--line);margin-top:74px}
        .pdp-board>div:first-child{background:rgba(16,24,39,.86);padding:34px;display:flex;flex-direction:column;justify-content:center}
        .pdp-board span{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);margin-bottom:18px}
        .pdp-board h2{font-size:clamp(24px,3.4vw,44px);line-height:.94}
        .pdp-board-images{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line)}
        .pdp-board figure{position:relative;min-height:320px;overflow:hidden;background:var(--concrete-900)}
        .pdp-board img{object-fit:cover;filter:saturate(.9) contrast(1.08)}
        @media(max-width:820px){.pdp{padding:100px 22px 60px}.pdp-grid,.pdp-board{grid-template-columns:1fr;gap:34px}.pdp-board-images{grid-template-columns:1fr}.pdp-board figure{min-height:380px}}
      `}</style>
    </div>
  );
}
