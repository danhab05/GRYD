import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GRYD — Manifeste",
  description:
    "Chaque maillot est une case de la grille. GRYD ne copie aucune équipe : nos propres couleurs, nos propres secteurs, notre propre ville. Imprimé à la demande à Paris.",
};

const SECTEURS = [
  {
    n: "01",
    titre: "La ville est une grille",
    corps:
      "Paris se lit comme un plan : des lignes, des secteurs, des cases. On a pris ce maillage comme trame de départ. Chaque maillot occupe une case — un secteur, une couleur, un numéro. Assemble-les et tu recomposes la grille.",
  },
  {
    n: "02",
    titre: "Aucune copie, jamais",
    corps:
      "GRYD ne reproduit aucun club, aucune sélection, aucun blason existant. Zéro affiliation. On dessine nos propres couleurs, nos propres armoiries, notre propre terrain. C'est une contrainte, et c'est surtout le sujet : inventer une équipe qui n'existe que sur le bitume.",
  },
  {
    n: "03",
    titre: "Rien n'est produit sans toi",
    corps:
      "Impression à la demande. Aucune pièce n'existe tant que tu ne l'as pas commandée — pas de stock mort, pas de surproduction. Tu commandes une case, on l'imprime, on te l'envoie. Séries limitées, numérotées.",
  },
  {
    n: "04",
    titre: "Édité à Paris",
    corps:
      "Streetwear parisien, coupe technique unisexe. Le maillot sort du terrain pour entrer dans la rue — porté comme une pièce, pas comme un déguisement. Porte la ville.",
  },
];

export default function ManifestePage() {
  return (
    <div className="mf">
      <header className="mf-hero">
        <div className="mf-eyebrow">Manifeste · Édition Paris</div>
        <h1 className="display mf-title">
          Chaque maillot<br />est une case<br /><span className="signal">de la grille.</span>
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
        <p className="display">Compose ta grille.</p>
        <Link href="/#drop" className="mf-cta">Voir le Drop 01 →</Link>
      </section>

      <style>{`
        .mf{position:relative;z-index:2;max-width:1080px;margin:0 auto;padding:140px 40px 100px}

        .mf-hero{border-bottom:1px solid var(--line);padding-bottom:70px;margin-bottom:20px}
        .mf-eyebrow{font-size:12px;letter-spacing:.4em;text-transform:uppercase;color:var(--signal);margin-bottom:34px}
        .mf-title{font-size:clamp(44px,9vw,120px);line-height:.9;letter-spacing:-.02em}
        .mf-title .signal{color:var(--signal)}

        .mf-secteurs{display:flex;flex-direction:column}
        .mf-secteur{display:grid;grid-template-columns:140px 1fr;gap:40px;padding:56px 0;border-bottom:1px solid var(--line);align-items:start}
        .mf-n{font-size:clamp(40px,6vw,80px);color:var(--line);line-height:1;letter-spacing:0}
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
