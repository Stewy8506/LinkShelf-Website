"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import { DecayingLink } from "../DecayingLink";

export function FreshnessEngine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  // Calculate dynamic freshness values showing decay as we scroll
  const card1Freshness = Math.max(0.70, 0.98 - progress * 0.28);
  const card2Freshness = Math.max(0.35, 0.85 - progress * 0.50);
  const card3Freshness = Math.max(0.02, 0.60 - progress * 0.58);

  return (
    <section ref={containerRef} className="relative py-32 px-6 md:px-12 max-w-6xl mx-auto z-10 min-h-[300vh]">
      <div className="sticky top-[20vh]">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-semibold tracking-tight"
          >
            The Freshness Engine
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-foreground/60 text-lg max-w-2xl mx-auto font-light"
          >
            Scroll to see how links physically rot over time. Exponential decay ensures your reading list never becomes an overwhelming graveyard.
          </motion.p>
        </div>

        <div className="flex flex-col items-center justify-center relative w-full max-w-3xl mx-auto h-[400px]">
          {/* Animated lines connecting the links (visual flair) */}
          <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-fresh-high/20 via-fresh-mid/20 to-fresh-low/20 -translate-x-1/2" />
          
          <motion.div className="w-full relative z-10 bg-surface p-8 rounded-[16px] border-[0.5px] border-border shadow-2xl">
            <h3 className="text-xs font-mono mb-6 text-text-tertiary uppercase tracking-widest text-center">Simulation</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DecayingLink title="Why Next.js App Router is the future" url="vercel.com/blog/app-router" freshness={card1Freshness} className="mx-0" />
                <DecayingLink title="Rethinking Reactivity in UI" url="engineering.ui/reactivity" freshness={card2Freshness} delay={0.2} className="mx-0" />
                <DecayingLink title="The end of traditional REST APIs" url="backend.dev/rest-is-dead" freshness={card3Freshness} delay={0.4} className="mx-0" />
              </div>

              <div className="mt-12 text-center border-t border-border pt-8">
                <p className="text-lg font-light text-text-primary">
                  <span className="text-fresh-low font-medium">Stale links resurface.</span> The older they get, the more they demand your attention—until they eventually drop off the shelf.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
