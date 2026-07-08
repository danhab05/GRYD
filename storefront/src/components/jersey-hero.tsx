"use client";

/**
 * Hero redline26 — vidéo cinématique.
 * -----------------------------------
 * La vidéo (public/redline26/hero.mp4) est jouée en plein cadre, en boucle,
 * muette et en autoplay. Elle sert de fond ; par-dessus on pose l'identité
 * (eyebrow, titre "Porte la ville", CTA) avec un scrim dégradé pour la lisibilité.
 * Bouton son pour activer l'audio. C'est une intégration éditoriale, pas un
 * lecteur brut : aucun contrôle natif visible.
 *
 * prefers-reduced-motion : la vidéo ne joue pas (affiche le poster figé).
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PRODUCT_PHOTO } from "@/lib/assets";

const HERO_VIDEO = "/redline26/hero.mp4";

export function JerseyHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // muted + defaultMuted forcés en JS : sinon certains navigateurs voient la
    // vidéo comme "non muette" et bloquent l'autoplay.
    v.muted = true;
    v.defaultMuted = true;

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    v.addEventListener("loadeddata", tryPlay, { once: true });
    v.addEventListener("canplay", tryPlay, { once: true });

    // Filet de sécurité : si le navigateur bloque quand même, on lance au 1er geste.
    const onFirst = () => tryPlay();
    window.addEventListener("pointerdown", onFirst, { once: true });
    window.addEventListener("touchstart", onFirst, { once: true });

    return () => {
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      window.removeEventListener("pointerdown", onFirst);
      window.removeEventListener("touchstart", onFirst);
    };
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (!next) v.play().catch(() => {});
  };

  return (
    <section className="jh">
      <video
        ref={videoRef}
        className="jh-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={PRODUCT_PHOTO}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      <div className="jh-scrim" aria-hidden />
      <div className="jh-grain" aria-hidden />

      <div className="jh-overlay">
        <div className="jh-eyebrow">Paris · Édition sur le bitume</div>
        <h1 className="jh-title">
          <span className="jh-line l1">Porte</span>
          <span className="jh-line l2 signal">la ville</span>
        </h1>
        <p className="jh-tag">Maillots de foot originaux, imprimés à la demande. Séries numérotées.</p>
        <div className="jh-actions">
          <Link href="#drop" className="jh-cta">Voir le drop →</Link>
          <Link href="/shop" className="jh-cta ghost">Le shop</Link>
        </div>
      </div>

      <button type="button" className="jh-sound" onClick={toggleSound} aria-pressed={!muted}>
        {muted ? "♪ Activer le son" : "♪ Couper le son"}
      </button>

      <div className="jh-cue" aria-hidden>
        <span>Scroll</span>
        <i />
      </div>

      <style>{`
        .jh{position:relative;z-index:2;height:100vh;min-height:560px;overflow:hidden;background:#0b0b0d}
        .jh-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
        .jh-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;
          background:
            linear-gradient(180deg,rgba(11,11,13,.42) 0%,transparent 26%,transparent 52%,rgba(11,11,13,.72) 100%),
            radial-gradient(120% 80% at 50% 40%,transparent 40%,rgba(11,11,13,.35) 100%)}
        .jh-grain{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.06;mix-blend-mode:overlay;
          background-image:radial-gradient(rgba(255,255,255,.9) .5px,transparent .5px);background-size:3px 3px}

        .jh-overlay{position:absolute;z-index:2;left:0;right:0;bottom:16%;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 24px}
        .jh-eyebrow{font-size:12px;letter-spacing:.42em;text-transform:uppercase;font-weight:700;color:var(--signal);margin-bottom:22px;opacity:0;animation:jhUp .8s .1s cubic-bezier(.16,1,.3,1) forwards}
        .jh-title{display:flex;flex-direction:column;align-items:center;line-height:.82;letter-spacing:-.04em;text-transform:uppercase;font-weight:900;color:#fff;text-shadow:0 8px 40px rgba(0,0,0,.5)}
        .jh-line{display:block;font-size:clamp(52px,11vw,150px);opacity:0;transform:translateY(120%);animation:jhReveal .9s cubic-bezier(.16,1,.3,1) forwards}
        .jh-line.l1{animation-delay:.22s}
        .jh-line.l2{animation-delay:.36s}
        .jh-title .signal{color:var(--signal)}
        .jh-tag{max-width:520px;margin-top:22px;font-size:14px;line-height:1.6;color:rgba(255,255,255,.82);opacity:0;animation:jhUp .8s .6s cubic-bezier(.16,1,.3,1) forwards}
        .jh-actions{display:flex;gap:12px;margin-top:30px;flex-wrap:wrap;justify-content:center;opacity:0;animation:jhUp .8s .74s cubic-bezier(.16,1,.3,1) forwards}
        .jh-cta{font-size:13px;font-weight:800;letter-spacing:.02em;border-radius:999px;padding:15px 28px;background:#fff;color:#0b0b0d;transition:transform .25s,background .25s,color .25s}
        .jh-cta:hover{transform:translateY(-2px);background:var(--signal);color:#fff}
        .jh-cta.ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.5)}
        .jh-cta.ghost:hover{background:#fff;color:#0b0b0d;border-color:#fff}

        .jh-sound{position:absolute;z-index:3;right:28px;top:96px;font-size:12px;font-weight:700;letter-spacing:.02em;border-radius:999px;padding:11px 18px;background:rgba(11,11,13,.4);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.28);color:#fff;transition:border-color .25s,background .25s}
        .jh-sound:hover{border-color:#fff;background:rgba(11,11,13,.6)}

        .jh-cue{position:absolute;z-index:3;left:50%;bottom:26px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.7)}
        .jh-cue i{width:30px;height:1px;background:linear-gradient(90deg,#fff,transparent);animation:jhCue 1.8s ease-in-out infinite}

        @keyframes jhReveal{to{opacity:1;transform:translateY(0)}}
        @keyframes jhUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes jhCue{0%,100%{transform:scaleX(.4);opacity:.3}50%{transform:scaleX(1);opacity:1}}

        @media (prefers-reduced-motion:reduce){
          .jh-eyebrow,.jh-line,.jh-tag,.jh-actions{animation:none;opacity:1;transform:none}
          .jh-cue i{animation:none}
        }
        @media(max-width:820px){
          .jh-overlay{bottom:14%}
          .jh-sound{right:16px;top:78px}
        }
      `}</style>
    </section>
  );
}
