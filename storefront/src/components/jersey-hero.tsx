"use client";

/**
 * Hero cinématique redline26 — Stack A.
 * GSAP ScrollTrigger pilote la rotation CSS 3D du maillot et déclenche la
 * célébration de but. Le son reste opt-in pour garder une UX propre.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Howl } from "howler";
import { Jersey } from "./jersey";

gsap.registerPlugin(ScrollTrigger);

function goalSoundDataUri() {
  const sampleRate = 22050;
  const seconds = 1.1;
  const samples = Math.floor(sampleRate * seconds);
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const dataSize = samples * bytesPerSample;
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
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
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
  const rootRef = useRef<HTMLElement>(null);
  const jerseyRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const butRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const topTitleRef = useRef<HTMLHeadingElement>(null);
  const bottomTitleRef = useRef<HTMLHeadingElement>(null);
  const soundRef = useRef<Howl | null>(null);
  const celebratedRef = useRef(false);
  const soundEnabledRef = useRef(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    if (reduce || !rootRef.current || !jerseyRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(jerseyRef.current, {
        rotateY: -12,
        rotateX: 4,
        rotateZ: -1.5,
        z: 0,
        scale: 0.96,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
      });
      gsap.set([flashRef.current, burstRef.current, butRef.current, ballRef.current], { autoAlpha: 0 });
      gsap.set(ballRef.current, { x: 0, y: 0, scale: 0.28, rotate: 0 });

      const celebrate = () => {
        confetti({
          particleCount: 92,
          spread: 72,
          startVelocity: 38,
          gravity: 0.92,
          ticks: 180,
          origin: { x: 0.5, y: 0.47 },
          colors: ["#E1161D", "#F4E4C8", "#0B5D7C", "#B9964B"],
          scalar: 0.95,
        });

        if (soundEnabledRef.current && soundRef.current) {
          soundRef.current.stop();
          soundRef.current.play();
        }
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=185%",
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress > 0.76 && !celebratedRef.current) {
              celebratedRef.current = true;
              celebrate();
            }
            if (self.progress < 0.58) celebratedRef.current = false;
          },
        },
      });

      tl.to(jerseyRef.current, { rotateY: 178, rotateX: -6, rotateZ: 2, z: 130, scale: 1.12, duration: 0.72 })
        .to(topTitleRef.current, { xPercent: -8, autoAlpha: 0.34, duration: 0.72 }, 0)
        .to(bottomTitleRef.current, { xPercent: 7, autoAlpha: 0.9, duration: 0.72 }, 0)
        .to(flashRef.current, { autoAlpha: 0.88, duration: 0.06 }, 0.72)
        .to(flashRef.current, { autoAlpha: 0, duration: 0.2 }, 0.8)
        .fromTo(burstRef.current, { scale: 0.35, autoAlpha: 0 }, { scale: 1.65, autoAlpha: 0.9, duration: 0.22 }, 0.72)
        .to(burstRef.current, { scale: 2.1, autoAlpha: 0, duration: 0.2 }, 0.9)
        .fromTo(butRef.current, { scale: 0.62, y: 28, autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: 0.16 }, 0.73)
        .fromTo(ballRef.current, { x: 0, y: 0, scale: 0.32, rotate: 0, autoAlpha: 0 }, { x: "34vw", y: "-36vh", scale: 1.1, rotate: 760, autoAlpha: 1, duration: 0.18, ease: "power4.out" }, 0.755)
        .to(ballRef.current, { x: "48vw", y: "-52vh", scale: 0.62, autoAlpha: 0, duration: 0.16, ease: "power2.in" }, 0.93)
        .to(butRef.current, { scale: 1.18, autoAlpha: 0, duration: 0.28 }, 0.95)
        .to(jerseyRef.current, { rotateY: 206, rotateX: -2, rotateZ: 0, z: 40, scale: 1, duration: 0.28 }, 0.95);
    }, rootRef);

    return () => ctx.revert();
  }, [reduce]);

  const reveal = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay } }
      : {
          initial: { y: "115%" },
          animate: { y: 0 },
          transition: { delay, duration: 1, ease: [0.16, 1, 0.3, 1] as const },
        };

  const toggleSound = () => {
    if (!soundRef.current) {
      soundRef.current = new Howl({ src: [goalSoundDataUri()], volume: 0.42, preload: true });
    }
    setSoundEnabled((enabled) => !enabled);
  };

  return (
    <section className="jh" ref={rootRef}>
      <div className="jh-eyebrow">Paris · Édition sur le bitume</div>

      <div className="jh-stage">
        <span className="jh-line">
          <motion.h1 ref={topTitleRef} className="jh-title display" {...reveal(0.2)}>Porte</motion.h1>
        </span>

        <div className="jh-jersey" aria-label="Maillot redline26 animé au scroll">
          <div className="jh-orbit" aria-hidden />
          <div className="jh-shadow" aria-hidden />
          <div className="jh-jersey-3d" ref={jerseyRef}>
            <div className="jh-face jh-front">
              <Jersey face="front" colorway="archive" />
            </div>
            <div className="jh-face jh-back">
              <Jersey face="back" colorway="archive" number="26" name="ARCHIVE" />
            </div>
          </div>
        </div>

        <span className="jh-line">
          <motion.h1 ref={bottomTitleRef} className="jh-title display signal" {...reveal(0.35)}>La ville</motion.h1>
        </span>
      </div>

      <div className="jh-celebrate" aria-hidden>
        <div className="jh-flash" ref={flashRef} />
        <div className="jh-center">
          <div className="jh-burst" ref={burstRef} />
          <div className="jh-but display" ref={butRef}>But.</div>
          <div className="jh-ball" ref={ballRef} aria-hidden>
            <span />
          </div>
        </div>
      </div>

      <div className="jh-foot">
        <Link href="/shop" className="jh-cta">Voir les maillots →</Link>
        <button type="button" className="jh-sound" onClick={toggleSound} aria-pressed={soundEnabled}>
          Son stade {soundEnabled ? "on" : "off"}
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
          isolation: isolate;
        }
        .jh::before {
          content: "";
          position: absolute;
          inset: 10% 12%;
          background:
            radial-gradient(circle at 50% 42%, rgba(11, 93, 124, 0.16), transparent 30%),
            linear-gradient(115deg, transparent 0 42%, rgba(242, 240, 235, 0.07) 42% 43%, transparent 43% 100%);
          filter: blur(0.2px);
          opacity: 0.9;
          pointer-events: none;
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
        .jh-line { display: block; overflow: hidden; }
        .jh-title {
          display: block;
          font-size: clamp(44px, 11vw, 150px);
          line-height: 0.82;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          transform: scaleY(1.12);
          transform-origin: center;
          pointer-events: none;
          will-change: transform, opacity;
        }
        .jh-title.signal { color: var(--signal); }

        .jh-jersey {
          position: relative;
          width: min(45vh, 350px);
          aspect-ratio: 320 / 380;
          margin: -2vh 0;
          perspective: 1400px;
          transform-style: preserve-3d;
        }
        .jh-orbit {
          position: absolute;
          inset: 7% -13%;
          border: 1px solid rgba(244, 228, 200, 0.28);
          border-radius: 50%;
          transform: rotateX(72deg) rotateZ(-8deg);
          opacity: 0.55;
        }
        .jh-shadow {
          position: absolute;
          left: 12%;
          right: 12%;
          bottom: -4%;
          height: 22%;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0, 0, 0, 0.72), transparent 68%);
          filter: blur(12px);
          transform: rotateX(72deg);
        }
        .jh-jersey-3d {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .jh-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          filter: drop-shadow(0 40px 60px rgba(0, 0, 0, 0.62));
        }
        .jh-front { transform: translateZ(1px); }
        .jh-back { transform: rotateY(180deg) translateZ(1px); }

        .jh-celebrate {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
        }
        .jh-flash {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(225, 22, 29, 0.58), transparent 56%);
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
          width: 58vh;
          height: 58vh;
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
          opacity: 0.52;
        }
        .jh-burst::after { inset: 38%; opacity: 0.34; }
        .jh-but {
          position: absolute;
          font-size: clamp(90px, 24vw, 340px);
          line-height: 0.8;
          color: var(--signal);
          letter-spacing: -0.04em;
          text-transform: uppercase;
          transform: scaleY(1.1);
          text-shadow: 0 0 60px rgba(228, 255, 58, 0.42);
          opacity: 0;
        }
        .jh-ball {
          position: absolute;
          width: clamp(28px, 5vw, 76px);
          height: clamp(28px, 5vw, 76px);
          border-radius: 50%;
          background: var(--chalk);
          border: 2px solid var(--concrete-900);
          box-shadow: 0 0 0 2px rgba(244, 233, 211, 0.2), 0 18px 45px rgba(0, 0, 0, 0.42);
          opacity: 0;
          overflow: hidden;
          will-change: transform, opacity;
        }
        .jh-ball::before,
        .jh-ball::after,
        .jh-ball span {
          content: "";
          position: absolute;
          background: var(--concrete-900);
        }
        .jh-ball::before {
          width: 34%;
          height: 34%;
          left: 33%;
          top: 33%;
          clip-path: polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%);
        }
        .jh-ball::after {
          width: 150%;
          height: 2px;
          left: -25%;
          top: 50%;
          transform: rotate(28deg);
          opacity: 0.82;
        }
        .jh-ball span {
          width: 150%;
          height: 2px;
          left: -25%;
          top: 50%;
          transform: rotate(-34deg);
          opacity: 0.82;
        }

        .jh-foot {
          position: absolute;
          bottom: 34px;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          z-index: 5;
        }
        .jh-cta,
        .jh-sound {
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          border: 1px solid var(--line);
          padding: 13px 18px;
          background: rgba(10, 11, 13, 0.42);
          color: var(--chalk);
          backdrop-filter: blur(4px);
          transition: background 0.3s, color 0.3s, transform 0.3s, border-color 0.3s;
        }
        .jh-cta:hover,
        .jh-sound:hover,
        .jh-sound[aria-pressed="true"] {
          background: var(--signal);
          color: var(--concrete-900);
          border-color: var(--signal);
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
          transform-origin: left;
          animation: jhCue 1.8s ease-in-out infinite;
        }
        @keyframes jhCue {
          0%, 100% { transform: scaleX(0.4); opacity: 0.3; }
          50% { transform: scaleX(1); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .jh-jersey-3d { transform: rotateY(-10deg) rotateX(3deg) !important; }
          .jh-cue { display: none; }
        }

        @media (max-width: 820px) {
          .jh-eyebrow { top: 76px; font-size: 10px; letter-spacing: 0.28em; }
          .jh-jersey { width: min(39vh, 260px); }
          .jh-foot { flex-direction: column; gap: 12px; bottom: 22px; }
          .jh-cta, .jh-sound { padding: 11px 15px; font-size: 11px; }
        }
      `}</style>
    </section>
  );
}
