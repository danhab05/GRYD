"use client";

/**
 * Hero redline26 — but au scroll (thème clair / fond blanc).
 * ---------------------------------------------------------
 * La pièce (photo produit) est posée au centre : elle flotte et s'incline vers le
 * curseur. En SCROLLANT, un vrai ballon de foot part du bas, tourne et se loge dans
 * les filets en haut → flash rouge, filet qui gonfle, "BUT." qui claque, confetti.
 * Le tir se rejoue en scrollant de nouveau. Son de but opt-in.
 *
 * prefers-reduced-motion : hero statique, sans ballon ni flash.
 */

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Howl } from "howler";
import { PRODUCT_PHOTO } from "@/lib/assets";

const CONFETTI_COLORS = ["#E1161D", "#12324A", "#9A7B34", "#0B0B0D"];

/** Ballon de foot classique (Telstar) en SVG, avec relief. */
function Ball() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
      <defs>
        <radialGradient id="ball-sphere" cx="36%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="62%" stopColor="#ededea" />
          <stop offset="100%" stopColor="#bdbcb6" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#ball-sphere)" stroke="#0b0b0d" strokeWidth="1.4" />
      {/* coutures vers les pentagones du bord */}
      <g stroke="#0b0b0d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9">
        <line x1="50" y1="34" x2="50" y2="6" />
        <line x1="65.2" y1="45.1" x2="92" y2="37" />
        <line x1="59.4" y1="62.9" x2="74" y2="86" />
        <line x1="40.6" y1="62.9" x2="26" y2="86" />
        <line x1="34.8" y1="45.1" x2="8" y2="37" />
      </g>
      {/* pentagone central */}
      <polygon points="50,34 65.2,45.1 59.4,62.9 40.6,62.9 34.8,45.1" fill="#0b0b0d" />
      {/* pentagones de bord (simplifiés) */}
      <g fill="#0b0b0d">
        <circle cx="50" cy="7" r="5" />
        <circle cx="92" cy="36" r="5" />
        <circle cx="75" cy="87" r="5" />
        <circle cx="25" cy="87" r="5" />
        <circle cx="8" cy="36" r="5" />
      </g>
    </svg>
  );
}

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
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<Howl | null>(null);
  const soundOnRef = useRef(false);
  const firedRef = useRef(false);
  const [soundOn, setSoundOn] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.35 });

  // Trajectoire du ballon : du bas-gauche vers les filets (haut-centre).
  const ballX = useTransform(p, [0, 0.82], ["-30vw", "0vw"]);
  const ballY = useTransform(p, [0, 0.4, 0.82], ["38vh", "18vh", "-32vh"]);
  const ballScale = useTransform(p, [0, 0.82], [0.5, 1.1]);
  const ballRotate = useTransform(p, [0, 0.82], [0, 1200]);
  const ballOpacity = useTransform(p, [0, 0.05, 0.82, 0.9], [0, 1, 1, 0]);

  // But
  const flashOpacity = useTransform(p, [0.72, 0.82, 0.94], [0, 0.85, 0]);
  const netScale = useTransform(p, [0.78, 0.83, 0.92], [1, 1.05, 1]);
  const butOpacity = useTransform(p, [0.78, 0.86, 1], [0, 1, 0]);
  const butScale = useTransform(p, [0.78, 0.88], [0.6, 1.15]);
  const prodY = useTransform(p, [0, 1], ["0vh", "-4vh"]);

  // Parallaxe souris sur la pièce
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rng = reduce ? 0 : 11;
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-rng, rng]), { stiffness: 120, damping: 16 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [rng * 0.8, -rng * 0.8]), { stiffness: 120, damping: 16 });

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  const goalBurst = useCallback(() => {
    confetti({
      particleCount: 110,
      spread: 92,
      startVelocity: 46,
      gravity: 0.9,
      ticks: 200,
      origin: { x: 0.5, y: 0.22 },
      colors: CONFETTI_COLORS,
      scalar: 1,
      disableForReducedMotion: true,
    });
    if (soundOnRef.current && soundRef.current) {
      soundRef.current.stop();
      soundRef.current.play();
    }
  }, []);

  // Déclenche le confetti quand le ballon entre (et se réarme quand on remonte).
  useMotionValueEvent(p, "change", (v) => {
    if (reduce) return;
    if (v > 0.8 && !firedRef.current) {
      firedRef.current = true;
      goalBurst();
    }
    if (v < 0.68) firedRef.current = false;
  });

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
    <section className={reduce ? "jh jh-static" : "jh"} ref={sectionRef}>
      <div className="jh-sticky" ref={stageRef} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="jh-glow" aria-hidden />
        <div className="jh-eyebrow">Paris · Édition sur le bitume</div>

        {/* But */}
        {!reduce && (
          <motion.div className="jh-goal" style={{ scale: netScale }} aria-hidden>
            <div className="jh-goal-frame">
              <div className="jh-goal-net" />
            </div>
          </motion.div>
        )}

        <div className="jh-content">
          <span className="jh-line">
            <motion.h1 className="jh-title display" {...reveal(0.15)}>Porte</motion.h1>
          </span>

          <motion.div className="jh-tilt" style={{ rotateX, rotateY, y: reduce ? 0 : prodY }}>
            <motion.div
              className="jh-float"
              animate={reduce ? {} : { y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
            >
              <motion.button
                type="button"
                className="jh-card"
                onClick={goalBurst}
                aria-label="Rejouer la célébration"
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
                  sizes="(max-width:820px) 74vw, 42vh"
                  style={{ objectFit: "cover" }}
                />
              </motion.button>
            </motion.div>
          </motion.div>

          <span className="jh-line">
            <motion.h1 className="jh-title display signal" {...reveal(0.28)}>La ville</motion.h1>
          </span>
        </div>

        {/* Ballon (scroll-driven) */}
        {!reduce && (
          <div className="jh-ball-layer" aria-hidden>
            <motion.div
              className="jh-ball"
              style={{ x: ballX, y: ballY, scale: ballScale, rotate: ballRotate, opacity: ballOpacity }}
            >
              <Ball />
            </motion.div>
          </div>
        )}

        {/* Flash + BUT */}
        {!reduce && (
          <>
            <motion.div className="jh-flash" style={{ opacity: flashOpacity }} aria-hidden />
            <div className="jh-center" aria-hidden>
              <motion.div className="jh-but display" style={{ opacity: butOpacity, scale: butScale }}>
                But.
              </motion.div>
            </div>
          </>
        )}

        <div className="jh-foot">
          <Link href="#drop" className="jh-cta">Voir le drop →</Link>
          <button type="button" className="jh-sound" onClick={toggleSound} aria-pressed={soundOn}>
            {soundOn ? "♪ Son activé" : "♪ Activer le son"}
          </button>
          {!reduce && (
            <div className="jh-cue">
              <span>Scrolle pour marquer</span>
              <i />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .jh {
          position: relative;
          z-index: 2;
          height: 200vh;
        }
        .jh-static {
          height: 100vh;
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
          padding: 0 24px;
        }
        .jh-glow {
          position: absolute;
          top: 48%;
          left: 50%;
          width: 96vh;
          height: 96vh;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(245, 245, 243, 0.9), rgba(255, 255, 255, 0) 62%),
            radial-gradient(circle at 50% 80%, rgba(225, 22, 29, 0.06), transparent 55%);
          pointer-events: none;
          z-index: 0;
        }
        .jh-eyebrow {
          position: absolute;
          top: 92px;
          font-size: 12px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--signal);
          z-index: 4;
        }

        .jh-goal {
          position: absolute;
          top: 11vh;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          transform-origin: 50% 0;
        }
        .jh-goal-frame {
          width: min(46vw, 360px);
          height: 150px;
          border: 3px solid rgba(11, 11, 13, 0.5);
          border-bottom: none;
          border-radius: 4px 4px 0 0;
          position: relative;
        }
        .jh-goal-net {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(11, 11, 13, 0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11, 11, 13, 0.14) 1px, transparent 1px);
          background-size: 15px 15px;
          mask-image: linear-gradient(180deg, #000 55%, transparent);
        }

        .jh-content {
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
          font-size: clamp(48px, 12.5vw, 168px);
          line-height: 0.78;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: var(--ink);
          pointer-events: none;
        }
        .jh-title.signal {
          color: var(--signal);
        }
        .jh-tilt {
          margin: 1vh 0;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .jh-card {
          position: relative;
          display: block;
          width: min(42vh, 380px);
          aspect-ratio: 1 / 1;
          border: 1px solid rgba(11, 11, 13, 0.06);
          padding: 0;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          background: #fff;
          box-shadow: 0 40px 80px rgba(11, 11, 13, 0.16), 0 10px 30px rgba(11, 11, 13, 0.08);
        }
        .jh-card :global(img) {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .jh-card:hover :global(img) {
          transform: scale(1.05);
        }

        .jh-ball-layer {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .jh-ball {
          width: clamp(46px, 7vw, 78px);
          height: clamp(46px, 7vw, 78px);
          filter: drop-shadow(0 10px 16px rgba(11, 11, 13, 0.28));
        }

        .jh-flash {
          position: absolute;
          inset: 0;
          z-index: 4;
          background: radial-gradient(circle at 50% 20%, rgba(225, 22, 29, 0.42), transparent 46%);
          pointer-events: none;
        }
        .jh-center {
          position: absolute;
          inset: 0;
          z-index: 6;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .jh-but {
          font-size: clamp(96px, 25vw, 360px);
          line-height: 0.8;
          color: var(--signal);
          letter-spacing: -0.05em;
          text-transform: uppercase;
          text-shadow: 0 20px 60px rgba(225, 22, 29, 0.28);
        }

        .jh-foot {
          position: absolute;
          bottom: 30px;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          z-index: 7;
          flex-wrap: wrap;
          padding: 0 20px;
        }
        .jh-cta {
          font-size: 13px;
          letter-spacing: 0.02em;
          font-weight: 800;
          border-radius: 999px;
          padding: 13px 24px;
          background: var(--ink);
          color: #fff;
          transition: background 0.25s, transform 0.25s;
        }
        .jh-cta:hover {
          background: var(--signal);
          transform: translateY(-2px);
        }
        .jh-sound {
          font-size: 13px;
          font-weight: 700;
          border-radius: 999px;
          padding: 13px 20px;
          background: transparent;
          border: 1px solid var(--line);
          color: var(--ink);
          transition: border-color 0.25s, color 0.25s;
        }
        .jh-sound:hover {
          border-color: var(--signal);
          color: var(--signal);
        }
        .jh-cue {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .jh-cue i {
          width: 30px;
          height: 1px;
          background: linear-gradient(90deg, var(--ink), transparent);
          animation: jhCue 1.8s ease-in-out infinite;
        }
        @keyframes jhCue {
          0%, 100% { transform: scaleX(0.4); opacity: 0.3; }
          50% { transform: scaleX(1); opacity: 1; }
        }

        @media (max-width: 820px) {
          .jh-eyebrow { top: 76px; }
          .jh-card { width: min(72vw, 300px); }
          .jh-goal-frame { width: 74vw; height: 120px; }
        }
      `}</style>
    </section>
  );
}
