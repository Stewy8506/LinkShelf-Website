"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { DecayingLink } from "../DecayingLink";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-5xl w-full z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex items-center gap-2 px-3 py-1 rounded-full border-[0.5px] border-border bg-surface shadow-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fresh-high opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fresh-high"></span>
          </span>
          <span className="text-[10px] font-mono tracking-[0.12em] text-text-secondary uppercase">
            LinkShelf <span className="text-text-primary font-medium">v1.0.0</span>
          </span>
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
          className="mt-12 text-lg md:text-xl text-text-secondary max-w-2xl font-light tracking-wide mix-blend-difference"
        >
          A highly opinionated cross-platform read-later application where saved links lose their freshness, pressure your attention, and eventually rot.
        </motion.p>

        {/* Primary Download CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3.5 bg-text-primary text-background rounded-full font-semibold text-sm hover:bg-text-primary/95 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            Download for macOS
            <span className="text-[10px] opacity-60 font-mono">v1.0.0</span>
          </motion.button>
          
          <a
            href="#features"
            className="px-6 py-3.5 border-[0.5px] border-border hover:border-text-secondary/40 text-text-secondary hover:text-text-primary bg-card/30 rounded-full font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            Explore features
          </a>
        </motion.div>
        
        {/* Supported Platforms Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-6 flex items-center gap-6 text-[10px] font-mono uppercase tracking-wider text-text-tertiary z-20"
        >
          <span>iOS App Store</span>
          <span>&middot;</span>
          <span>Android APK</span>
          <span>&middot;</span>
          <span>Chrome Web Store</span>
        </motion.div>
      </div>

      {/* Floating Interactive Links Simulation */}
      <div className="absolute inset-0 z-0 pointer-events-none perspective-1000 hidden md:block">
        <div className="absolute top-[18%] left-[2%] xl:left-[6%] md:left-[4%] rotate-[-8deg] opacity-80">
          <DecayingLink title="How to build an atmospheric website" url="design.engineering/atmospheric" freshness={0.92} delay={0.4} className="w-[280px] lg:w-[300px]" />
        </div>
        <div className="absolute top-[48%] right-[2%] xl:right-[6%] md:right-[4%] rotate-[6deg] opacity-70">
          <DecayingLink title="The Psychology of Information Overload" url="behavior.io/info-overload" freshness={0.45} delay={0.6} className="w-[300px] lg:w-[320px]" />
        </div>
        <div className="absolute top-[75%] left-[3%] xl:left-[8%] md:left-[5%] rotate-[-4deg] opacity-50">
          <DecayingLink title="React 19 compiler internals" url="react.dev/compiler" freshness={0.12} delay={0.8} className="w-[260px] lg:w-[280px]" />
        </div>
      </div>
    </section>
  );
}
