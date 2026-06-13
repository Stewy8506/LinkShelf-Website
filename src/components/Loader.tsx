"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface Mote {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
}

const getPoeticStatus = (prog: number) => {
  if (prog < 25) return "sweeping the dust...";
  if (prog < 50) return "unlocking the vaults...";
  if (prog < 75) return "unrolling the scrolls...";
  if (prog < 95) return "kindling the lamp...";
  return "the library is open.";
};

// Web Audio API acoustic chime synthesizer
const playSuccessSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Master volume envelope with long ring release
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
    masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

    // Resonant low-pass filter representing brass shell chime bell resonance
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.setValueAtTime(3.0, ctx.currentTime); // resonant bell ring
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.08);
    filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 1.8);

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // E4 Major arpeggiated chime frequencies (E4, G#4, B4, E5)
    const freqs = [329.63, 415.30, 493.88, 659.25];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine"; // Pure, organic tone
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime); // micro-detune for acoustic richness

      const oscGain = ctx.createGain();
      const maxVol = 0.12 / (idx + 1);
      oscGain.gain.setValueAtTime(maxVol, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      osc.connect(oscGain);
      oscGain.connect(filter);

      // Stagger notes to sound like a rolling wind-chime arpeggio
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + 2.8);
    });
  } catch (err) {
    console.warn("Acoustic chime deferred:", err);
  }
};

// Deterministic pseudo-random generation of dust motes to prevent hydration mismatch and useEffect warnings
const generateDeterministicMotes = (): Mote[] => {
  const generated: Mote[] = [];
  for (let i = 0; i < 16; i++) {
    const seed1 = Math.sin(i * 12.9898) * 43758.5453;
    const rand1 = seed1 - Math.floor(seed1);
    const seed2 = Math.sin(i * 78.233) * 43758.5453;
    const rand2 = seed2 - Math.floor(seed2);
    const seed3 = Math.sin(i * 99.123) * 43758.5453;
    const rand3 = seed3 - Math.floor(seed3);

    generated.push({
      id: i,
      left: `${(15 + rand1 * 70).toFixed(4)}%`,
      size: `${(1.2 + rand2 * 2.2).toFixed(4)}px`,
      duration: `${(8 + rand3 * 8).toFixed(4)}s`,
      delay: `${(rand1 * -12).toFixed(4)}s`,
    });
  }
  return generated;
};

export function Loader({ isCanvasReady, onComplete }: { isCanvasReady: boolean; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [motes] = useState<Mote[]>(generateDeterministicMotes);

  // Smooth, frame-rate independent progression loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      setProgress((prev) => {
        if (prev >= 100) return 100;

        if (isCanvasReady) {
          // Rapidly zip to 100% when canvas is resolved
          const next = prev + 0.08 * delta;
          return Math.min(100, next);
        } else {
          // Slow down asymptotically toward 90%
          const remaining = 90 - prev;
          const speed = Math.max(0.001, remaining * 0.0018);
          const next = prev + speed * delta;
          return Math.min(89.9, next);
        }
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCanvasReady]);

  // Complete and trigger audio chime on 100%
  useEffect(() => {
    if (progress >= 100) {
      playSuccessSound();
      const timer = setTimeout(() => {
        onComplete();
      }, 850); // slight breathing room to appreciate complete state
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  // Map progress to color atmosphere representing the library 3D environment
  const currentAtmosphere = useMemo(() => {
    if (progress < 30) {
      return {
        glowHex: "#3A271A", // Dark walnut wood glow
        glowColor: "rgba(58, 39, 26, 0.12)",
        lightColor: "rgba(58, 39, 26, 0.08)",
      };
    } else if (progress < 70) {
      return {
        glowHex: "#FFEAD4", // Warm lamp gold glow
        glowColor: "rgba(255, 234, 212, 0.06)",
        lightColor: "rgba(255, 234, 212, 0.10)",
      };
    } else {
      return {
        glowHex: "#A6C2F5", // Moonlit window blue glow
        glowColor: "rgba(166, 194, 245, 0.08)",
        lightColor: "rgba(228, 248, 219, 0.12)", // Book glow
      };
    }
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#020306] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Editorial Font Integrations & Custom Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Lora:ital,wght@0,400;1,400&display=swap');

        .font-garamond {
          font-family: 'EB Garamond', serif;
        }
        .font-lora {
          font-family: 'Lora', serif;
        }

        /* Fluttering page turns */
        @keyframes left-page-flutter {
          0%, 100% { opacity: 0.15; transform: scaleX(1); }
          50% { opacity: 0.55; transform: scaleX(0.92); }
        }
        @keyframes right-page-flutter {
          0%, 100% { opacity: 0.6; transform: scaleX(0.95); }
          50% { opacity: 0.2; transform: scaleX(1.03); }
        }
        
        .page-left-anim {
          animation: left-page-flutter 4.5s infinite ease-in-out;
          transform-origin: 50px 0;
        }
        .page-right-anim {
          animation: right-page-flutter 3.8s infinite ease-in-out;
          transform-origin: 50px 0;
        }

        /* Library dust particle floating */
        @keyframes float-mote {
          0% { transform: translateY(110vh) translateX(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.35; }
          85% { opacity: 0.35; }
          100% { transform: translateY(-10vh) translateX(30px) scale(1.1); opacity: 0; }
        }
        .dust-mote {
          animation: float-mote var(--duration) linear infinite;
          animation-delay: var(--delay);
        }
      `}</style>

      {/* Cinematic Spotlight Beam (God Ray) */}
      <div
        className="absolute inset-x-0 top-0 h-full w-[260px] mx-auto pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: `linear-gradient(to bottom, ${currentAtmosphere.lightColor} 0%, rgba(166, 194, 245, 0.02) 60%, rgba(2, 3, 6, 0) 100%)`,
          maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
        }}
      />

      {/* Ambient background glow orb */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full filter blur-[130px] mix-blend-screen opacity-15 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          backgroundColor: currentAtmosphere.glowHex,
          boxShadow: `0 0 100px ${currentAtmosphere.glowHex}`,
        }}
      />

      {/* Floating Dust Motes (Acoustic Ambient Atmosphere) */}
      <div className="absolute inset-0 w-[260px] mx-auto pointer-events-none">
        {motes.map((m) => (
          <div
            key={m.id}
            className="dust-mote absolute w-1 h-1 rounded-full bg-[#FFEAD4]/60"
            style={{
              left: m.left,
              width: m.size,
              height: m.size,
              "--duration": m.duration,
              "--delay": m.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-7 z-10"
      >
        {/* Glowing Book Icon */}
        <div className="relative flex items-center justify-center p-3 rounded-full border border-white/5 bg-white/[0.01] backdrop-blur-md">
          {/* Subtle icon back shadow */}
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-30 transition-all duration-1000"
            style={{ backgroundColor: currentAtmosphere.glowHex }}
          />

          <svg
            width="80"
            height="56"
            viewBox="0 0 100 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#EDEDEC] relative z-10 transition-all duration-1000"
            style={{ filter: `drop-shadow(0 0 8px ${currentAtmosphere.glowHex}44)` }}
          >
            {/* Book base cover outline */}
            <path
              d="M50 56 C38 56, 22 51, 12 53 L12 17 C22 15, 38 20, 50 20 C62 20, 78 15, 88 17 L88 53 C78 51, 62 56, 50 56 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner static leaf */}
            <path
              d="M50 53 C41 53, 24 48, 14 50 L14 20 C24 18, 41 23, 50 23 C59 23, 76 18, 86 20 L86 50 C76 48, 59 53, 50 53 Z"
              stroke="currentColor"
              strokeWidth="0.8"
              opacity="0.4"
            />
            
            {/* Spine Center line */}
            <line x1="50" y1="20" x2="50" y2="56" stroke="currentColor" strokeWidth="1.2" opacity="0.8" />
            
            {/* Fluttering leaf paths */}
            <path
              className="page-left-anim"
              d="M50 23 C43 23, 30 20, 24 28 C18 36, 26 48, 50 53"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <path
              className="page-right-anim"
              d="M50 23 C57 23, 70 20, 76 28 C82 36, 74 48, 50 53"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </svg>
        </div>

        {/* Minimalist Spaced Brand & Status */}
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <span className="font-garamond italic font-normal text-2xl tracking-[0.16em] text-[#EDEDEC]">
            LinkShelf
          </span>
          <span className="font-lora italic text-[10px] tracking-[0.15em] text-[#888886] min-h-[16px] text-center transition-all duration-300">
            {getPoeticStatus(progress)}
          </span>
        </div>

        {/* Cinematic Linear Progress Tracker */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-40 h-[1px] bg-white/5 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-transparent via-[#EDEDEC]/30 to-transparent absolute inset-0 transition-transform duration-75"
              style={{
                width: "100%",
                transform: `translateX(${progress - 100}%)`,
              }}
            />
          </div>
          
          <span className="font-lora text-[13px] font-light tracking-[0.3em] text-[#888886]/80 pl-[0.3em] select-none">
            {Math.floor(progress).toString().padStart(3, "0")}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
