import { SmoothScroll } from "@/components/SmoothScroll";
import { AtmosphereCanvas } from "@/components/AtmosphereCanvas";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { FreshnessEngine } from "@/components/sections/FreshnessEngine";
import { Features } from "@/components/sections/Features";
import { Architecture } from "@/components/sections/Architecture";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <AtmosphereCanvas />
      
      <main className="relative z-10 w-full overflow-hidden">
        <Hero />
        <Philosophy />
        <FreshnessEngine />
        <Features />
        <Architecture />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
