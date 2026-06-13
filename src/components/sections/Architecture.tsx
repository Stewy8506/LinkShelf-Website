"use client";
 
import { motion } from "framer-motion";
import { Laptop, Smartphone, Globe, Database, Cpu, Shield } from "lucide-react";
 
export function Architecture() {
  return (
    <section id="architecture" className="relative py-12 md:py-32 px-4 xs:px-6 md:px-12 max-w-5xl mx-auto z-10 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center">
        {/* Left Column: Static Visual Diagram Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="border-[0.5px] border-border p-6 md:p-10 rounded-[16px] bg-card relative overflow-hidden shadow-xl aspect-auto py-10 sm:py-0 sm:aspect-square flex items-center justify-center"
        >
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-border) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
 
          <div className="flex items-center justify-between w-full relative z-10 scale-[0.75] xs:scale-[0.85] sm:scale-100 origin-center">
            {/* Client Platform Nodes Stack */}
            <div className="flex flex-col gap-4 z-10">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-surface border border-border rounded-xl font-mono text-[10px] text-text-secondary select-none">
                <Laptop className="w-3.5 h-3.5 text-text-tertiary" />
                MACOS DESKTOP
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-surface border border-border rounded-xl font-mono text-[10px] text-text-secondary select-none">
                <Smartphone className="w-3.5 h-3.5 text-text-tertiary" />
                IOS / ANDROID
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-surface border border-border rounded-xl font-mono text-[10px] text-text-secondary select-none">
                <Globe className="w-3.5 h-3.5 text-text-tertiary" />
                CHROME EXT
              </div>
            </div>
 
            {/* Static SVG Connector Lines */}
            <svg className="w-16 h-32 text-border pointer-events-none z-0" viewBox="0 0 60 120" fill="none">
              {/* Top Node Connector */}
              <path d="M 0 22 H 30 V 60 H 60" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
              {/* Middle Node Connector */}
              <path d="M 0 60 H 60" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
              {/* Bottom Node Connector */}
              <path d="M 0 98 H 30 V 60" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
              {/* Junction Node */}
              <circle cx="30" cy="60" r="2.5" className="fill-text-tertiary/20 stroke-border" />
            </svg>
 
            {/* Cloud Firestore Sync Hub Node */}
            <div className="flex flex-col items-center gap-2.5 p-4.5 bg-surface border border-fresh-high/20 rounded-2xl shadow-[0_0_30px_rgba(134,239,172,0.04)] max-w-[130px] text-center z-10 select-none">
              <Database className="w-6 h-6 text-fresh-high" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-primary">Firestore</span>
              <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-wider">Sync Hub</span>
            </div>
          </div>
        </motion.div>
 
        {/* Right Column: Information & Text Details Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="border-[0.5px] border-border p-6 md:p-10 rounded-[16px] bg-card relative overflow-hidden shadow-xl w-full"
        >
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-border) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
 
          <h2 className="text-2xl xs:text-3xl md:text-5xl font-semibold tracking-tight mb-4 md:mb-6 text-text-primary relative z-10">
            Carefully engineered software.
          </h2>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed font-light mb-8 relative z-10">
            LinkShelf is built with a sophisticated sync engine leveraging Firebase Cloud Firestore for real-time state resolution, ensuring your freshness scores are consistent across all your devices down to the millisecond.
          </p>
          
          {/* Spec grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4 md:pt-6 border-t border-border relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-fresh-high" />
                <h4 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">Architecture</h4>
              </div>
              <p className="text-sm text-text-secondary leading-normal pt-1 font-light">
                Native client performance backed by a globally distributed serverless database.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-fresh-high" />
                <h4 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">Security</h4>
              </div>
              <p className="text-sm text-text-secondary leading-normal pt-1 font-light">
                End-to-end robust security rules protecting your private reading backlog.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

