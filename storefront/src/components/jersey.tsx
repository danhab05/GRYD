/**
 * Maillot RedLine26 en SVG — recto (flocage marque) / verso (numéro + nom).
 * Sert de pièce maîtresse animée dans la hero (turntable 3D) ET de visuel de repli
 * sur les cartes produit tant que Printful n'a pas poussé les vraies images.
 */

type Colorway = "beton" | "craie" | "signal" | "archive";

const COLORWAYS: Record<Colorway, { body: string; trim: string; ink: string; seam: string }> = {
  beton: { body: "#101827", trim: "#B9964B", ink: "#F4E9D3", seam: "rgba(244,233,211,.14)" },
  craie: { body: "#F4E9D3", trim: "#E1161D", ink: "#070A12", seam: "rgba(7,10,18,.14)" },
  signal: { body: "#E1161D", trim: "#F4E9D3", ink: "#F4E9D3", seam: "rgba(244,233,211,.18)" },
  archive: { body: "#F4E4C8", trim: "#0B5D7C", ink: "#0B5D7C", seam: "rgba(11,93,124,.18)" },
};

// Silhouette maillot manches courtes, col en V.
const SHIRT =
  "M95 68 L136 72 Q160 96 184 72 L225 68 L302 122 L268 170 L226 143 L242 358 L78 358 L94 143 L52 170 L18 122 Z";

export function Jersey({
  face = "front",
  colorway = "signal",
  number = "07",
  name = "RedLine26",
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
      aria-label={`T-shirt RedLine26 ${colorway} ${face === "back" ? `numéro ${number}` : ""}`}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={`paint-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0B5D7C" stopOpacity="0" />
          <stop offset="18%" stopColor="#0B5D7C" stopOpacity="0.82" />
          <stop offset="82%" stopColor="#1795B8" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#1795B8" stopOpacity="0" />
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

      {colorway === "archive" && (
        <>
          <path
            d="M70 156 C104 139 128 145 156 132 C188 116 221 132 254 118 L246 188 C214 178 187 190 157 198 C125 207 98 196 72 211 Z"
            fill={`url(#paint-${uid})`}
            opacity="0.95"
          />
          <path d="M82 226 L238 226" stroke="#0B5D7C" strokeWidth="5" strokeLinecap="round" opacity="0.72" />
          <path d="M96 240 L224 240" stroke="#0B5D7C" strokeWidth="2.5" strokeLinecap="round" opacity="0.46" />
        </>
      )}

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
            RedLine26
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
            PARIS 26
          </text>
        </>
      ) : (
        <>
          {colorway === "archive" && (
            <>
              <path
                d="M64 166 C98 146 131 158 160 139 C194 118 222 139 258 126 L248 223 C214 212 190 228 160 236 C126 245 96 228 66 246 Z"
                fill={`url(#paint-${uid})`}
                opacity="0.9"
              />
              <text
                x="160"
                y="120"
                textAnchor="middle"
                fontFamily="'Helvetica Neue', Arial, sans-serif"
                fontWeight="800"
                fontSize="38"
                letterSpacing="-1"
                fill={c.ink}
              >
                RedLine26
              </text>
            </>
          )}
          {/* Nom floqué + numéro dorsal */}
          <text
            x="160"
            y={colorway === "archive" ? "154" : "150"}
            textAnchor="middle"
            fontFamily="'Helvetica Neue', Arial, sans-serif"
            fontWeight="800"
            fontSize={colorway === "archive" ? "14" : "17"}
            letterSpacing={colorway === "archive" ? "4" : "6"}
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
            fontSize={colorway === "archive" ? "142" : "150"}
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
