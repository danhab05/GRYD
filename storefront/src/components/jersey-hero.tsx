"use client";

/**
 * Hero redline26.
 * ---------------
 * La photo produit est posée au centre comme une pièce de vitrine : elle apparaît
 * en fondu-zoom rapide, flotte doucement et s'incline vers le curseur (parallaxe 3D
 * façon Apple). Peu après l'arrivée — et à chaque clic sur la pièce — un but est
 * marqué : flash, confetti, ballon qui part au fond, mot "BUT." qui claque. Son de
 * célébration opt-in.
 *
 * Tout est en transform/opacity, piloté par le temps (aucune dépendance au scroll).
 * prefers-reduced-motion : entrée en fondu simple, pas de flottement/tilt/flash.
 */

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Howl } from "howler";
import { PRODUCT_PHOTO } from "@/lib/assets";

const CONFETTI_COLORS = ["#E1161D", "#F4E9D3", "#B9964B", "#0B5D7C"];

/** Corne de stade + rumeur, générée en WAV (aucun asset externe). */
function goalSoundDataUri() {
  const sampleRate = 22050;
  const seconds = 1.1;
  const samples = Math.floor(sampleRate * seconds);
  const dataSize = samples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const write = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) view.setUint8(offset + i, text.charCodeAt(i));
  };
  write(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, dataSize, true);
  for (let i = 0; i < samples; i += 1) {
    const t = i / sampleRate;
    const envelope = Math.min(1, t * 7) * Math.max(0, 1 - t / seconds);
    const horn = Math.sin(2 * Math.PI * (176 + 28 * Math.sin(t * 8)) * t);
    const crowd = Math.sin(2 * Math.PI * 62 * t) * Math.sin(2 * Math.PI * 9 * t);
    const value = (horn * 0.52 + crowd * 0.22) * envelope;
    view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, value)) * 0x7fff, true);
  }
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return `data:audio/wav;base64,${window.btoa(binary)}`;
}

export function JerseyHero() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<Howl | null>(null);
  const soundOnRef = useRef(false);
  const [soundOn, setSoundOn] = useState(false);

  const flash = useAnimationControls();
  const but = useAnimationControls();
  const ball = useAnimationControls();

  // Parallaxe : la pièce s'incline vers le curseur.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const range = reduce ? 0 : 12;
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-range, range]), { stiffness: 120, damping: 16 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [range * 0.8, -range * 0.8]), { stiffness: 120, damping: 16 });

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  const celebrate = useCallback(() => {
    if (reduce) return;

    confetti({
      particleCount: 96,
      spread: 78,
      startVelocity: 42,
      gravity: 0.9,
      ticks: 170,
      origin: { x: 0.5, y: 0.46 },
      colors: CONFETTI_COLORS,
      scalar: 0.95,
      disableForReducedMotion: true,
    });

    flash.start({
      opacity: [0, 0.9, 0],
      transition: { duration: 0.55, times: [0, 0.22, 1], ease: "easeOut" },
    });
    but.start({
      opacity: [0, 1, 1, 0],
      scale: [0.6, 1.06, 1, 1.28],
      y: [24, 0, 0, -14],
      transition: { duration: 1, times: [0, 0.18, 0.66, 1], ease: "easeOut" },
    });
    ball.start({
      opacity: [0, 1, 1, 0],
      x: ["0vw", "18vw", "40vw"],
      y: ["0vh", "-26vh", "-54vh"],
      scale: [0.3, 1, 0.5],
      rotate: [0, 560, 960],
      transition: { duration: 0.9, times: [0, 0.55, 1], ease: "easeOut" },
    });

    if (soundOnRef.current && soundRef.current) {
      soundRef.current.stop();
      soundRef.current.play();
    }
  }, [reduce, flash, but, ball]);

  // Un but peu après l'arrivée.
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(celebrate, 1150);
    return () => window.clearTimeout(t);
  }, [reduce, celebrate]);

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const toggleSound = () => {
    if (!soundRef.current) {
      soundRef.current = new Howl({ src: [goalSoundDataUri()], volume: 0.42, preload: true });
    }
    setSoundOn((v) => !v);
  };

  const reveal = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay } }
      : {
          initial: { y: "115%" },
          animate: { y: 0 },
          transition: { delay, duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="jh" ref={stageRef} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="jh-glow" aria-hidden />
      <div className="jh-eyebrow">Paris · Édition sur le bitume</div>

      <div className="jh-stage">
        <span className="jh-line">
          <motion.h1 className="jh-title display" {...reveal(0.15)}>Porte</motion.h1>
        </span>

        <motion.div className="jh-tilt" style={{ rotateX, rotateY }}>
          <motion.div
            className="jh-float"
            animate={reduce ? {} : { y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
          >
            <motion.button
              type="button"
              className="jh-card"
              onClick={celebrate}
              aria-label="Marquer un but"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 44 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              <Image
                src={PRODUCT_PHOTO}
                alt="Maillot redline26"
                fill
                priority
                sizes="(max-width:820px) 78vw, 46vh"
                style={{ objectFit: "cover" }}
              />
              <span className="jh-card-sheen" aria-hidden />
            </motion.button>
          </motion.div>
        </motion.div>

        <span className="jh-line">
          <motion.h1 className="jh-title display signal" {...reveal(0.28)}>La ville</motion.h1>
        </span>
      </div>

      {/* Célébration */}
      <motion.div className="jh-flash" initial={{ opacity: 0 }} animate={flash} aria-hidden />
      <div className="jh-center" aria-hidden>
        <motion.div className="jh-ball" initial={{ opacity: 0 }} animate={ball}>
          <span />
        </motion.div>
        <motion.div className="jh-but display" initial={{ opacity: 0 }} animate={but}>
          But.
        </motion.div>
      </div>

      <div className="jh-foot">
        <Link href="#drop" className="jh-cta">Voir le drop →</Link>
        <button type="button" className="jh-sound" onClick={toggleSound} aria-pressed={soundOn}>
          {soundOn ? "♪ Son activé" : "♪ Activer le son"}
        </button>
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
        .jh-glow {
          position: absolute;
          top: 44%;
          left: 50%;
          width: 90vh;
          height: 90vh;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(225, 22, 29, 0.22), transparent 60%);
          pointer-events: none;
          z-index: 0;
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
          perspective: 1300px;
        }
        .jh-line {
          display: block;
          overflow: hidden;
        }
        .jh-title {
          display: block;
          font-size: clamp(46px, 12vw, 160px);
          line-height: 0.8;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          transform: scaleY(1.12);
          pointer-events: none;
          color: var(--chalk);
        }
        .jh-title.signal {
          color: var(--signal);
        }

        .jh-tilt {
          margin: -1.5vh 0;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .jh-float {
          will-change: transform;
        }
        .jh-card {
          position: relative;
          display: block;
          width: min(46vh, 400px);
          aspect-ratio: 1 / 1;
          border: 0;
          padding: 0;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          background: #f4e9d3;
          box-shadow: 0 40px 90px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(244, 233, 211, 0.12),
            0 24px 70px rgba(225, 22, 29, 0.18);
        }
        .jh-card :global(img) {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .jh-card:hover :global(img) {
          transform: scale(1.05);
        }
        .jh-card-sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255, 255, 255, 0.18), transparent 42%),
            linear-gradient(0deg, rgba(7, 10, 18, 0.22), transparent 40%);
          pointer-events: none;
        }

        .jh-flash {
          position: absolute;
          inset: 0;
          z-index: 4;
          background: radial-gradient(circle at 50% 46%, rgba(225, 22, 29, 0.55), rgba(185, 150, 75, 0.22) 35%, transparent 62%);
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .jh-center {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .jh-ball {
          position: absolute;
          width: 46px;
          height: 46px;
        }
        .jh-ball span {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #fff, #d9cdb2 60%, #b9964b);
          box-shadow: 0 0 24px rgba(244, 233, 211, 0.5), inset -6px -6px 12px rgba(0, 0, 0, 0.35);
        }
        .jh-but {
          position: absolute;
          font-size: clamp(90px, 24vw, 340px);
          line-height: 0.8;
          color: var(--signal);
          letter-spacing: -0.04em;
          text-transform: uppercase;
          transform: scaleY(1.1);
          text-shadow: 0 0 70px rgba(225, 22, 29, 0.55);
        }

        .jh-foot {
          position: absolute;
          bottom: 34px;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          z-index: 4;
          flex-wrap: wrap;
          padding: 0 20px;
        }
        .jh-cta,
        .jh-sound {
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          border: 1px solid var(--line);
          padding: 12px 20px;
          background: rgba(7, 10, 18, 0.5);
          backdrop-filter: blur(4px);
          color: var(--chalk);
          transition: background 0.3s, color 0.3s, transform 0.3s;
        }
        .jh-cta:hover {
          background: var(--signal);
          color: var(--chalk);
          transform: translateY(-2px);
        }
        .jh-sound:hover {
          border-color: var(--gold);
          color: var(--gold);
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
          .jh-eyebrow { top: 78px; }
          .jh-card { width: min(72vw, 320px); }
          .jh-foot { gap: 12px; bottom: 22px; }
        }
      `}</style>
    </section>
  );
}
