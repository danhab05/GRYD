# Plan Images Ecommerce redline26

- [x] Récupérer `Ecommerce.zip` depuis GitHub.
- [x] Extraire les images dans `storefront/public/redline26`.
- [x] Auditer les visuels et écarter ceux qui contiennent marques, équipes ou joueurs protégés.
- [x] Intégrer les images sûres comme moodboard visible sur la home et les fiches produit.
- [x] Adapter la DA au style du zip : rouge archive, bleu nuit, crème papier, or, texture football vintage.
- [x] Vérifier build et routes principales.
- [ ] Créer une PR puis merger dans `main` si validation OK.

## Review

- `npm run build` dans `storefront/` : OK.
- Routes testées en local : `/`, `/cart`, `/manifeste`, `/products/gryd-home-beton` répondent `200`.
- Les images contenant équipes, joueurs, logos ou marques protégés ne sont pas servies dans `public`.
- Les images sûres sont intégrées comme moodboard sur la home et les fiches produit.
