"use client";

/**
 * Hero cinématique GRYD.
 * ----------------------
 * Le maillot 3D (recto GRYD / verso numéro) tourne EN CONTINU sur lui-même,
 * dès l'arrivée — piloté par le temps (boucle Framer), pas par le scroll : c'est
 * fiable, ça bouge toujours. À chaque fois que le dos (numéro) passe face caméra,
 * un flash "signal" + le mot BUT. claquent, comme si tu venais de marquer.
 *
 * prefers-reduced-motion : on ne coupe pas tout — le maillot tourne lentement et
 * doucement, sans flash stroboscopique.
 */

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Jersey } from "./jersey";

// Durée d'un tour complet. Le dos (rotateY 180°) fait face à mi-parcours (0.5),
// c'est là qu'on cale la célébration.
const SPIN = 13;

export function JerseyHero() {
  const reduce = useReducedMotion();

  const reveal = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay } }
      : {
          initial: { y: "115%" },
          animate: { y: 0 },
          transition: { delay, duration: 1, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="jh">
      <div className="jh-eyebrow">Paris · Édition sur le bitume</div>

      <div className="jh-stage">
        <span className="jh-line">
          <motion.h1 className="jh-title display" {...reveal(0.2)}>Porte</motion.h1>
        </span>

        <div className="jh-jersey">
          <motion.div
            className="jh-jersey-3d"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: 360 }}
            transition={{ repeat: Infinity, ease: "linear", duration: reduce ? 46 : SPIN }}
          >
            <div className="jh-face jh-front">
              <Jersey face="front" colorway="signal" />
            </div>
            <div className="jh-face jh-back">
              <Jersey face="back" colorway="signal" number="07" name="GRYD" />
            </div>
          </motion.div>
        </div>

        <span className="jh-line">
          <motion.h1 className="jh-title display signal" {...reveal(0.35)}>La ville</motion.h1>
        </span>
      </div>

      {/* Célébration en boucle, calée sur le passage du dos (désactivée en reduced-motion) */}
      {!reduce && (
        <div className="jh-celebrate" aria-hidden>
          <motion.div
            className="jh-flash"
            animate={{ opacity: [0, 0, 0.85, 0] }}
            transition={{ repeat: Infinity, duration: SPIN, times: [0, 0.42, 0.5, 0.62], ease: "easeInOut" }}
          />
          <div className="jh-center">
            <motion.div
              className="jh-burst"
              animate={{ opacity: [0, 0, 0.9, 0], scale: [0.3, 0.3, 1, 1.55] }}
              transition={{ repeat: Infinity, duration: SPIN, times: [0, 0.42, 0.5, 0.64], ease: "easeOut" }}
            />
            <motion.div
              className="jh-but display"
              animate={{ opacity: [0, 0, 1, 0], scale: [0.7, 0.7, 1.06, 1.3] }}
              transition={{ repeat: Infinity, duration: SPIN, times: [0, 0.44, 0.52, 0.64], ease: "easeOut" }}
            >
              But.
            </motion.div>
          </div>
        </div>
      )}

      <div className="jh-foot">
        <Link href="#drop" className="jh-cta">Voir le drop →</Link>
        <div className="jh-cue" aria-hidden>
          <span>Scroll</span>
          <i />
        </div>
      </div>

      <style jsx>{`
        .jh {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 0 24px;
        }
        .jh-eyebrow {
          position: absolute;
          top: 96px;
          font-size: 12px;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: var(--signal);
          z-index: 4;
        }

        .jh-stage {
          position: relative;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .jh-line {
          display: block;
          overflow: hidden;
        }
        .jh-title {
          display: block;
          font-size: clamp(44px, 11vw, 150px);
          line-height: 0.82;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          transform: scaleY(1.12);
          transform-origin: center;
          pointer-events: none;
        }
        .jh-title.top {
          margin-bottom: -2vh;
        }
        .jh-title.signal {
          color: var(--signal);
        }

        .jh-jersey {
          position: relative;
          width: min(44vh, 340px);
          aspect-ratio: 320 / 380;
          margin: -2vh 0;
          perspective: 1400px;
        }
        .jh-jersey-3d {
          position: absolute;
          inset: 0;
        }
        .jh-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          filter: drop-shadow(0 40px 60px rgba(0, 0, 0, 0.6));
        }
        .jh-back {
          transform: rotateY(180deg);
        }

        .jh-celebrate {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
        }
        .jh-flash {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(228, 255, 58, 0.6), transparent 55%);
          mix-blend-mode: screen;
          opacity: 0;
        }
        .jh-center {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .jh-burst {
          position: absolute;
          width: 60vh;
          height: 60vh;
          border: 1.5px solid var(--signal);
          border-radius: 50%;
          opacity: 0;
        }
        .jh-burst::before,
        .jh-burst::after {
          content: "";
          position: absolute;
          inset: 20%;
          border: 1px solid var(--signal);
          border-radius: 50%;
          opacity: 0.5;
        }
        .jh-burst::after {
          inset: 38%;
          opacity: 0.3;
        }
        .jh-but {
          position: absolute;
          font-size: clamp(90px, 24vw, 340px);
          line-height: 0.8;
          color: var(--signal);
          letter-spacing: -0.04em;
          text-transform: uppercase;
          transform: scaleY(1.1);
          text-shadow: 0 0 60px rgba(228, 255, 58, 0.4);
          opacity: 0;
        }

        .jh-foot {
          position: absolute;
          bottom: 34px;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 26px;
          z-index: 4;
        }
        .jh-cta {
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          border: 1px solid var(--line);
          padding: 13px 22px;
          background: rgba(10, 11, 13, 0.4);
          backdrop-filter: blur(4px);
          transition: background 0.3s, color 0.3s, transform 0.3s;
        }
        .jh-cta:hover {
          background: var(--signal);
          color: var(--concrete-900);
          transform: translateY(-2px);
        }
        .jh-cue {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          opacity: 0.55;
        }
        .jh-cue i {
          width: 34px;
          height: 1px;
          background: linear-gradient(90deg, var(--chalk), transparent);
          animation: jhCue 1.8s ease-in-out infinite;
        }
        @keyframes jhCue {
          0%, 100% { transform: scaleX(0.4); opacity: 0.3; }
          50% { transform: scaleX(1); opacity: 1; }
        }

        @media (max-width: 820px) {
          .jh-eyebrow { top: 76px; }
          .jh-jersey { width: min(38vh, 250px); }
          .jh-foot { flex-direction: column; gap: 16px; bottom: 24px; }
        }
      `}</style>
    </section>
  );
}
