"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "backdrop-blur-md bg-background/80 border-b border-border/40" 
          : "mix-blend-difference"
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-5 max-w-7xl mx-auto w-full relative">
        <div className="flex items-center gap-2 select-none">
          <span className="font-semibold text-lg tracking-tight text-text-primary">LinkShelf</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fresh-high opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fresh-high"></span>
          </span>
        </div>

        {/* Internal Navigation Links - Hidden on very small screens */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 font-mono text-xs text-text-secondary">
          <a href="#philosophy" className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary rounded px-2 py-1">Concept</a>
          <a href="#features" className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary rounded px-2 py-1">Features</a>
          <a href="#architecture" className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary rounded px-2 py-1">Specs</a>
        </nav>

        <div>
          <a href="#download" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary rounded-full inline-block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-1.5 bg-text-primary text-background rounded-full font-semibold text-xs hover:bg-text-primary/95 transition-colors cursor-pointer"
            >
              Download
            </motion.button>
          </a>
        </div>
      </div>
    </header>
  );
}
