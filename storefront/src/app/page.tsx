import Link from "next/link";
import Image from "next/image";
import { getAllProducts, type Product } from "@/lib/shopify";
import { JerseyHero } from "@/components/jersey-hero";
import { Jersey } from "@/components/jersey";

/** Données de démo si le token Shopify n'est pas encore branché — le site tourne quand même. */
const DEMO: Product[] = [
  demo("gryd-home-beton", "GRYD Home / Béton", "55.00", "Secteur A1"),
  demo("gryd-away-craie", "GRYD Away / Craie", "55.00", "Secteur B2"),
  demo("gryd-third-signal", "GRYD Third / Signal", "60.00", "Secteur C3"),
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
            <span key={i}>Nouveau drop / Fabriqué sur commande / Édition Paris / Séries numérotées / </span>
          ))}
        </div>
      </div>

      <section className="drop" id="drop">
        <div className="drop-head">
          <h2 className="display">Le Drop 01</h2>
          <p>Grille complète<br />{products.length} pièces · Paris</p>
        </div>

        <div className="products">
          {products.map((p, i) => (
            <Link href={`/products/${p.handle}`} key={p.id} className="card">
              <div className="card-visual">
                {p.featuredImage ? (
                  <Image
                    src={p.featuredImage.url}
                    alt={p.featuredImage.altText ?? p.title}
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
                <span className="name">{p.title.replace(/^GRYD\s*/i, "")}</span>
                <span className="price">{money(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="manifeste-teaser">
        <h3 className="display">Chaque maillot est une case de la grille.</h3>
        <p>
          GRYD ne copie aucune équipe. On dessine nos propres couleurs, nos propres secteurs,
          notre propre ville. Imprimé à la demande à Paris — rien n'est produit tant que tu ne l'as pas voulu.
        </p>
        <Link href="/manifeste" className="teaser-cta">Lire le manifeste →</Link>
      </section>

      <footer className="foot">
        <span className="logo display">GRYD</span>
        <span>© {new Date().getFullYear()} · Paris · gryd.co</span>
      </footer>

      <HomeStyles />
    </>
  );
}

function HomeStyles() {
  return (
    <style>{`
      .marquee{position:relative;z-index:2;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px 0;overflow:hidden;white-space:nowrap;background:var(--concrete-800)}
      .marquee-track{display:inline-block;animation:scroll 26s linear infinite;font-size:14px;letter-spacing:.3em;text-transform:uppercase;opacity:.55}
      @keyframes scroll{to{transform:translateX(-50%)}}

      .drop{position:relative;z-index:2;padding:120px 40px}
      .drop-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:60px}
      .drop-head h2{font-size:clamp(32px,6vw,72px)}
      .drop-head p{font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.5;text-align:right;line-height:1.8}
      .products{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line)}
      .card{position:relative;background:var(--concrete-900);aspect-ratio:3/4;overflow:hidden;display:flex;align-items:flex-end;padding:26px}
      .card-visual{position:absolute;inset:0;background:radial-gradient(circle at 50% 38%,var(--concrete-700),var(--concrete-900));transition:transform .8s cubic-bezier(.16,1,.3,1)}
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

      @media(max-width:820px){.products{grid-template-columns:1fr 1fr}.drop,.manifeste-teaser{padding-left:22px;padding-right:22px}}
      @media(max-width:520px){.products{grid-template-columns:1fr}}
    `}</style>
  );
}
