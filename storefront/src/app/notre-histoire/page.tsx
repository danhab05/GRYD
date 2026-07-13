import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RedLine26 — Notre histoire",
  description: "L'histoire RedLine26 : née pour l'été 26. Le Mondial en streetwear — des t-shirts custom, pas des maillots.",
};

const PRESS = ["TikTok", "Instagram", "Paris", "Le bitume"];

export default function NotreHistoirePage() {
  return (
    <div className="story">
      <section className="story-hero">
        <p className="story-kicker">Notre histoire</p>
        <h1 className="display">Née pour l'été 26.</h1>
        <p>
          En 2026, le monde entier vivra au rythme du foot. RedLine26 est née pour cet été-là :
          des t-shirts custom qui célèbrent le jeu — dessinés comme des affiches, coupés comme du
          streetwear. Pas des maillots. Des pièces.
        </p>
      </section>

      <section className="story-grid">
        <article>
          <span>01</span>
          <h2 className="display">Le déclic</h2>
          <p>
            Pour vivre un Mondial, t'avais deux options : la réplique hors de prix ou le merch
            cheap. Entre les deux, rien. RedLine26 trace cette ligne — le t-shirt custom premium,
            pensé pour la rue, pas pour le vestiaire.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2 className="display">La ligne</h2>
          <p>
            Rouge archive, bleu nuit, crème papier. Chaque édition raconte une nation, un été,
            un frisson — façon affiche vintage, jamais façon réplique.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2 className="display">La méthode</h2>
          <p>
            On produit à la demande. Pas de stock mort, pas de faux volume. Tu commandes,
            on imprime, la pièce part.
          </p>
        </article>
      </section>

      <section className="seen">
        <p className="story-kicker">Vous nous avez vus sur</p>
        <div className="seen-list">
          {PRESS.map((item) => <span key={item}>{item}</span>)}
        </div>
        <p className="seen-note">Emplacements prêts pour vos logos médias, créateurs ou boutiques partenaires.</p>
      </section>

      <section className="story-outro">
        <h2 className="display">La suite se joue.</h2>
        <Link href="/shop">Voir les t-shirts →</Link>
      </section>

      <style>{`
        .story{position:relative;z-index:2;background:#fff;color:#080a10;min-height:100vh;padding:118px 40px 80px}
        .story::before{content:"";position:fixed;inset:0;z-index:-1;background-image:linear-gradient(rgba(8,10,16,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(8,10,16,.055) 1px,transparent 1px);background-size:72px 72px;pointer-events:none}
        .story-hero{max-width:1120px;margin:0 auto 84px;border-bottom:1px solid rgba(8,10,16,.14);padding-bottom:58px}
        .story-kicker{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#b00f17;font-weight:800;margin-bottom:24px}
        .story-hero h1{font-size:clamp(46px,9vw,118px);line-height:.86;max-width:980px;letter-spacing:-.05em;margin-bottom:30px}
        .story-hero>p{font-size:clamp(18px,2.4vw,28px);line-height:1.35;max-width:800px;color:rgba(8,10,16,.68)}
        .story-grid{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(8,10,16,.14);border:1px solid rgba(8,10,16,.14)}
        .story-grid article{background:#fff;padding:34px;min-height:360px;display:flex;flex-direction:column}
        .story-grid span{font-size:12px;letter-spacing:.2em;color:#b9964b;font-weight:900;margin-bottom:34px}
        .story-grid h2{font-size:clamp(26px,3vw,42px);line-height:.92;margin-bottom:24px}
        .story-grid p{font-size:15px;line-height:1.75;color:rgba(8,10,16,.64);margin-top:auto}
        .seen{max-width:1120px;margin:90px auto 0;text-align:center;border-top:1px solid rgba(8,10,16,.14);border-bottom:1px solid rgba(8,10,16,.14);padding:54px 0}
        .seen-list{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(8,10,16,.14);margin-top:26px}
        .seen-list span{background:#f5f5f3;padding:24px 12px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;font-weight:900}
        .seen-note{margin-top:20px;font-size:13px;color:rgba(8,10,16,.5)}
        .story-outro{max-width:1120px;margin:70px auto 0;display:flex;align-items:center;justify-content:space-between;gap:24px}
        .story-outro h2{font-size:clamp(34px,6vw,76px);line-height:.9}
        .story-outro a{background:#080a10;color:#f7f1e7;border-radius:999px;padding:16px 24px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;font-weight:900;white-space:nowrap}
        @media(max-width:820px){.story{padding:100px 22px 64px}.story-grid,.seen-list{grid-template-columns:1fr}.story-grid article{min-height:auto}.story-outro{align-items:flex-start;flex-direction:column}}
      `}</style>
    </div>
  );
}
