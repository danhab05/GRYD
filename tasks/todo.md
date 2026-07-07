# Plan Audit Pages redline26

- [x] Lister et relire toutes les routes App Router.
- [x] Reproduire les pages cassées avec build/dev logs.
- [x] Corriger les bugs bloquants par page.
- [x] Harmoniser `/`, `/cart`, `/manifeste` et `/products/[handle]` avec la DA redline26.
- [x] Renommer la marque visible de GRYD vers redline26.
- [x] Vérifier responsive et build.
- [ ] Créer une PR puis merger dans `main` si validation OK.

## Review

- `npm run build` dans `storefront/` : OK.
- Routes testées en local : `/`, `/cart`, `/manifeste`, `/products/gryd-home-beton` répondent `200`.
- Marque visible renommée en `redline26` côté front, sans changer les handles Shopify existants.
- Textes visibles repassés en vouvoiement.
