"use client";

import { motion } from "framer-motion";
import { Smartphone, Layers, LineChart, Globe } from "lucide-react";

const features = [
  {
    icon: <Smartphone size={24} />,
    title: "Cross-Platform Sync",
    description: "Your shelf is everywhere. Instant, real-time sync across macOS, iOS, Android, and Web.",
  },
  {
    icon: <Layers size={24} />,
    title: "Smart Lists",
    description: "Automatically categorize content by reading time, topic, or freshness level.",
  },
  {
    icon: <LineChart size={24} />,
    title: "Reading Analytics",
    description: "Insight into your consumption habits. See exactly where your attention goes.",
  },
  {
    icon: <Globe size={24} />,
    title: "Extension Workflow",
    description: "Capture links instantly from any browser with a single shortcut.",
  },
];

export function Features() {
  return (
    <section className="relative py-32 px-6 md:px-12 max-w-6xl mx-auto z-10 bg-background">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight">Engineered for focus.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            className="p-8 rounded-3xl bg-background border border-foreground/5 hover:border-foreground/20 transition-colors group"
          >
            <div className="mb-6 inline-flex p-3 rounded-2xl bg-foreground/5 text-foreground group-hover:scale-110 group-hover:bg-fresh-high/10 group-hover:text-fresh-high transition-all">
              {feature.icon}
            </div>
            <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
            <p className="text-foreground/60 font-light leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
