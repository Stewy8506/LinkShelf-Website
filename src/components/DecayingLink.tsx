"use client";

import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
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
  // Determine color based on freshness matching the app logic
  const colorClass = useMemo(() => {
    if (freshness > 0.66) return "text-fresh-high border-fresh-high/30 bg-fresh-high/5";
    if (freshness > 0.33) return "text-fresh-mid border-fresh-mid/30 bg-fresh-mid/5";
    return "text-fresh-low border-fresh-low/30 bg-fresh-low/5";
  }, [freshness]);

  const barColor = useMemo(() => {
    if (freshness > 0.66) return "bg-fresh-high";
    if (freshness > 0.33) return "bg-fresh-mid";
    return "bg-fresh-low";
  }, [freshness]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative p-4 rounded-xl border flex flex-col gap-3 backdrop-blur-md transition-all duration-700 group hover:-translate-y-1",
        colorClass,
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 opacity-70">
            <Link2 size={18} />
          </div>
          <div>
            <h4 className="font-medium tracking-tight text-foreground group-hover:text-white transition-colors">{title}</h4>
            <p className="text-sm opacity-60 truncate max-w-[200px] md:max-w-[300px]">{url}</p>
          </div>
        </div>
        <div className={cn("text-xs font-mono px-2 py-1 rounded-md border", colorClass.replace("text-", "border-").replace("bg-", "bg-opacity-50 "))}>
          {Math.round(freshness * 100)}
        </div>
      </div>

      {/* Freshness Bar */}
      <div className="h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden mt-2 relative">
        <motion.div
          initial={{ width: "100%" }}
          whileInView={{ width: `${freshness * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
          className={cn("absolute inset-y-0 left-0 rounded-full", barColor)}
        />
      </div>
    </motion.div>
  );
}
