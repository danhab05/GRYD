/**
 * Logo RedLine — wordmark "REDLINE" barré par une ligne rouge terminée en flèche.
 * Vectoriel (texte + trait CSS) : transparent, net, et s'adapte à la couleur du
 * contexte (encre foncée sur la nav claire) via `currentColor`. La taille suit la
 * `font-size` du parent.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`rl-logo ${className ?? ""}`.trim()} aria-label="RedLine26">
      <span className="rl-word">Redline</span>
      <i className="rl-strike" aria-hidden />
    </span>
  );
}
