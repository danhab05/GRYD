# Storefront headless — Shopify × Next.js

Vitrine premium (animations Nike × Apple) en Next.js, branchée sur Shopify
pour le catalogue, le panier, le checkout et les paiements.

## Qui héberge quoi

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│  TON FRONT (Vercel/VPS)     │        │  SHOPIFY (plan Basic)        │
│                             │        │                              │
│  • Next.js 15 + React 19    │  API   │  • Catalogue produits        │
│  • Animations GSAP / Framer │ ─────► │  • Panier (Cart API)         │
│  • Smooth scroll (Lenis)    │ Store  │  • Checkout hébergé (PCI)    │
│  • Pages produits ciné      │ front  │  • Stripe / Apple / Google   │
│  • Ton domaine .com         │ GraphQL│  • Intégration Printful      │
└─────────────────────────────┘        └──────────────────────────────┘
```

Le client navigue sur ton site. Au clic « Acheter », le panier est créé via
l'API Storefront, puis on le redirige vers `checkoutUrl` (page Shopify sécurisée)
où Apple Pay / Google Pay / Stripe se règlent en un tap. La commande part ensuite
en impression chez Printful.

## Ce qui reste à faire de ton côté

1. **Storefront API token** — admin Shopify → Settings → Apps → Develop apps →
   Create an app → Storefront API. Scopes : `unauthenticated_read_product_listings`,
   `unauthenticated_write_checkouts`. Colle-le dans `.env.local`.
2. **Printful** — connecte l'app Printful à Shopify, crée tes maillots (produits
   POD), ils remontent automatiquement dans le catalogue Shopify → donc dans ce front.
3. **Domaine** — pointe ton domaine sur Vercel. Le checkout reste sur le
   sous-domaine `.myshopify.com` (ou un sous-domaine `checkout.` si tu configures).
4. **Déploiement** — `vercel` (gratuit pour démarrer) ou ton VPS Hostinger.

## Démarrer en local

```bash
cp .env.local.example .env.local   # puis remplis le token
npm install
npm run dev                        # http://localhost:3000
```

## Structure

```
src/
  lib/
    shopify.ts        → client Storefront API (produits, panier, checkout)
    cart-context.tsx  → état panier global + redirection checkout
  app/                → pages (home, /products/[handle]) — à générer une fois
                        le nom de marque + concept fixés
  components/         → UI + animations
```

## Ce qui manque pour finaliser

Le **nom de la marque** et le **concept des maillots** (identité originale, pas
de copie de sélection existante). Dès que c'est calé :
- création des produits sur Shopify (je peux le faire directement)
- génération des pages (home cinématique, page produit, mini-cart animé)
- direction artistique complète (palette, typo, signature visuelle)
