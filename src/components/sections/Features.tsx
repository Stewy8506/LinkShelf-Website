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
      <div className="text-center mb-24">
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
            className="p-8 rounded-[12px] bg-card border-[0.5px] border-border hover:border-text-secondary/30 transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="mb-6 inline-flex p-3 rounded-[8px] bg-surface border-[0.5px] border-border text-text-secondary group-hover:text-text-primary group-hover:border-text-secondary/30 transition-all duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-medium mb-4 text-text-primary">{feature.title}</h3>
            <p className="text-text-secondary font-light leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
