# CLAUDE.md — GRYD

Guide pour Claude Code (et tout agent) travaillant sur ce repo.
État complet du projet et reste-à-faire : voir **`RECAP.md`**.

## C'est quoi GRYD
Boutique e-commerce de **maillots de foot originaux**, streetwear parisien, imprimés
à la demande via **Printful**. Concept : la grille urbaine — chaque maillot = "une
case de la grille".

> ⚠️ **IP — non négociable** : designs 100 % originaux. **Aucune copie / imitation**
> de club, sélection, blason, sponsor ou nom d'équipe existants. Printful et Shopify
> bannissent les comptes en infraction. Ne jamais générer ni suggérer de contenu qui
> ressemble à une équipe réelle.

## Architecture (headless)
- **Front** : Next.js 16 (App Router) + React 19, dans le dossier **`storefront/`**.
  Animations Framer Motion + Lenis (GSAP dispo). Déployé sur Vercel.
- **Back** : Shopify (plan Basic, EUR) — catalogue, panier, **checkout hébergé**,
  paiements (Apple Pay / Google Pay / Stripe), + Printful (impression + fulfillment).
- Le front tape l'**API Storefront** (GraphQL) via un **token public**. Le checkout
  reste sur le domaine Shopify.
- ⚠️ Le projet Next est dans le **sous-dossier `storefront/`** → sur Vercel,
  **Root Directory = `storefront`**.

## Direction artistique (à respecter)
- Palette : béton `#0A0B0D` / `#16181C` / `#22252B`, craie `#F2F0EB`, signal `#E4FF3A`.
- Typo : display condensé massif (sans-serif + `scaleY`), sans-serif technique.
- Signature : grille fine qui traverse tout le site, produits alignés en "secteurs".
- Variables CSS : `storefront/src/app/globals.css`.

## Commandes
```bash
cd storefront
npm install
npm run dev      # dev — mode démo si pas de token Shopify
npm run build    # build prod — DOIT passer avant tout commit non trivial
npm run start    # sert le build
```

## Environnement
`storefront/.env.local` (jamais commité) :
```
NEXT_PUBLIC_SHOPIFY_DOMAIN=astratech-9955.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<token public storefront>
```
Sans token → le front tourne en **mode démo** (fallback dans `page.tsx` et
`products/[handle]/page.tsx`).

## Structure
- `src/lib/shopify.ts` — client Storefront API (produits + panier : cartCreate /
  cartLinesAdd / cartLinesUpdate / cartLinesRemove → `checkoutUrl` Shopify).
- `src/lib/cart-context.tsx` — état panier global (add / remove / updateQuantity / checkout).
- `src/app/page.tsx` — home (hero maillot animé + drop + teaser manifeste).
- `src/app/products/[handle]/page.tsx` — fiche produit + sélecteur taille.
- `src/app/cart/page.tsx` — panier complet (quantités, sous-total, checkout).
- `src/app/manifeste/page.tsx` — page manifeste.
- `src/components/` — `nav`, `mini-cart`, `product-buy`, `jersey` (SVG recto/verso,
  3 coloris), `jersey-hero` (maillot 3D en rotation continue + célébration "But."),
  `smooth-scroll` (Lenis).

## Conventions
- Commentaires et copy en **français**.
- Styles colocalisés : CSS vars + `<style>` / `styled-jsx`. Pas de lib CSS externe.
- Animations en `transform`/`opacity`, gérer `prefers-reduced-motion` (adoucir, pas
  forcément tout couper — le maillot doit rester vivant).
- **Pas de police externe** (Google Fonts est bloqué au build dans le sandbox agent)
  → condensé via `scaleY`.

## Workflow git
- Branche de dev : **`claude/gryd-ecommerce-setup-36pzd4`**.
- Build vérifié avant commit. Push sur la branche → PR → merge dans `main` →
  Vercel **prod** redéploie. Ne pas pousser sur `main` sans accord explicite.
- Ne jamais committer `.env.local` ni le token Storefront **privé** (`shpat_…`).
