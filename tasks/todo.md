# Plan Stack A Hero GRYD

- [x] Auditer la hero actuelle et les composants maillot.
- [x] Ajouter les dépendances Stack A manquantes.
- [x] Implémenter ScrollTrigger + CSS 3D transforms sur le maillot.
- [x] Ajouter la célébration de but : flash, BUT., anneaux, confettis, son activable.
- [x] Vérifier responsive, prefers-reduced-motion et build.
- [ ] Créer une PR puis merger dans main si validation locale OK.

## Review

- `npm run build` dans `storefront/` : OK.
- La hero est maintenant pilotée par GSAP ScrollTrigger avec pin/scrub.
- Le mode `prefers-reduced-motion` garde une pose statique sans confettis ni pin.
