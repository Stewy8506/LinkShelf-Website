"use client";

import { motion } from "framer-motion";

export function Architecture() {
  return (
    <section className="relative py-20 md:py-32 px-6 md:px-12 max-w-5xl mx-auto z-10 border-t border-border">
      <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full md:w-1/2"
        >
          {/* Abstract Architecture Visual */}
          <div className="aspect-square rounded-[16px] bg-surface flex items-center justify-center border-[0.5px] border-border overflow-hidden relative shadow-inner">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-border) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }} />
            <div className="w-32 h-32 bg-card border-[0.5px] border-border rounded-[12px] flex items-center justify-center relative z-10 shadow-2xl">
              <div className="w-16 h-16 rounded-full border border-fresh-high/50 flex items-center justify-center relative">
                <div className="w-2 h-2 bg-fresh-high rounded-full absolute top-0 -mt-1 animate-ping" />
              </div>
            </div>
            
            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 50 50 L 10 20" stroke="var(--color-border)" strokeWidth="0.5" fill="none" />
              <path d="M 50 50 L 90 20" stroke="var(--color-border)" strokeWidth="0.5" fill="none" />
              <path d="M 50 50 L 10 80" stroke="var(--color-border)" strokeWidth="0.5" fill="none" />
              <path d="M 50 50 L 90 80" stroke="var(--color-border)" strokeWidth="0.5" fill="none" />
              
              {/* Dynamic Flow lines overlay */}
              <path d="M 50 50 L 10 20" stroke="var(--color-fresh-high)" strokeWidth="0.8" fill="none" strokeDasharray="4, 12" className="animate-flow-svg-reverse" />
              <path d="M 50 50 L 90 20" stroke="var(--color-fresh-high)" strokeWidth="0.8" fill="none" strokeDasharray="4, 12" className="animate-flow-svg" />
              <path d="M 50 50 L 10 80" stroke="var(--color-fresh-high)" strokeWidth="0.8" fill="none" strokeDasharray="4, 12" className="animate-flow-svg-reverse" />
              <path d="M 50 50 L 90 80" stroke="var(--color-fresh-high)" strokeWidth="0.8" fill="none" strokeDasharray="4, 12" className="animate-flow-svg" />
            </svg>
            <style>{`
              @keyframes svg-flow {
                to {
                  stroke-dashoffset: -16;
                }
              }
              @keyframes svg-flow-reverse {
                to {
                  stroke-dashoffset: 16;
                }
              }
              .animate-flow-svg {
                animation: svg-flow 3s linear infinite;
              }
              .animate-flow-svg-reverse {
                animation: svg-flow-reverse 3s linear infinite;
              }
            `}</style>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-text-primary">
            Carefully engineered software.
          </h2>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed font-light mb-8">
            LinkShelf is built with a sophisticated sync engine leveraging Firebase Cloud Firestore for real-time state resolution, ensuring your freshness scores are consistent across all your devices down to the millisecond.
          </p>
          <div className="space-y-6">
            <div className="pb-6 border-b border-border">
              <h4 className="font-mono text-xs uppercase tracking-widest text-text-tertiary mb-2">Architecture</h4>
              <p className="text-sm text-text-secondary">Native client performance backed by a globally distributed serverless database.</p>
            </div>
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-text-tertiary mb-2">Security</h4>
              <p className="text-sm text-text-secondary">End-to-end robust security rules protecting your private reading backlog.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

