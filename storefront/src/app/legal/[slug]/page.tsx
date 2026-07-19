import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL_DOCS, getLegalDoc } from "@/lib/legal";

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};
  return {
    title: `${doc.title} — RedLine26`,
    description: `${doc.title} — RedLine26.`,
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <div className="legal">
      <Link href="/" className="legal-back">← Accueil</Link>
      <h1 className="display">{doc.title}</h1>

      <div className="legal-grid">
        <article className="legal-body" dangerouslySetInnerHTML={{ __html: doc.html }} />

        <aside className="legal-side">
          <span className="legal-side-title">Informations</span>
          <nav>
            {LEGAL_DOCS.map((d) => (
              <Link key={d.slug} href={`/legal/${d.slug}`} className={d.slug === slug ? "is-active" : ""}>
                {d.short}
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      <style>{`
        .legal{position:relative;z-index:2;max-width:1100px;margin:0 auto;padding:118px 32px 100px}
        .legal-back{display:inline-block;font-size:13px;font-weight:700;color:var(--muted);margin-bottom:26px}
        .legal-back:hover{color:var(--signal)}
        .legal h1{font-size:clamp(30px,5vw,58px);line-height:.98;margin-bottom:44px}
        .legal-grid{display:grid;grid-template-columns:1fr 240px;gap:56px;align-items:start}
        .legal-body{font-size:15px;line-height:1.8;color:var(--muted)}
        .legal-body :global(h2){color:var(--ink);font-size:18px;font-weight:800;margin:34px 0 12px;letter-spacing:-.01em}
        .legal-body :global(h2:first-child){margin-top:0}
        .legal-body :global(p){margin-bottom:14px}
        .legal-body :global(ul){margin:0 0 14px;padding-left:20px}
        .legal-body :global(li){margin-bottom:8px}
        .legal-body :global(strong){color:var(--ink)}
        .legal-body :global(.legal-maj){margin-top:32px;font-size:13px;color:var(--muted);opacity:.7;font-style:italic}
        .legal-side{position:sticky;top:100px}
        .legal-side-title{display:block;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);font-weight:800;margin-bottom:14px}
        .legal-side nav{display:flex;flex-direction:column;gap:2px;border-left:1px solid var(--line)}
        .legal-side nav a{padding:9px 16px;font-size:14px;font-weight:700;color:var(--muted);border-left:2px solid transparent;margin-left:-1px}
        .legal-side nav a:hover{color:var(--ink)}
        .legal-side nav a.is-active{color:var(--ink);border-left-color:var(--signal)}
        @media(max-width:820px){
          .legal{padding:100px 18px 64px}
          .legal-grid{grid-template-columns:1fr;gap:32px}
          .legal-side{position:static;order:-1}
          .legal-side nav{flex-direction:row;flex-wrap:wrap;border-left:none;gap:8px}
          .legal-side nav a{border:1px solid var(--line);border-radius:999px;padding:8px 14px;margin-left:0}
          .legal-side nav a.is-active{border-color:var(--signal)}
        }
      `}</style>
    </div>
  );
}
