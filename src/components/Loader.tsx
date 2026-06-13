"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Loader({ isCanvasReady, onComplete }: { isCanvasReady: boolean; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Hold at 95% until the 3D Canvas has loaded its first frame
        if (prev >= 95 && !isCanvasReady) {
          return 95;
        }
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Swift, smooth steps
        const step = Math.floor(Math.random() * 12) + 6;
        return Math.min(100, prev + step);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isCanvasReady]);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  // Minimalist decay indicator color
  const textColor =
    progress < 40
      ? "text-fresh-high"
      : progress < 80
      ? "text-fresh-mid"
      : "text-fresh-low";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#0C0C0C] flex items-center justify-center select-none"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Sleek logo name with running percentage counter */}
        <div className="flex items-baseline gap-3">
          <span className="font-semibold text-lg tracking-tight text-[#EDEDEC]">LinkShelf</span>
          <span className={`font-mono text-xs tracking-wider transition-colors duration-300 w-10 text-right ${textColor}`}>
            {progress.toString().padStart(2, "0")}%
          </span>
        </div>

        {/* Minimalist single pixel progress line */}
        <div className="w-24 h-[1px] bg-border/20 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-[#EDEDEC] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
