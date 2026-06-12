"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface DecayingLinkProps {
  title: string;
  url: string;
  freshness: number; // 0.0 to 1.0
  className?: string;
  delay?: number;
}

export function DecayingLink({ title, url, freshness, className, delay = 0 }: DecayingLinkProps) {
  // Extract domain, age, and read time matching Flutter app's metadata style
  const { domain, age, readTime } = useMemo(() => {
    let domain = url;
    try {
      // Basic split for urls like vercel.com/blog/app-router
      domain = url.split("/")[0];
    } catch {
      // Fallback
    }

    // Deterministic hash to generate realistic, consistent mock metadata
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    const readTime = (hash % 8) + 2; // 2 to 9 min read
    let age = "2h ago";

    if (freshness > 0.8) {
      const mins = (hash % 45) + 5; // 5 to 49 mins ago
      age = `${mins}m ago`;
    } else if (freshness > 0.6) {
      const hours = (hash % 5) + 1; // 1 to 5 hours ago
      age = `${hours}h ago`;
    } else if (freshness > 0.4) {
      const hours = (hash % 12) + 6; // 6 to 17 hours ago
      age = `${hours}h ago`;
    } else if (freshness > 0.25) {
      const days = (hash % 2) + 1; // 1 to 2 days ago
      age = `${days}d ago`;
    } else {
      const days = (hash % 4) + 3; // 3 to 6 days ago
      age = `${days}d ago`;
    }

    return { domain, age, readTime };
  }, [title, url, freshness]);

  // Determine freshness-based color classes
  const accentColor = useMemo(() => {
    if (freshness > 0.66) return "bg-fresh-high";
    if (freshness > 0.33) return "bg-fresh-mid";
    return "bg-fresh-low";
  }, [freshness]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ 
        y: -6, 
        scale: 1.02,
        rotate: 0.5,
        borderColor: "rgba(136, 136, 134, 0.45)",
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)"
      }}
      whileFocus={{ 
        y: -6, 
        scale: 1.02,
        rotate: 0.5,
        borderColor: "rgba(136, 136, 134, 0.45)",
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)"
      }}
      role="button"
      tabIndex={0}
      className={cn(
        "relative py-[16px] pr-[16px] pl-[19.5px] my-[5px] mx-[16px] rounded-[12px] border-[0.5px] border-border bg-card flex flex-col justify-center overflow-hidden transition-colors duration-300 group cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary",
        className
      )}
    >
      {/* Left Freshness Indicator Strip */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-[3.5px]", accentColor)} />

      {/* Main Content */}
      <div className="flex flex-col gap-[4px] text-left">
        <h4 className="text-[14px] font-medium leading-[1.4] tracking-[-0.1px] text-text-primary group-hover:text-white transition-colors duration-300">
          {title}
        </h4>
        <span className="text-[12px] leading-normal text-text-secondary font-sans">
          {domain} &middot; {age} &middot; {readTime} min read
        </span>
      </div>

      {/* Bottom Decay Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-border/30">
        <div
          style={{ width: `${Math.max(0, Math.min(100, freshness * 100))}%` }}
          className={cn("h-full transition-all duration-300 ease-out", accentColor)}
        />
      </div>
    </motion.div>
  );
}
