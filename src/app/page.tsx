import { SmoothScroll } from "@/components/SmoothScroll";
import { AtmosphereCanvas } from "@/components/AtmosphereCanvas";
import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { FreshnessEngine } from "@/components/sections/FreshnessEngine";
import { Features } from "@/components/sections/Features";
import { Architecture } from "@/components/sections/Architecture";
import { Download } from "@/components/sections/Download";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <AtmosphereCanvas />
      <Header />
      
      <main className="relative z-10 w-full">
        <Hero />
        <Philosophy />
        <FreshnessEngine />
        <Features />
        <Architecture />
        <Download />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

