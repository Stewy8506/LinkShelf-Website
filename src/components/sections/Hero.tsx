"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { DecayingLink } from "../DecayingLink";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 md:px-12 overflow-hidden">
      <div className="max-w-5xl w-full z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-3 px-4 py-1.5 rounded-full border border-foreground/10 bg-background/50 backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-fresh-high animate-pulse" />
          <span className="text-sm font-medium tracking-wide opacity-80 uppercase">LinkShelf 1.0</span>
        </motion.div>

        <motion.h1
          style={{ y: y1, opacity }}
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter leading-[0.9] text-foreground mix-blend-difference"
        >
          Your reading list, <br />
          <span className="text-foreground/50 italic font-light tracking-tight">decaying in real time.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 text-lg md:text-xl text-foreground/60 max-w-2xl font-light tracking-wide mix-blend-difference"
        >
          A highly opinionated cross-platform read-later application where saved links lose their freshness, pressure your attention, and eventually rot.
        </motion.p>
      </div>

      {/* Floating Interactive Links Simulation */}
      <div className="absolute inset-0 z-0 pointer-events-none perspective-1000">
        <div className="absolute top-[20%] left-[5%] md:left-[15%] rotate-[-6deg] opacity-80 scale-75 md:scale-100">
          <DecayingLink title="How to build an atmospheric website" url="design.engineering/atmospheric" freshness={0.92} delay={1.2} className="w-[300px]" />
        </div>
        <div className="absolute top-[60%] right-[5%] md:right-[15%] rotate-[4deg] opacity-60 scale-75 md:scale-100">
          <DecayingLink title="The Psychology of Information Overload" url="behavior.io/info-overload" freshness={0.45} delay={1.5} className="w-[320px]" />
        </div>
        <div className="absolute top-[80%] left-[10%] md:left-[25%] rotate-[-2deg] opacity-40 scale-75 md:scale-100">
          <DecayingLink title="React 19 compiler internals" url="react.dev/compiler" freshness={0.12} delay={1.8} className="w-[280px]" />
        </div>
      </div>
    </section>
  );
}
