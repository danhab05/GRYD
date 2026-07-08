# Codebase Map — redline26

Dernière mise à jour : 2026-07-07

## Vue d'ensemble

redline26 est une boutique e-commerce headless pour maillots de foot originaux. Le front est une application Next.js dans `storefront/`, connectée à Shopify via l'API Storefront. Shopify gère catalogue, panier, checkout et paiements ; Printful doit gérer impression et logistique.

## Stack

- `storefront/` : Next.js 16, React 19, TypeScript, App Router.
- Animations : Framer Motion, GSAP ScrollTrigger, Lenis, canvas-confetti, Howler.
- E-commerce : client Shopify Storefront GraphQL dans `storefront/src/lib/shopify.ts`.

## Fichiers clés

- `storefront/src/app/page.tsx` : home, hero redline26, moodboard images, drop produit, teaser manifeste.
- `storefront/src/app/shop/page.tsx` : catalogue maillots sur fond blanc avec filtres simples.
- `storefront/src/app/notre-histoire/page.tsx` : page storytelling et section “Vous nous avez vus sur”.
- `storefront/src/components/jersey-hero.tsx` : hero cinématique Stack A avec ScrollTrigger, CSS 3D, confettis et son opt-in.
- `storefront/src/components/jersey.tsx` : maillot SVG recto/verso réutilisé en hero et fallback produit.
- `storefront/src/components/smooth-scroll.tsx` : Lenis global.
- `storefront/src/lib/shopify.ts` : produits + panier Shopify.
- `storefront/src/lib/cart-context.tsx` : état panier global.
- `storefront/src/app/products/[handle]/page.tsx` : fiche produit.
- `storefront/src/app/cart/page.tsx` : panier complet.
- `storefront/src/app/manifeste/page.tsx` : manifeste.
- `storefront/src/app/globals.css` : variables DA, grille, nav globale.
- `storefront/public/redline26/` : images publiques sûres extraites du zip, utilisées comme moodboard.

## Contraintes

- Toujours lancer les commandes npm dans `storefront/`.
- Vercel doit avoir `Root Directory = storefront`.
- Ne jamais committer `storefront/.env.local` ni token privé Shopify.
- Designs 100 % originaux, aucune imitation de club/sélection/blason/sponsor réel.
