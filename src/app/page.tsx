"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { BackgroundEcosystem } from "@/components/canvas/BackgroundEcosystem";
import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { FreshnessEngine } from "@/components/sections/FreshnessEngine";
import { Features } from "@/components/sections/Features";
import { Architecture } from "@/components/sections/Architecture";
import { Download } from "@/components/sections/Download";
import { Footer } from "@/components/sections/Footer";
import { Loader } from "@/components/Loader";

export default function Home() {
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <Loader 
            isCanvasReady={canvasLoaded} 
            onComplete={() => setLoading(false)} 
          />
        )}
      </AnimatePresence>

      {/* Render Canvas immediately so it initializes and renders behind the loader */}
      <BackgroundEcosystem onLoaded={() => setCanvasLoaded(true)} />

      {!loading && (
        <SmoothScroll>
          <Header />
          
          <main id="main-content" className="relative z-10 w-full">
            <Hero />
            <Philosophy />
            <FreshnessEngine />
            <Features />
            <Architecture />
            <Download />
            <Footer />
          </main>
        </SmoothScroll>
      )}
    </>
  );
}

