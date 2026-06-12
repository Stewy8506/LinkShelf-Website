"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { DecayingLink } from "../DecayingLink";

export function FreshnessEngine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // As we scroll down through this section, the freshness decays from 1 to 0
  const freshness = useTransform(scrollYProgress, [0.3, 0.7], [1, 0]);

  return (
    <section ref={containerRef} className="relative py-32 px-6 md:px-12 max-w-6xl mx-auto z-10 min-h-[150vh]">
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
          <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-fresh-high via-fresh-mid to-fresh-low opacity-20 -translate-x-1/2" />
          
          <motion.div className="w-full relative z-10 bg-background/80 p-8 rounded-3xl border border-foreground/10 backdrop-blur-xl shadow-2xl">
            <h3 className="text-sm font-mono mb-6 opacity-50 uppercase tracking-widest text-center">Simulation</h3>
            <div className="space-y-4">
              <motion.div style={{ opacity: useTransform(freshness, v => Math.max(0.2, v)) }}>
                {/* We pass a continuous motion value into a component that expects a number. 
                    Since Framer Motion allows animating react state, we'll wrap DecayingLink in a motion component 
                    that extracts the freshness value, but here we just use the raw value via an intermediate component 
                    if we need reactivity, or we can just render 3 static links that represent the timeline. */}
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="flex flex-col gap-2">
                   <span className="text-xs font-mono text-fresh-high">Day 1</span>
                   <DecayingLink title="Why Next.js App Router is the future" url="vercel.com/blog/app-router" freshness={0.95} />
                 </div>
                 <div className="flex flex-col gap-2">
                   <span className="text-xs font-mono text-fresh-mid">Day 7</span>
                   <DecayingLink title="Rethinking Reactivity in UI" url="engineering.ui/reactivity" freshness={0.50} delay={0.2} />
                 </div>
                 <div className="flex flex-col gap-2">
                   <span className="text-xs font-mono text-fresh-low">Day 30</span>
                   <DecayingLink title="The end of traditional REST APIs" url="backend.dev/rest-is-dead" freshness={0.15} delay={0.4} />
                 </div>
              </div>

              <div className="mt-12 text-center border-t border-foreground/10 pt-8">
                <p className="text-lg font-light text-foreground/80">
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
