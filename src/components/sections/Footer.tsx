"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-16 md:py-24 px-6 md:px-12 z-10 bg-background border-t border-foreground/10 mt-20 md:mt-32">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-16">
        <div className="max-w-sm">
          <h2 className="text-2xl font-medium tracking-tight mb-4 flex items-center gap-2">
            LinkShelf
            <div className="w-2 h-2 rounded-full bg-fresh-high" />
          </h2>
          <p className="text-foreground/50 text-sm font-light leading-relaxed mb-8">
            Your reading list, decaying in real time. Take control of your digital backlog by letting it rot.
          </p>
          <a href="https://github.com/Stewy8506/LinkShelf/releases/latest/download/linkshelf-macos.zip">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-foreground text-background rounded-full font-medium text-sm hover:bg-foreground/90 transition-colors cursor-pointer"
            >
              Download for macOS
            </motion.button>
          </a>
          <div className="flex gap-4 mt-4 text-xs font-mono opacity-50">
            <span>Also available for iOS, Android</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:gap-24">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-6">Product</h4>
            <ul className="space-y-4">
              {[
                { name: "Downloads", href: "#download" },
                { name: "Changelog", href: "https://github.com/Stewy8506/LinkShelf/releases" },
                { name: "Features", href: "#features" },
                { name: "Pricing", href: "#" }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1 group">
                    {item.name}
                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-6">Company</h4>
            <ul className="space-y-4">
              {["About", "Twitter", "Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight size={14} className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

