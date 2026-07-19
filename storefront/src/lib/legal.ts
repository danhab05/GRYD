/**
 * Contenu légal du site (RGPD + droit conso FR).
 * ------------------------------------------------
 * Rendu sur /legal/[slug]. Les mêmes textes sont à coller dans
 * Shopify → Réglages → Politiques (le checkout hébergé y renvoie).
 *
 * ⚠️ Les blocs 【À COMPLÉTER : …】 doivent être remplis (identité légale,
 * SIRET, adresse, email, médiateur) AVANT ouverture au public.
 * Ces textes sont des modèles — à faire relire par un juriste idéalement.
 */

export type LegalDoc = { slug: string; title: string; short: string; html: string };

const MAJ = "Dernière mise à jour : 19 juillet 2026.";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "mentions-legales",
    title: "Mentions légales",
    short: "Mentions légales",
    html: `
      <p>Conformément à l'article 6-III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), les utilisateurs du site RedLine26 sont informés de l'identité des intervenants.</p>
      <h2>Éditeur du site</h2>
      <ul>
        <li>Nom / raison sociale : 【À COMPLÉTER : nom de l'auto-entrepreneur ou raison sociale】</li>
        <li>Forme juridique : 【À COMPLÉTER : ex. Entrepreneur individuel / SASU / SARL】</li>
        <li>Adresse du siège : 【À COMPLÉTER : adresse complète】</li>
        <li>Immatriculation : 【À COMPLÉTER : n° SIREN/SIRET, RCS de …, ou « en cours »】</li>
        <li>Capital social : 【À COMPLÉTER si société】</li>
        <li>N° TVA intracommunautaire : 【À COMPLÉTER, ou « TVA non applicable, art. 293 B du CGI » en franchise en base】</li>
        <li>Directeur de la publication : 【À COMPLÉTER : nom】</li>
        <li>Contact : 【À COMPLÉTER : email, ex. contact@redline26.co】</li>
      </ul>
      <h2>Hébergement</h2>
      <p>Site vitrine : Vercel Inc., San Francisco, Californie, États-Unis — vercel.com.</p>
      <p>Boutique en ligne, panier et paiement : Shopify International Ltd., 1-2 Victoria Buildings, Haddington Road, Dublin 4, D04 XN32, Irlande — shopify.com.</p>
      <h2>Impression et expédition</h2>
      <p>Les produits sont imprimés à la demande et expédiés par notre partenaire Printful (Printful Inc.).</p>
      <h2>Propriété intellectuelle</h2>
      <p>Les designs, visuels, logos et textes présents sur le site sont des créations originales de RedLine26, protégées par le droit d'auteur et le droit des marques. Toute reproduction ou exploitation, totale ou partielle, sans autorisation écrite préalable, est interdite.</p>
      <p class="legal-maj">${MAJ}</p>
    `,
  },
  {
    slug: "cgv",
    title: "Conditions générales de vente",
    short: "CGV",
    html: `
      <p>Les présentes CGV régissent les ventes conclues sur le site RedLine26 entre l'éditeur (« le Vendeur ») et tout client non professionnel (« le Client »). Toute commande implique l'acceptation sans réserve des présentes CGV.</p>
      <h2>1. Produits</h2>
      <p>Le Vendeur propose des vêtements et accessoires (t-shirts, maillots, stickers) à motifs originaux, imprimés à la demande. Les photographies sont des visuels de présentation ; de légères variations de couleur peuvent exister.</p>
      <h2>2. Prix</h2>
      <p>Les prix sont indiqués en euros, toutes taxes comprises le cas échéant, hors frais de livraison précisés avant validation. Le prix applicable est celui en vigueur au moment de la commande.</p>
      <h2>3. Commande</h2>
      <p>La vente devient définitive après confirmation de la commande par email et encaissement du paiement.</p>
      <h2>4. Paiement</h2>
      <p>Le paiement s'effectue en ligne par carte bancaire, Apple Pay ou Google Pay, via un prestataire sécurisé (Shopify Payments / Stripe). Les données de carte ne sont pas conservées par le Vendeur.</p>
      <h2>5. Livraison</h2>
      <p>Les produits étant imprimés à la demande, le délai se compose d'un délai de fabrication puis d'acheminement (voir la Politique d'expédition). Les délais sont indicatifs ; le Vendeur n'est pas responsable des retards imputables au transporteur ou à un cas de force majeure.</p>
      <h2>6. Droit de rétractation</h2>
      <p>Conformément aux articles L221-18 et suivants du Code de la consommation, le Client dispose d'un délai de <strong>14 jours</strong> à compter de la réception pour se rétracter sans motif. Les modalités figurent dans la page Retours &amp; remboursements.</p>
      <h2>7. Retours et remboursements</h2>
      <p>Voir la page Retours &amp; remboursements. En cas de produit défectueux, endommagé ou non conforme, le Vendeur procède au remplacement ou au remboursement sans frais pour le Client.</p>
      <h2>8. Garanties légales</h2>
      <p>Le Client bénéficie de la garantie légale de conformité (art. L217-3 et s. du Code de la consommation) et de la garantie contre les vices cachés (art. 1641 et s. du Code civil).</p>
      <h2>9. Responsabilité</h2>
      <p>La responsabilité du Vendeur ne saurait être engagée pour un usage anormal du produit ni pour des dommages indirects ; elle est limitée au montant de la commande.</p>
      <h2>10. Données personnelles</h2>
      <p>Les traitements sont décrits dans la Politique de confidentialité.</p>
      <h2>11. Médiation et litiges</h2>
      <p>En cas de litige, le Client s'adresse d'abord au Vendeur. À défaut d'accord amiable, conformément à l'article L612-1 du Code de la consommation, le Client peut recourir gratuitement à un médiateur de la consommation : 【À COMPLÉTER : nom et coordonnées du médiateur souscrit】. Plateforme européenne de règlement en ligne des litiges : https://ec.europa.eu/consumers/odr</p>
      <h2>12. Droit applicable</h2>
      <p>Les présentes CGV sont soumises au droit français.</p>
      <p class="legal-maj">${MAJ}</p>
    `,
  },
  {
    slug: "confidentialite",
    title: "Politique de confidentialité",
    short: "Confidentialité",
    html: `
      <p>Cette politique décrit comment RedLine26 collecte et traite vos données personnelles, conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.</p>
      <h2>Responsable de traitement</h2>
      <p>【À COMPLÉTER : nom / raison sociale de l'éditeur】 — contact : 【À COMPLÉTER : email】.</p>
      <h2>Données collectées</h2>
      <ul>
        <li>Identité et coordonnées (nom, prénom, email, adresses de livraison et de facturation, téléphone) ;</li>
        <li>Données de commande (produits, montants, historique) ;</li>
        <li>Données de navigation (cookies, adresse IP, pages visitées).</li>
      </ul>
      <p>Les données de paiement sont traitées directement par le prestataire de paiement et ne sont pas conservées par le Vendeur.</p>
      <h2>Finalités et bases légales</h2>
      <ul>
        <li>Traitement et suivi des commandes — exécution du contrat ;</li>
        <li>Service client et retours — exécution du contrat ;</li>
        <li>Obligations comptables et légales — obligation légale ;</li>
        <li>Newsletter — consentement ;</li>
        <li>Mesure d'audience — intérêt légitime / consentement pour les cookies non essentiels.</li>
      </ul>
      <h2>Destinataires</h2>
      <p>Vos données sont partagées uniquement avec les prestataires nécessaires : Shopify (boutique et checkout), Printful (impression et expédition), le prestataire de paiement (Shopify Payments / Stripe) et les transporteurs. Certains prestataires pouvant être hors Union européenne, des garanties appropriées (clauses contractuelles types) encadrent ces transferts.</p>
      <h2>Durée de conservation</h2>
      <p>Les données de commande sont conservées le temps de la relation commerciale puis archivées selon les obligations légales (notamment 10 ans pour les pièces comptables). Les données marketing sont conservées jusqu'au retrait du consentement.</p>
      <h2>Vos droits</h2>
      <p>Vous disposez des droits d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité, exerçables à 【À COMPLÉTER : email】. Vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).</p>
      <h2>Cookies</h2>
      <p>Le site utilise des cookies nécessaires à son fonctionnement (panier, session) et, sous réserve de votre consentement, des cookies de mesure d'audience.</p>
      <p class="legal-maj">${MAJ}</p>
    `,
  },
  {
    slug: "retours",
    title: "Retours & remboursements",
    short: "Retours",
    html: `
      <h2>Droit de rétractation (14 jours)</h2>
      <p>Vous disposez d'un délai de <strong>14 jours</strong> à compter de la réception de votre commande pour nous informer de votre souhait de vous rétracter, sans motif (art. L221-18 du Code de la consommation). Vous disposez ensuite de 14 jours pour renvoyer les articles.</p>
      <h2>Conditions de retour</h2>
      <ul>
        <li>Articles neufs, non portés, non lavés, non modifiés, dans leur état d'origine ;</li>
        <li>Nos produits sont fabriqués en série (non personnalisés à votre demande) : le droit de rétractation s'applique pleinement.</li>
      </ul>
      <h2>Comment faire</h2>
      <p>Contactez-nous à 【À COMPLÉTER : email】 en indiquant votre numéro de commande ; nous vous communiquerons l'adresse de retour. Sauf produit défectueux ou erreur de notre part, les frais de retour sont à votre charge.</p>
      <h2>Remboursement</h2>
      <p>Après réception et vérification de l'article, vous êtes remboursé sous <strong>14 jours</strong>, par le même moyen de paiement. Les frais de livraison standard initiaux sont remboursés (hors surcoût d'un mode de livraison express que vous auriez choisi).</p>
      <h2>Produit défectueux, endommagé ou erroné</h2>
      <p>En cas de défaut d'impression, de dommage ou d'erreur (taille, modèle), contactez-nous sous 14 jours après réception avec une photo : nous procédons au remplacement ou au remboursement complet, sans frais pour vous.</p>
      <p>Nos produits étant imprimés à la demande, pensez à consulter le guide des tailles avant de commander.</p>
      <p class="legal-maj">${MAJ}</p>
    `,
  },
  {
    slug: "expedition",
    title: "Expédition",
    short: "Expédition",
    html: `
      <p>Nos articles sont imprimés à la demande : chaque commande est fabriquée spécialement pour vous par notre partenaire Printful, puis expédiée.</p>
      <h2>Délais</h2>
      <ul>
        <li>Fabrication : généralement 2 à 5 jours ouvrés ;</li>
        <li>Acheminement : France 2 à 5 jours ouvrés, Union européenne 4 à 8 jours ouvrés, International 7 à 20 jours ouvrés (indicatif).</li>
      </ul>
      <p>Le délai total = fabrication + acheminement. Ces délais sont indicatifs et peuvent varier en forte activité.</p>
      <h2>Frais de livraison</h2>
      <p>Les frais sont calculés selon la destination et affichés avant le paiement.</p>
      <h2>Suivi</h2>
      <p>Un email de confirmation d'expédition, avec numéro de suivi lorsqu'il est disponible, vous est envoyé.</p>
      <h2>Douanes (hors UE)</h2>
      <p>Pour les livraisons hors Union européenne, des droits de douane ou taxes locales peuvent s'appliquer, à la charge du destinataire.</p>
      <h2>Adresse erronée / colis non réclamé</h2>
      <p>Merci de vérifier votre adresse : un colis retourné pour adresse incorrecte ou non réclamé pourra faire l'objet de frais de réexpédition.</p>
      <p class="legal-maj">${MAJ}</p>
    `,
  },
  {
    slug: "contact",
    title: "Contact",
    short: "Contact",
    html: `
      <p>Une question sur une commande, un retour ou un produit ? Écrivez-nous à 【À COMPLÉTER : email, ex. contact@redline26.co】.</p>
      <p>Nous répondons généralement sous 48 heures ouvrées.</p>
      <p class="legal-maj">${MAJ}</p>
    `,
  },
];

export function getLegalDoc(slug: string): LegalDoc | null {
  return LEGAL_DOCS.find((d) => d.slug === slug) ?? null;
}
