/**
 * Maillot GRYD en SVG — recto (flocage GRYD sur la poitrine) / verso (numéro + nom).
 * Sert de pièce maîtresse animée dans la hero (turntable 3D) ET de visuel de repli
 * sur les cartes produit tant que Printful n'a pas poussé les vraies images.
 */

type Colorway = "beton" | "craie" | "signal";

const COLORWAYS: Record<Colorway, { body: string; trim: string; ink: string; seam: string }> = {
  beton: { body: "#22252B", trim: "#E4FF3A", ink: "#F2F0EB", seam: "rgba(242,240,235,.14)" },
  craie: { body: "#F2F0EB", trim: "#0A0B0D", ink: "#0A0B0D", seam: "rgba(10,11,13,.14)" },
  signal: { body: "#E4FF3A", trim: "#0A0B0D", ink: "#0A0B0D", seam: "rgba(10,11,13,.16)" },
};

// Silhouette maillot manches courtes, col en V.
const SHIRT =
  "M95 68 L136 72 Q160 96 184 72 L225 68 L302 122 L268 170 L226 143 L242 358 L78 358 L94 143 L52 170 L18 122 Z";

export function Jersey({
  face = "front",
  colorway = "signal",
  number = "07",
  name = "GRYD",
  className,
}: {
  face?: "front" | "back";
  colorway?: Colorway;
  number?: string;
  name?: string;
  className?: string;
}) {
  const c = COLORWAYS[colorway] ?? COLORWAYS.signal;
  const uid = `${colorway}-${face}`;

  return (
    <svg
      viewBox="0 0 320 380"
      className={className}
      role="img"
      aria-label={`Maillot GRYD ${colorway} ${face === "back" ? `numéro ${number}` : ""}`}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      {/* Corps + manches */}
      <path d={SHIRT} fill={c.body} stroke={c.trim} strokeWidth="2" strokeLinejoin="round" />

      {/* Coutures / trame verticale */}
      <path d="M160 100 L160 356" stroke={c.seam} strokeWidth="1.5" />
      <path d="M120 143 L112 356" stroke={c.seam} strokeWidth="1" opacity="0.6" />
      <path d="M200 143 L208 356" stroke={c.seam} strokeWidth="1" opacity="0.6" />

      {/* Bandes de manche */}
      <path d="M52 170 L18 122" fill="none" stroke={c.trim} strokeWidth="7" strokeLinecap="round" />
      <path d="M268 170 L302 122" fill="none" stroke={c.trim} strokeWidth="7" strokeLinecap="round" />

      {/* Col en V */}
      <path d="M136 72 Q160 98 184 72" fill="none" stroke={c.trim} strokeWidth="7" strokeLinecap="round" />

      {face === "front" ? (
        <>
          {/* Écusson + flocage poitrine */}
          <rect x="112" y="150" width="10" height="10" fill={c.trim} opacity="0.9" />
          <text
            x="160"
            y="182"
            textAnchor="middle"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontWeight="800"
            fontSize="30"
            letterSpacing="3"
            fill={c.ink}
          >
            GRYD
          </text>
          <text
            x="160"
            y="205"
            textAnchor="middle"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontWeight="700"
            fontSize="9"
            letterSpacing="5"
            fill={c.ink}
            opacity="0.55"
          >
            PARIS
          </text>
        </>
      ) : (
        <>
          {/* Nom floqué + numéro dorsal */}
          <text
            x="160"
            y="150"
            textAnchor="middle"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontWeight="800"
            fontSize="17"
            letterSpacing="6"
            fill={c.ink}
          >
            {name}
          </text>
          <text
            x="160"
            y="290"
            textAnchor="middle"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontWeight="800"
            fontSize="150"
            letterSpacing="-4"
            fill={c.ink}
            style={{ transform: "scaleY(1.08)", transformOrigin: "160px 250px" }}
          >
            {number}
          </text>
        </>
      )}

      {/* Reflet tissu */}
      <path d={SHIRT} fill={`url(#sheen-${uid})`} stroke="none" />
    </svg>
  );
}
