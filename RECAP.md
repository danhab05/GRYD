# RECAP GRYD — état réel du projet

_Dernière mise à jour : 2026-07-19_

Recap honnête : la vision, ce qu'on a vraiment, ce qui manque, qui fait quoi, et
tous les identifiants utiles. Guide technique : `CLAUDE.md` / `AGENTS.md`.

---

## 1. La vision

**GRYD** — marque de maillots de foot **originaux**, streetwear parisien, imprimés à
la demande (Printful). Concept : la **grille urbaine**, chaque maillot = "une case de
la grille". Designs 100 % originaux, **aucune copie** de club/sélection (obligation
légale + condition de survie des comptes Printful/Shopify).

**Direction artistique** : béton (`#0A0B0D`/`#16181C`), craie (`#F2F0EB`), jaune
signal (`#E4FF3A`) ; typo display condensée massive ; grille signature partout.

**Expérience voulue (brief Ethan)** : site **ultra premium**, animations façon
Nike × Apple. Pièce maîtresse = **le maillot au centre qui tourne**, avec une
**célébration type "but marqué"** (flash + "BUT."). Achat **sans friction**,
**tous les moyens de paiement** (Apple Pay / Google Pay / CB via Stripe).

**Architecture (headless)** : front Next.js (Vercel) + back Shopify (catalogue,
panier, checkout hébergé, paiements) + Printful (impression/logistique). Le front
tape l'API Storefront ; le checkout reste chez Shopify.

---

## 2. Ce qui est FAIT ✅

### Front (dans `storefront/`, build clean)
- Client **Storefront API** : produits + panier (Cart API) → `checkoutUrl` Shopify.
- **Home cinématique** : hero avec **maillot 3D SVG recto (GRYD) / verso (numéro 07)**
  qui **tourne en continu** + **célébration "BUT."** en boucle (flash signal + anneaux),
  scroll fluide **Lenis**. Fallback démo si pas de token.
- **Fiche produit** + sélecteur de taille + ajout au panier.
- **Panier** : mini-cart drawer animé (Framer Motion) **+ page `/cart` complète**
  (quantités +/−, retrait, sous-total, redirection checkout).
- **Page `/manifeste`** (éditoriale).
- **Maillot SVG** (3 coloris béton/craie/signal) réutilisé comme visuel de repli sur
  les cartes produit tant que Printful n'a pas poussé les vraies images.
- Nav, layout, DA appliquée.

### Shopify
- Store **GRYD** (nom d'affichage), Basic, EUR, France.
- **3 produits créés, passés `ACTIVE`**, tailles S/M/L/XL, descriptions avec mention
  "aucune affiliation" (protection IP).
- Produits **publiés sur le canal `Gryd Headless`** (indispensable pour que le token
  Storefront les voie).
- **Collection `Drop 01`** créée, les 3 produits dedans, publiée sur `Gryd Headless`.
- **Token Storefront API public** généré (via le canal Headless).

### Déploiement
- Repo sur GitHub, **Vercel connecté**, build OK, **Preview de la branche déployé**.

---

## 3. En cours / à valider 🟡

- **La prod Vercel (`gryd-psi.vercel.app`) pointe sur `main` = ANCIEN design.**
  Toute la refonte (page `/cart`, `/manifeste`, hero maillot animée) est sur la
  **branche** → **pas encore mergée** → **pas en prod**. Pour l'instant on la voit
  seulement via le **Preview de la branche**.
- **Deployment Protection ACTIVÉ** sur Vercel → le site répond `403` à tout visiteur
  non loggé (donc invisible pour le public et pour les tests automatisés). À
  **désactiver** pour rendre le site public.
- **Anim hero** : corrigée (rotation continue, indépendante du scroll) — **à valider
  visuellement** sur le dernier Preview.

---

## 4. Ce qui MANQUE ❌ (pour lancer pour de vrai)

### Produit / visuels
- **Printful connecté ✅.** Les designs du Drop 01 (t-shirt boxy, 2 maillots all-over,
  stickers El Dictator) sont poussés depuis Printful → produits Shopify avec **vraies
  images**, publiés sur le canal headless + Boutique en ligne, ajoutés à `Drop 01`.
  Le front les affiche automatiquement (`getAllProducts`).
- **Designs originaux** : compléter le drop / prochaines pièces (Ethan).

### Paiement / mise en vente
- **Aucun moyen de paiement actif.** Settings → Paiements → activer **Shopify
  Payments** (Apple Pay / Google Pay / CB) ou Stripe. Sans ça : pas d'encaissement.
- **Mot de passe boutique** : si l'Online Store est protégé, le retirer avant
  ouverture (Online Store → Préférences).

### Front / prod
- **Merger la branche dans `main`** (nouvelle PR) → Vercel prod se met à jour.
- **Désactiver Deployment Protection** Vercel (site public).
- **Confirmer les 2 env vars** (`NEXT_PUBLIC_SHOPIFY_DOMAIN`,
  `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`) en Production sur Vercel.
- **Domaine `gryd.co`** à brancher (DNS → Vercel) — reporté volontairement.

### Contenu / conformité
- **Pages légales** (mentions légales, CGV, retours, confidentialité) —
  Shopify Settings → Policies.
- SEO / images Open Graph / favicon / sitemap.
- (Optionnel) filtrer la home sur la collection Drop 01 ; page collection `/drop-01`.

---

## 5. Qui fait quoi

**Toi (manuel — hors de portée de l'agent) :**
- Printful : connexion + designs + images.
- Activer un moyen de paiement Shopify.
- Retirer le mot de passe boutique (si actif).
- Désactiver Deployment Protection Vercel + vérifier les env vars en prod.
- Brancher le domaine `gryd.co`.
- Merger la PR (ou me demander de la préparer).

**Moi (agent — sur demande, via MCP Shopify / GitHub / code) :**
- Merge / PR, filtrage collection, page `/drop-01`, pages légales (templates), SEO.
- Calibrage des animations, nouvelles pages, toute la logique/UI front.
- Opérations Shopify (produits, collections, publications) — déjà fait : ACTIVE +
  publication + collection.

---

## 6. Références (facts & IDs)

| Élément | Valeur |
|---|---|
| Store | RedLine — `astratech-9955.myshopify.com` — Basic, EUR, France |
| Canal headless | `Gryd Headless` — `gid://shopify/Publication/351528091990` |
| Collection | `Drop 01` — handle `drop-01` — `gid://shopify/Collection/702121935190` — **4 produits** |
| Produit — Boxy Tee | handle `t-shirt-boxy-homme` — `gid://shopify/Product/10983689093462` — 40 € |
| Produit — Maillot Édition Match | handle `maillot-all-over-unisexe` — `gid://shopify/Product/10983401423190` — 79 € |
| Produit — Maillot Édition Ville | handle `maillot-all-over-unisexe-1` — `gid://shopify/Product/10983671103830` — 36 € |
| Produit — Stickers El Dictator | handle `stickers-el-dictator` — `gid://shopify/Product/10969725272406` — 8,50 € |
| API version Storefront | `2025-01` |

> Les 4 produits ci-dessus sont **synchronisés depuis Printful**, `ACTIVE`, publiés sur
> le canal `Gryd Headless` **et** la Boutique en ligne. Les 4 « Exemple de produit »
> (échantillons Shopify par défaut) restent hors du canal headless → invisibles sur le front.
| Vercel prod | `gryd-psi.vercel.app` (⚠️ = `main` = ancien design ; Protection ON) |
| Branche de dev | `claude/gryd-ecommerce-setup-36pzd4` |
| PR | #1 (storefront initial) **mergée** ; commits suivants (cart/manifeste + refonte hero) **en attente de merge** |
| Stack | Next 16.2.10, React 19, framer-motion, gsap, lenis, TypeScript |

**Token Storefront public** (safe — exposé côté client par design) :
`a666e4d51dea667799032c2d0714eeb4`

> ⚠️ Le token Storefront **privé** (`shpat_…`) ne doit **jamais** être commité ni
> exposé. Il a été partagé une fois en chat → **le régénérer** par sécurité
> (Shopify → canal Headless → Storefront API → régénérer le jeton privé).

---

## 7. Gotchas connus

- Projet dans `storefront/` → sur Vercel, **Root Directory = `storefront`** (sinon
  le build échoue : "couldn't find package.json").
- L'API Storefront ne renvoie **que** les produits **`ACTIVE` ET publiés sur le canal**
  du token (fait pour les 3).
- Les variables `NEXT_PUBLIC_*` sont **gelées au build** → changer le token = **redeploy**.
- Sandbox agent : réseau sortant vers `*.myshopify.com` **bloqué** → les tests du token
  se font côté user / Vercel, pas depuis l'agent.
- `npm audit` : 2 vulns `postcss` **transitives internes à Next 16** → à ignorer (le
  fix auto voudrait downgrade Next → 9).
