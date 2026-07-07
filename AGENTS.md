# AGENTS.md — GRYD

Guide agent pour ce repo (convention `AGENTS.md`, lue par la plupart des outils
agentiques). Pour Claude Code, **`CLAUDE.md`** contient le même guide en détail.
L'état complet du projet est dans **`RECAP.md`**.

## En bref
GRYD = boutique e-commerce de **maillots de foot originaux** (streetwear parisien,
print-on-demand). Front **Next.js headless** dans `storefront/`, back **Shopify**
(checkout hébergé), **Printful** pour l'impression et la logistique.

## Règles non négociables
1. **IP** — designs 100 % originaux. Aucune copie / imitation de club, sélection,
   blason, sponsor ou nom d'équipe existants. Jamais.
2. **DA GRYD** — béton `#0A0B0D` / `#16181C`, craie `#F2F0EB`, signal `#E4FF3A`,
   display condensé, grille signature. Réf : `storefront/src/app/globals.css`.
3. **App dans `storefront/`** — toutes les commandes npm s'y lancent ; sur Vercel,
   **Root Directory = `storefront`**.
4. **Build avant commit** — `cd storefront && npm run build` doit passer.
5. **Branche** — dev sur `claude/gryd-ecommerce-setup-36pzd4`. Pas de push sur `main`
   sans accord.
6. **Secrets** — ne jamais committer `.env.local` ni le token Storefront **privé**
   (`shpat_…`). Le token **public** peut être exposé (il part dans le bundle client).

## Commandes
```bash
cd storefront
npm install
npm run dev      # dev (mode démo sans token)
npm run build    # build prod
npm run start    # sert le build
```

## Où regarder
- Guide détaillé : `CLAUDE.md`
- État complet + ce qui reste + tous les IDs : `RECAP.md`
- Client Shopify (produits + panier) : `storefront/src/lib/shopify.ts`
- Hero animée (maillot 3D) : `storefront/src/components/jersey-hero.tsx`
