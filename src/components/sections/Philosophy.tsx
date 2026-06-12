"use client";

import { motion } from "framer-motion";

export function Philosophy() {
  return (
    <section className="relative py-32 px-6 md:px-12 max-w-5xl mx-auto z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">
            Most read-later apps become infinite graveyards.
          </h2>
          <p className="text-foreground/60 text-lg leading-relaxed mb-6 font-light">
            {"You save a link. You tell yourself you'll read it this weekend. The weekend passes. The link gets buried under 50 other \"must-reads\"."}
          </p>
          <p className="text-foreground/60 text-lg leading-relaxed font-light">
            {"Without friction or consequence, your reading list is just another source of digital backlog anxiety."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="border border-foreground/10 p-8 md:p-12 rounded-3xl bg-background/50 backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-fresh-high/5 to-transparent pointer-events-none" />
          <h3 className="text-xl md:text-2xl font-medium mb-4 text-fresh-high">The Friction Engine</h3>
          <p className="text-foreground/70 leading-relaxed font-light mb-8">
            {"LinkShelf introduces psychological friction through exponential decay. Fresh links feel alive and actionable. Ignored links visually rot and resurface, demanding a decision: read it, or let it die."}
          </p>
          <ul className="space-y-4">
            {["Time pressure", "Visual staleness", "Behavioral friction", "Dynamic prioritization"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium opacity-80">
                <div className="w-1.5 h-1.5 rounded-full bg-fresh-mid" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
