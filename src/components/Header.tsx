"use client";

import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto mix-blend-difference pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto select-none">
        <span className="font-semibold text-lg tracking-tight text-text-primary">LinkShelf</span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fresh-high opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fresh-high"></span>
        </span>
      </div>

      <div className="pointer-events-auto">
        <a href="#download">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-1.5 bg-text-primary text-background rounded-full font-semibold text-xs hover:bg-text-primary/95 transition-colors cursor-pointer"
          >
            Download
          </motion.button>
        </a>
      </div>
    </header>
  );
}
