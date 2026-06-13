"use client";

import { motion } from "framer-motion";

export function Philosophy() {
  return (
    <section id="philosophy" className="relative py-12 md:py-32 px-4 xs:px-6 md:px-12 max-w-5xl mx-auto z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-2xl xs:text-3xl md:text-5xl font-semibold tracking-tight mb-4 md:mb-6 text-text-primary">
            Most read-later apps become infinite graveyards.
          </h2>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6 font-light">
            {"You save a link. You tell yourself you'll read it this weekend. The weekend passes. The link gets buried under 50 other \"must-reads\"."}
          </p>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed font-light">
            {"Without friction or consequence, your reading list is just another source of digital backlog anxiety."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="border-[0.5px] border-border p-5 md:p-10 rounded-[16px] bg-card relative overflow-hidden shadow-xl"
        >
          <h3 className="text-xl md:text-2xl font-semibold mb-4 text-fresh-high">The Friction Engine</h3>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed font-light mb-8">
            {"LinkShelf introduces psychological friction through exponential decay. Fresh links feel alive and actionable. Ignored links visually rot and resurface, demanding a decision: read it, or let it die."}
          </p>
          <ul className="space-y-4">
            {[
              { label: "Time pressure", color: "bg-fresh-low" },
              { label: "Visual staleness", color: "bg-fresh-mid" },
              { label: "Behavioral friction", color: "bg-accent-muted" },
              { label: "Dynamic prioritization", color: "bg-fresh-high" }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-text-secondary">
                <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                {item.label}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

