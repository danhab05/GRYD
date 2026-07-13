import Link from "next/link";
import Image from "next/image";
import { getAllProducts, type Product } from "@/lib/shopify";
import { JerseyHero } from "@/components/jersey-hero";
import { Logo } from "@/components/logo";
import { PRODUCT_PHOTO } from "@/lib/assets";

/** Données de démo si le token Shopify n'est pas encore branché — le site tourne quand même. */
const DEMO: Product[] = [
  demo("gryd-home-beton", "RedLine26 Home / Bleu nuit", "55.00"),
  demo("gryd-away-craie", "RedLine26 Away / Crème papier", "55.00"),
  demo("gryd-third-signal", "RedLine26 Third / Rouge archive", "60.00"),
];

function demo(handle: string, title: string, price: string): Product {
  return {
    id: handle,
    handle,
    title,
    description: "Maillot RedLine26 original.",
    descriptionHtml: "<p>Maillot RedLine26 original.</p>",
    featuredImage: { url: PRODUCT_PHOTO, altText: `Maillot ${title}`, width: 1024, height: 1024 },
    images: [{ url: PRODUCT_PHOTO, altText: `Maillot ${title}`, width: 1024, height: 1024 }],
    priceRange: { minVariantPrice: { amount: price, currencyCode: "EUR" } },
    options: [{ name: "Taille", values: ["S", "M", "L", "XL"] }],
    variants: [],
  };
}

const LABELS = ["Nouveau", "Meilleure vente", "Édition limitée", "Numéroté"];
const brandTitle = (title: string) => title.replace(/^GRYD\s*/i, "RedLine26 ");
const money = (a: string, c = "EUR") =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(Number(a));

export default async function HomePage() {
  let products: Product[];
  try {
    const live = await getAllProducts(12);
    products = live.length ? live : DEMO;
  } catch {
    products = DEMO;
  }

  return (
    <>
      <JerseyHero />

      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i}>Cross the line&nbsp;·&nbsp;Édition 2026&nbsp;·&nbsp;Imprimé à la demande&nbsp;·&nbsp;Zéro copie&nbsp;·&nbsp;Made in Paris&nbsp;·&nbsp;</span>
          ))}
        </div>
      </div>

      <section className="drop" id="drop">
        <div className="drop-head">
          <div>
            <span className="drop-kicker">Drop 01 · 2026</span>
            <h2 className="display">Première ligne.</h2>
          </div>
          <Link href="/shop" className="drop-shop">Tout le shop →</Link>
        </div>

        <div className="grid">
          {products.slice(0, 3).map((p, i) => (
            <Link href={`/products/${p.handle}`} key={p.id} className="card">
              <div className="card-visual">
                <Image
                  src={p.featuredImage?.url ?? PRODUCT_PHOTO}
                  alt={p.featuredImage?.altText ? brandTitle(p.featuredImage.altText) : brandTitle(p.title)}
                  fill
                  sizes="(max-width:760px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="card-label">{LABELS[i % LABELS.length]}</span>
              <div className="card-row">
                <h3>{brandTitle(p.title)}</h3>
                <span className="card-price">{money(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</span>
              </div>
              <p className="card-sub">Imprimé à la demande · série numérotée</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="band">
        <p className="band-kicker">Manifeste</p>
        <h2 className="display">On dessine nos propres lignes.</h2>
        <p className="band-text">
          RedLine26 ne copie aucun club, aucune sélection, aucun blason. Nos couleurs, nos numéros,
          nos lignes. Le football réécrit à Paris — imprimé seulement quand tu le commandes.
        </p>
        <Link href="/notre-histoire" className="band-cta">Notre histoire →</Link>
      </section>

      <footer className="foot">
        <span className="logo"><Logo /></span>
        <div className="foot-links">
          <Link href="/shop">Shop</Link>
          <Link href="/notre-histoire">Notre histoire</Link>
          <Link href="/cart">Panier</Link>
        </div>
        <span className="foot-copy">© {new Date().getFullYear()} · Paris · redline26.co</span>
      </footer>

      <HomeStyles />
    </>
  );
}

function HomeStyles() {
  return (
    <style>{`
      .marquee{position:relative;z-index:2;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:16px 0;overflow:hidden;white-space:nowrap;background:var(--wash)}
      .marquee-track{display:inline-block;animation:scroll 30s linear infinite;font-size:13px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--ink)}
      @keyframes scroll{to{transform:translateX(-50%)}}

      .drop{position:relative;z-index:2;max-width:1320px;margin:0 auto;padding:96px 32px 40px}
      .drop-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:44px}
      .drop-kicker{display:block;font-size:12px;font-weight:800;letter-spacing:.24em;text-transform:uppercase;color:var(--signal);margin-bottom:14px}
      .drop-head h2{font-size:clamp(34px,6vw,72px)}
      .drop-shop{font-size:14px;font-weight:800;text-decoration:underline;text-underline-offset:5px;white-space:nowrap}
      .drop-shop:hover{color:var(--signal)}

      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:36px 28px}
      .card{display:block}
      .card-visual{position:relative;aspect-ratio:1/1.12;background:var(--wash);border-radius:14px;overflow:hidden;border:1px solid var(--line-soft)}
      .card-visual :global(img){transition:transform .6s cubic-bezier(.16,1,.3,1)}
      .card:hover .card-visual :global(img){transform:scale(1.05)}
      .card-label{display:block;margin-top:16px;font-size:13px;font-weight:900;color:var(--signal)}
      .card-row{display:flex;justify-content:space-between;align-items:baseline;gap:14px;margin-top:6px}
      .card-row h3{font-size:16px;font-weight:800;letter-spacing:-.01em}
      .card-price{font-size:16px;font-weight:900;white-space:nowrap}
      .card-sub{margin-top:4px;font-size:14px;color:var(--muted)}

      .band{position:relative;z-index:2;text-align:center;max-width:760px;margin:60px auto 0;padding:100px 24px}
      .band-kicker{font-size:12px;font-weight:800;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);margin-bottom:22px}
      .band h2{font-size:clamp(30px,5vw,60px);margin-bottom:26px}
      .band-text{font-size:16px;line-height:1.85;color:var(--muted);margin-bottom:32px}
      .band-cta{display:inline-block;background:var(--ink);color:#fff;border-radius:999px;padding:15px 28px;font-size:13px;font-weight:800;letter-spacing:.02em;transition:background .25s,transform .25s}
      .band-cta:hover{background:var(--signal);transform:translateY(-2px)}

      .foot{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;padding:36px 32px;border-top:1px solid var(--line)}
      .foot .logo{font-size:20px}
      .foot-links{display:flex;gap:26px;font-size:14px;font-weight:700}
      .foot-links a:hover{color:var(--signal)}
      .foot-copy{font-size:13px;color:var(--muted)}

      @media(max-width:760px){
        .drop{padding:72px 18px 30px}
        .grid{grid-template-columns:1fr 1fr;gap:24px 16px}
        .band{padding:72px 18px}
        .foot{flex-direction:column;align-items:flex-start;gap:16px}
      }
    `}</style>
  );
}
