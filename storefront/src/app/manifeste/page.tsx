import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RedLine26 — Manifeste",
  description:
    "Le manifeste RedLine26 : l'été 26 en streetwear. Des t-shirts custom, pas des maillots. Imprimé à la demande à Paris.",
};

const SECTEURS = [
  {
    n: "01",
    titre: "La ligne rouge",
    corps:
      "Le nom, c'est le concept. La ligne rouge du calendrier : l'été 26, celui où le monde entier regarde le foot. On la trace, on la franchit.",
  },
  {
    n: "02",
    titre: "Pas des maillots",
    corps:
      "Des t-shirts custom qui célèbrent le jeu — dessinés comme des affiches, coupés comme du streetwear. La réplique de vestiaire, très peu pour nous.",
  },
  {
    n: "03",
    titre: "Rien sans toi",
    corps:
      "Impression à la demande. Aucune pièce n'existe tant que tu ne l'as pas commandée — pas de stock mort. Tu commandes, on imprime, on t'envoie. Séries numérotées.",
  },
  {
    n: "04",
    titre: "Édité à Paris",
    corps:
      "Pensé à Paris, imprimé à la demande, porté partout où l'été 26 se joue. Cross the line.",
  },
];

export default function ManifestePage() {
  return (
    <div className="mf">
      <header className="mf-hero">
        <div className="mf-eyebrow">Manifeste · Édition 2026</div>
        <h1 className="display mf-title">
          On dessine<br />nos propres<br /><span className="signal">lignes.</span>
        </h1>
      </header>

      <section className="mf-secteurs">
        {SECTEURS.map((s) => (
          <article className="mf-secteur" key={s.n}>
            <span className="mf-n display">{s.n}</span>
            <div className="mf-secteur-body">
              <h2 className="display">{s.titre}</h2>
              <p>{s.corps}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mf-outro">
        <p className="display">Franchis la ligne.</p>
        <Link href="/#drop" className="mf-cta">Voir le Drop 01 →</Link>
      </section>

      <style>{`
        .mf{position:relative;z-index:2;max-width:1080px;margin:0 auto;padding:140px 40px 100px}
        .mf::before{content:"";position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 78% 10%,rgba(225,22,29,.05),transparent 30%);pointer-events:none}

        .mf-hero{position:relative;border-bottom:1px solid var(--line);padding-bottom:70px;margin-bottom:20px}
        .mf-hero::after{content:"RedLine26";position:absolute;right:0;bottom:-.11em;font-size:clamp(60px,12vw,150px);line-height:.8;font-weight:800;letter-spacing:-.05em;color:rgba(242,240,235,.045);pointer-events:none}
        .mf-eyebrow{font-size:12px;letter-spacing:.4em;text-transform:uppercase;color:var(--signal);margin-bottom:34px}
        .mf-title{font-size:clamp(44px,9vw,120px);line-height:.9;letter-spacing:-.02em}
        .mf-title .signal{color:var(--signal)}

        .mf-secteurs{display:flex;flex-direction:column}
        .mf-secteur{position:relative;display:grid;grid-template-columns:140px 1fr;gap:40px;padding:56px 0;border-bottom:1px solid var(--line);align-items:start}
        .mf-secteur::before{content:"";position:absolute;left:0;top:0;bottom:0;width:0;background:var(--signal);transition:width .3s}
        .mf-secteur:hover::before{width:3px}
        .mf-n{font-size:clamp(40px,6vw,80px);color:rgba(225,22,29,.35);line-height:1;letter-spacing:0}
        .mf-secteur-body h2{font-size:clamp(24px,3.4vw,40px);margin-bottom:20px;line-height:1}
        .mf-secteur-body p{font-size:16px;line-height:1.85;opacity:.62;max-width:620px}

        .mf-outro{text-align:center;padding:100px 0 20px}
        .mf-outro .display{font-size:clamp(30px,6vw,68px);margin-bottom:36px}
        .mf-cta{display:inline-flex;align-items:center;gap:12px;background:var(--chalk);color:var(--concrete-900);padding:18px 34px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;transition:transform .4s cubic-bezier(.16,1,.3,1),background .3s}
        .mf-cta:hover{transform:translateX(6px);background:var(--signal)}

        @media(max-width:820px){
          .mf{padding:110px 22px 70px}
          .mf-secteur{grid-template-columns:1fr;gap:14px;padding:40px 0}
          .mf-n{font-size:34px}
        }
      `}</style>
    </div>
  );
}
