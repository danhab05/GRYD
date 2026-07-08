import Link from "next/link";
import Image from "next/image";
import { getAllProducts, type Product } from "@/lib/shopify";
import { JerseyHero } from "@/components/jersey-hero";
import { Jersey } from "@/components/jersey";

/** Données de démo si le token Shopify n'est pas encore branché — le site tourne quand même. */
const DEMO: Product[] = [
  demo("gryd-home-beton", "redline26 Home / Béton", "55.00", "Secteur A1"),
  demo("gryd-away-craie", "redline26 Away / Craie", "55.00", "Secteur B2"),
  demo("gryd-third-signal", "redline26 Third / Signal", "60.00", "Secteur C3"),
];

function demo(handle: string, title: string, price: string, tag: string): Product {
  return {
    id: handle,
    handle,
    title,
    description: tag,
    descriptionHtml: `<p>${tag}</p>`,
    featuredImage: null,
    images: [],
    priceRange: { minVariantPrice: { amount: price, currencyCode: "EUR" } },
    options: [{ name: "Taille", values: ["S", "M", "L", "XL"] }],
    variants: [],
  };
}

const SECTORS = ["Secteur A1", "Secteur B2", "Secteur C3", "Secteur D4", "Secteur E5", "Secteur F6"];
const NUMBERS = ["07", "10", "09", "11", "04", "08"];

type Colorway = "beton" | "craie" | "signal";
function colorwayFor(handle: string, i: number): Colorway {
  const h = handle.toLowerCase();
  if (h.includes("home") || h.includes("beton") || h.includes("béton")) return "beton";
  if (h.includes("away") || h.includes("craie")) return "craie";
  if (h.includes("third") || h.includes("signal")) return "signal";
  return (["beton", "craie", "signal"] as Colorway[])[i % 3];
}

const money = (a: string, c = "EUR") =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(Number(a));

const brandTitle = (title: string) => title.replace(/^GRYD\s*/i, "redline26 ");
const SAFE_ASSETS = [
  { src: "/redline26/IMG-20260707-WA0079.jpg", alt: "Illustration football rose et crème" },
  { src: "/redline26/IMG-20260707-WA0080.jpg", alt: "Texture crampon noir et rose" },
];

export default async function HomePage() {
  let products: Product[];
  try {
    const live = await getAllProducts(12);
    products = live.length ? live : DEMO;
  } catch {
    products = DEMO; // token pas encore configuré
  }

  return (
    <>
      <JerseyHero />

      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>Nouveau drop / Rouge archive / Crème papier / Bleu nuit / Fabriqué sur commande / </span>
          ))}
        </div>
      </div>

      <section className="mood" aria-label="Direction artistique redline26">
        <div className="mood-copy">
          <span className="mood-kicker">Direction visuelle</span>
          <h2 className="display">Archive football, affiche brute, bitume parisien.</h2>
          <p>
            La nouvelle DA tire vers le poster vintage : crème usé, rouge profond, bleu nuit,
            touches or et texture imprimée. Les visuels protégés restent hors site ; on garde
            l'énergie, pas les copies.
          </p>
        </div>
        <div className="mood-grid">
          {SAFE_ASSETS.map((asset, i) => (
            <figure className={`mood-card mood-card-${i + 1}`} key={asset.src}>
              <Image src={asset.src} alt={asset.alt} fill sizes="(max-width:820px) 90vw, 34vw" />
              <figcaption>{i === 0 ? "Geste" : "Texture"}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="drop" id="drop">
        <div className="drop-head">
          <h2 className="display">Le Drop 01</h2>
          <p>Grille complète<br />{products.length} pièces · Paris</p>
          <Link href="/shop" className="drop-shop">Shop complet →</Link>
        </div>

        <div className="products">
          {products.map((p, i) => (
            <Link href={`/products/${p.handle}`} key={p.id} className="card">
              <div className="card-visual">
                {p.featuredImage ? (
                  <Image
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText ? brandTitle(p.featuredImage.altText) : brandTitle(p.title)}
                    fill
                    sizes="(max-width:820px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="card-jersey">
                    <Jersey face="front" colorway={colorwayFor(p.handle, i)} number={NUMBERS[i % NUMBERS.length]} />
                  </div>
                )}
              </div>
              <span className="card-tag">{SECTORS[i % SECTORS.length]}</span>
              <div className="card-label">
                <span className="name">{brandTitle(p.title).replace(/^redline26\s*/i, "")}</span>
                <span className="price">{money(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="manifeste-teaser">
        <h3 className="display">Chaque maillot est une case de la grille.</h3>
        <p>
          redline26 ne copie aucune équipe. On dessine nos propres couleurs, nos propres secteurs,
          notre propre ville. Imprimé à la demande à Paris — rien n'est produit tant que vous ne l'avez pas voulu.
        </p>
        <Link href="/notre-histoire" className="teaser-cta">Lire notre histoire →</Link>
      </section>

      <footer className="foot">
        <span className="logo display">redline26</span>
        <span>© {new Date().getFullYear()} · Paris · redline26.co</span>
      </footer>

      <HomeStyles />
    </>
  );
}

function HomeStyles() {
  return (
    <style>{`
      .marquee{position:relative;z-index:2;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px 0;overflow:hidden;white-space:nowrap;background:linear-gradient(90deg,var(--concrete-800),#241015,var(--concrete-800))}
      .marquee-track{display:inline-block;animation:scroll 26s linear infinite;font-size:14px;letter-spacing:.3em;text-transform:uppercase;opacity:.55}
      @keyframes scroll{to{transform:translateX(-50%)}}

      .mood{position:relative;z-index:2;display:grid;grid-template-columns:.9fr 1.1fr;gap:1px;background:var(--line);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
      .mood-copy{background:linear-gradient(135deg,rgba(16,24,39,.96),rgba(7,10,18,.96));padding:74px 40px;display:flex;flex-direction:column;justify-content:center;min-height:520px}
      .mood-kicker{font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:var(--gold);margin-bottom:24px}
      .mood-copy h2{font-size:clamp(34px,5vw,74px);line-height:.9;margin-bottom:28px;color:var(--chalk)}
      .mood-copy p{font-size:15px;line-height:1.9;opacity:.68;max-width:560px}
      .mood-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line)}
      .mood-card{position:relative;min-height:520px;overflow:hidden;background:var(--concrete-900)}
      .mood-card img{object-fit:cover;filter:saturate(.92) contrast(1.08)}
      .mood-card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(7,10,18,.78));mix-blend-mode:multiply}
      .mood-card-1 img{object-position:center 44%}
      .mood-card-2 img{object-position:center center}
      .mood-card figcaption{position:absolute;left:22px;bottom:22px;z-index:2;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--chalk);border:1px solid rgba(244,233,211,.22);background:rgba(7,10,18,.42);padding:8px 12px}

      .drop{position:relative;z-index:2;padding:120px 40px}
      .drop-head{display:grid;grid-template-columns:1fr auto auto;gap:24px;justify-content:space-between;align-items:flex-end;margin-bottom:60px}
      .drop-head h2{font-size:clamp(32px,6vw,72px)}
      .drop-head p{font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.5;text-align:right;line-height:1.8}
      .drop-shop{border:1px solid var(--line);border-radius:999px;padding:12px 18px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:900;color:var(--chalk);white-space:nowrap}
      .drop-shop:hover{background:var(--chalk);color:var(--concrete-900)}
      .products{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line)}
      .card{position:relative;background:var(--concrete-900);aspect-ratio:3/4;overflow:hidden;display:flex;align-items:flex-end;padding:26px}
      .card-visual{position:absolute;inset:0;background:radial-gradient(circle at 50% 38%,rgba(185,150,75,.2),transparent 26%),radial-gradient(circle at 50% 38%,var(--concrete-700),var(--concrete-900));transition:transform .8s cubic-bezier(.16,1,.3,1)}
      .card:hover .card-visual{transform:scale(1.04)}
      .card-jersey{position:absolute;top:50%;left:50%;transform:translate(-50%,-54%);width:60%;filter:drop-shadow(0 24px 34px rgba(0,0,0,.55));transition:transform .8s cubic-bezier(.16,1,.3,1)}
      .card:hover .card-jersey{transform:translate(-50%,-58%) rotate(-2deg)}
      .card-tag{position:absolute;top:22px;left:22px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;border:1px solid var(--line);padding:5px 10px;opacity:.7;z-index:2}
      .card-label{position:relative;z-index:2;width:100%;display:flex;justify-content:space-between;align-items:flex-end}
      .card-label .name{font-size:15px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
      .card-label .price{font-size:13px;color:var(--signal)}

      .manifeste-teaser{position:relative;z-index:2;text-align:center;padding:120px 40px;border-top:1px solid var(--line);max-width:820px;margin:0 auto}
      .manifeste-teaser h3{font-size:clamp(28px,5vw,56px);margin-bottom:24px}
      .manifeste-teaser p{font-size:15px;line-height:1.9;opacity:.6;margin-bottom:34px}
      .teaser-cta{display:inline-flex;align-items:center;gap:12px;background:var(--chalk);color:var(--concrete-900);padding:16px 30px;border-radius:2px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;transition:transform .4s cubic-bezier(.16,1,.3,1),background .3s}
      .teaser-cta:hover{transform:translateX(6px);background:var(--signal)}

      .foot{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:40px;border-top:1px solid var(--line);font-size:12px;letter-spacing:.1em;opacity:.6}
      .foot .logo{font-size:18px;letter-spacing:.24em;opacity:1}

      @media(max-width:820px){.mood{grid-template-columns:1fr}.mood-copy{min-height:auto;padding:62px 22px}.mood-grid{grid-template-columns:1fr}.mood-card{min-height:430px}.drop-head{grid-template-columns:1fr;align-items:start}.drop-head p{text-align:left}.products{grid-template-columns:1fr 1fr}.drop,.manifeste-teaser{padding-left:22px;padding-right:22px}}
      @media(max-width:520px){.products{grid-template-columns:1fr}}
    `}</style>
  );
}
