"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export function Loader({ isCanvasReady, onComplete }: { isCanvasReady: boolean; onComplete: () => void }) {
  // Derive completion state directly from prop to avoid redundant state sync and cascading renders
  const isComplete = isCanvasReady;

  useEffect(() => {
    if (isCanvasReady) {
      // Wait for the 100% CSS transition to complete before triggering fade-out
      const timer = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isCanvasReady, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#020306] flex items-center justify-center select-none"
    >
      <style>{`
        @keyframes loader-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes text-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.95; }
        }
        .loader-bar-fill {
          width: ${isComplete ? "100%" : "90%"};
          transition: width ${isComplete ? "0.7s" : "4.5s"} cubic-bezier(0.1, 0.8, 0.2, 1);
        }
      `}</style>

      <div className="flex flex-col items-center gap-6">
        {/* Sleek Logo and Pulsing Status */}
        <div className="flex flex-col items-center gap-2.5">
          <span className="font-semibold text-lg tracking-[0.08em] text-[#F4F1EA]">LinkShelf</span>
          <span
            className="font-mono text-[8.5px] tracking-[0.3em] text-fresh-high uppercase"
            style={{ animation: "text-pulse 1.8s infinite ease-in-out" }}
          >
            {isComplete ? "readying environment" : "retrieving shelves"}
          </span>
        </div>

        {/* Minimalist Progress Line */}
        <div className="w-48 h-[1px] bg-white/5 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-fresh-high via-[#F4F1EA] to-fresh-high loader-bar-fill relative"
            style={{ transformOrigin: "left" }}
          >
            {/* Shimmer reflection passing through the bar */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                width: "100%",
                animation: "loader-shimmer 1.6s infinite linear",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
