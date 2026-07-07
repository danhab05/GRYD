"use client";

/**
 * Hero cinématique GRYD.
 * ----------------------
 * Un maillot 3D (recto GRYD / verso numéro) posé au centre. En scrollant,
 * il fait un tour sur lui-même (turntable rotateY piloté par le scroll) et,
 * au moment où le dos passe face caméra, un flash "signal" éclate avec le mot
 * BUT. — comme si tu venais de marquer. Les deux mots du titre s'écartent pour
 * laisser la pièce prendre toute la place.
 *
 * Tout est en transform/opacity (GPU), lissé par un spring, et neutralisé si
 * l'utilisateur préfère réduire les animations.
 */

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { Jersey } from "./jersey";

export function JerseyHero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 });

  // Maillot
  const rotateY = useTransform(p, [0, 1], [0, reduce ? 0 : 340]);
  const scale = useTransform(p, [0, 0.45, 1], [0.82, 1.08, 0.92]);
  const jerseyY = useTransform(p, [0, 1], ["2%", "-8%"]);

  // Titre : les deux mots s'écartent puis s'effacent
  const topY = useTransform(p, [0, 0.5], ["0%", "-160%"]);
  const botY = useTransform(p, [0, 0.5], ["0%", "160%"]);
  const titleOpacity = useTransform(p, [0, 0.32], [1, 0]);

  // Moment "BUT" — pic quand le dos (numéro) est face caméra (~ p 0.5)
  const flash = useTransform(p, [0.4, 0.5, 0.6], [0, reduce ? 0 : 1, 0]);
  const burstScale = useTransform(p, [0.42, 0.6], [0.4, 1.5]);
  const butScale = useTransform(p, [0.44, 0.52, 0.62], [0.7, 1, 1.3]);
  const butOpacity = useTransform(p, [0.45, 0.52, 0.6], [0, reduce ? 0 : 1, 0]);

  const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);

  return (
    <section ref={ref} className="jh">
      <div className="jh-sticky">
        <div className="jh-eyebrow">Paris · Édition sur le bitume</div>

        <motion.h1
          className="jh-title top display"
          style={{ y: reduce ? 0 : topY, opacity: reduce ? 1 : titleOpacity }}
        >
          Porte
        </motion.h1>

        <motion.div className="jh-jersey" style={{ scale, y: jerseyY }}>
          <motion.div className="jh-jersey-3d" style={{ rotateY }}>
            <div className="jh-face jh-front">
              <Jersey face="front" colorway="signal" />
            </div>
            <div className="jh-face jh-back">
              <Jersey face="back" colorway="signal" number="07" name="GRYD" />
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          className="jh-title bot display signal"
          style={{ y: reduce ? 0 : botY, opacity: reduce ? 1 : titleOpacity }}
        >
          La ville
        </motion.h1>

        {/* Célébration */}
        <motion.div className="jh-flash" style={{ opacity: flash }} aria-hidden />
        <motion.div className="jh-burst" style={{ opacity: flash, scale: burstScale }} aria-hidden />
        <motion.div
          className="jh-but display"
          style={{ scale: butScale, opacity: butOpacity }}
          aria-hidden
        >
          But.
        </motion.div>

        <motion.div className="jh-cue" style={{ opacity: cueOpacity }} aria-hidden>
          <span>Scroll</span>
          <i />
        </motion.div>

        <Link href="#drop" className="jh-skip">Voir le drop →</Link>
      </div>

      <style jsx>{`
        .jh {
          position: relative;
          height: 260vh;
          z-index: 2;
        }
        .jh-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          perspective: 1600px;
        }
        .jh-eyebrow {
          position: absolute;
          top: 88px;
          font-size: 12px;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          color: var(--signal);
        }
        .jh-title {
          font-size: clamp(44px, 11vw, 150px);
          line-height: 0.82;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          transform: scaleY(1.12);
          transform-origin: center;
          z-index: 1;
          pointer-events: none;
        }
        .jh-title.top {
          margin-bottom: -3vh;
        }
        .jh-title.bot {
          margin-top: -3vh;
        }
        .jh-title.signal {
          color: var(--signal);
        }

        .jh-jersey {
          position: relative;
          width: min(46vh, 360px);
          aspect-ratio: 320 / 380;
          z-index: 3;
          /* perspective sur le parent DIRECT du plan 3D — sinon la rotation
             apparaît orthographique (plate). Pas de filter ici : il aplatirait
             le contexte 3D des enfants. */
          perspective: 1400px;
        }
        .jh-jersey-3d {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
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

        .jh-flash {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(228, 255, 58, 0.6), transparent 58%);
          mix-blend-mode: screen;
          pointer-events: none;
          z-index: 4;
        }
        .jh-burst {
          position: absolute;
          width: 62vh;
          height: 62vh;
          border: 1.5px solid var(--signal);
          border-radius: 50%;
          pointer-events: none;
          z-index: 4;
        }
        .jh-burst::before,
        .jh-burst::after {
          content: "";
          position: absolute;
          inset: 18%;
          border: 1px solid var(--signal);
          border-radius: 50%;
          opacity: 0.5;
        }
        .jh-burst::after {
          inset: 34%;
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
          pointer-events: none;
          z-index: 5;
          text-shadow: 0 0 60px rgba(228, 255, 58, 0.4);
        }

        .jh-cue {
          position: absolute;
          bottom: 34px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .jh-cue i {
          width: 1px;
          height: 46px;
          background: linear-gradient(var(--chalk), transparent);
          animation: cue 1.8s ease-in-out infinite;
        }
        @keyframes cue {
          0%, 100% { transform: scaleY(0.4); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        /* Accès direct au drop (visible, hors animation, pour ne pas forcer le scroll) */
        .jh-skip {
          position: absolute;
          right: 40px;
          bottom: 40px;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          border: 1px solid var(--line);
          padding: 12px 20px;
          background: rgba(10, 11, 13, 0.4);
          backdrop-filter: blur(4px);
          transition: background 0.3s, color 0.3s;
        }
        .jh-skip:hover {
          background: var(--signal);
          color: var(--concrete-900);
        }

        @media (max-width: 820px) {
          .jh { height: 220vh; }
          .jh-eyebrow { top: 74px; }
          .jh-jersey { width: min(40vh, 260px); }
          .jh-skip { right: 22px; bottom: 26px; }
        }
      `}</style>
    </section>
  );
}
