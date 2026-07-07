"use client";

import { motion } from "framer-motion";

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: 0,
    transition: { delay: 0.35 + i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function HeroReveal() {
  return (
    <h1 className="hero-title display">
      <span className="hero-line">
        <motion.span custom={0} variants={line} initial="hidden" animate="show">
          Porte
        </motion.span>
      </span>
      <span className="hero-line">
        <motion.span custom={1} variants={line} initial="hidden" animate="show" className="signal">
          la ville
        </motion.span>
      </span>

      <style>{`
        .hero-title{font-size:clamp(64px,16vw,240px);line-height:.82;letter-spacing:-.02em;text-transform:uppercase;transform:scaleY(1.12);transform-origin:bottom left}
        .hero-line{display:block;overflow:hidden}
        .hero-line span{display:block}
        .hero-title .signal{color:var(--signal)}
      `}</style>
    </h1>
  );
}
