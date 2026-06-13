"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera, SoftShadows } from "@react-three/drei";
import { EffectComposer, Bloom, N8AO } from "@react-three/postprocessing";
import { useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { StylizedBookshelves } from "./StylizedBookshelves";
import { FloatingEntities } from "./FloatingEntities";

// Cinematic Realistic Camera Timeline
const KEYFRAMES = [
  {
    scroll: 0.0,
    camPos: [3.5, -0.8, -20.0] as [number, number, number], // Zoomed in on a shelf filled with books
    camLookAt: [3.5, -0.8, -23.0] as [number, number, number],
    ambientIntensity: 0.45, // Enhanced for better baseline visibility
    keyIntensity: 2.5,
    keyColor: "#FFEAD4", // Warm shelf lighting
    fillColor: "#9BB3D4", // Soft cool background fill
    fillIntensity: 0.7,
  },
  {
    scroll: 0.25, // Zoomed out, revealing the aisle and central window
    camPos: [0, -0.8, -7.5] as [number, number, number],
    camLookAt: [0, -0.8, -23.0] as [number, number, number],
    ambientIntensity: 0.4,
    keyIntensity: 2.0,
    keyColor: "#A6C2F5", // Moonlit window key light
    fillColor: "#FFEAD4", // Warm interior shelf reflections
    fillIntensity: 0.8,
  },
  {
    scroll: 0.45, // Freshness Engine: Books tumbling down the aisle
    camPos: [0, -0.8, -7.5] as [number, number, number],
    camLookAt: [0, -0.8, -23.0] as [number, number, number],
    ambientIntensity: 0.35,
    keyIntensity: 1.6,
    keyColor: "#9BB8F0", // Dimmer moonlight representing rot
    fillColor: "#FFD0A1", // Fading warmth
    fillIntensity: 0.5,
  },
  {
    scroll: 0.65, // Engineered for focus: Majestic high-angle view down the aisle
    camPos: [4.5, 3.2, 7.5] as [number, number, number], // Stays safely inside the side shelves
    camLookAt: [0, -4.0, -10.0] as [number, number, number], // Framed towards the reading table below
    ambientIntensity: 0.45,
    keyIntensity: 2.5,
    keyColor: "#A6C2F5", // Strong moonlit beams
    fillColor: "#FFEAD4", // Cozy warm interior glow from the reading lamp
    fillIntensity: 1.0,
  },
  {
    scroll: 0.85, // Sweeping down towards the table
    camPos: [0, -2.2, 4.0] as [number, number, number],
    camLookAt: [0, -3.3, 0.2] as [number, number, number],
    ambientIntensity: 0.4,
    keyIntensity: 1.5,
    keyColor: "#9BB8F0",
    fillColor: "#FFEAD4",
    fillIntensity: 0.8,
  },
  {
    scroll: 1.0, // Close up on the glowing open book on the table
    camPos: [0, -2.7, 1.8] as [number, number, number],
    camLookAt: [0, -3.38, 0.2] as [number, number, number],
    ambientIntensity: 0.3,
    keyIntensity: 0.6,
    keyColor: "#E4F8DB", // Picks up the warm green glow from the book/lamp
    fillColor: "#1B2230",
    fillIntensity: 0.2,
  }
];

function interpolateKeyframes(scroll: number) {
  let s = Math.max(0, Math.min(1, scroll));
  if (isNaN(s)) {
    s = 0;
  }
  
  let i = 0;
  for (; i < KEYFRAMES.length - 1; i++) {
    if (s >= KEYFRAMES[i].scroll && s <= KEYFRAMES[i + 1].scroll) {
      break;
    }
  }
  
  // Ensure we don't index out of bounds if the loop somehow doesn't break
  if (i >= KEYFRAMES.length - 1) {
    i = KEYFRAMES.length - 2;
  }
  
  const start = KEYFRAMES[i];
  const end = KEYFRAMES[i + 1];
  
  const segmentRange = end.scroll - start.scroll;
  const factor = segmentRange === 0 ? 0 : (s - start.scroll) / segmentRange;
  
  // Ease in-out factor for cinematic smooth transitions
  const smoothFactor = factor < 0.5 ? 2 * factor * factor : 1 - Math.pow(-2 * factor + 2, 2) / 2;
  
  const lerp = (a: number, b: number) => a + (b - a) * smoothFactor;
  const lerpVec3 = (a: [number, number, number], b: [number, number, number]): [number, number, number] => [
    lerp(a[0], b[0]),
    lerp(a[1], b[1]),
    lerp(a[2], b[2]),
  ];
  
  const k1 = new THREE.Color(start.keyColor);
  const k2 = new THREE.Color(end.keyColor);
  const interpolatedKeyColor = k1.clone().lerp(k2, smoothFactor);

  const f1 = new THREE.Color(start.fillColor);
  const f2 = new THREE.Color(end.fillColor);
  const interpolatedFillColor = f1.clone().lerp(f2, smoothFactor);

  return {
    camPos: lerpVec3(start.camPos, end.camPos),
    camLookAt: lerpVec3(start.camLookAt, end.camLookAt),
    ambientIntensity: lerp(start.ambientIntensity, end.ambientIntensity),
    keyIntensity: lerp(start.keyIntensity, end.keyIntensity),
    keyColor: interpolatedKeyColor,
    fillColor: interpolatedFillColor,
    fillIntensity: lerp(start.fillIntensity, end.fillIntensity),
  };
}

function EcosystemScene({ 
  onLoaded, 
  isLoaded,
  isMobile = false
}: { 
  onLoaded?: () => void; 
  isLoaded: boolean; 
  isMobile?: boolean;
}) {
  const { scrollYProgress } = useScroll();
  const groupRef = useRef<THREE.Group>(null!);

  const ambientLightRef = useRef<THREE.AmbientLight>(null!);
  const keyLightRef = useRef<THREE.DirectionalLight>(null!);
  const fillLightRef = useRef<THREE.DirectionalLight>(null!);

  const currentCamPos = useRef(new THREE.Vector3(3.5, -0.8, -20.0));
  const currentCamLookAt = useRef(new THREE.Vector3(3.5, -0.8, -23.0));

  const hasRendered = useRef(false);

  useFrame((state) => {
    // Notify loader on first frame render
    if (!hasRendered.current) {
      hasRendered.current = true;
      if (onLoaded) {
        setTimeout(() => {
          onLoaded();
        }, 50);
      }
    }

    // Lock camera target to scroll = 0 during loading to prevent scroll restoration jumps
    const scroll = isLoaded ? scrollYProgress.get() : 0;
    
    // Interpolate keyframe values
    const target = interpolateKeyframes(scroll);

    // Smoothly interpolate camera base position and lookAt target
    currentCamPos.current.lerp(new THREE.Vector3(...target.camPos), 0.05);
    currentCamLookAt.current.lerp(new THREE.Vector3(...target.camLookAt), 0.05);

    // Subtle mouse parallax
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    
    const parallaxX = mouseX * 0.5;
    const parallaxY = mouseY * 0.5;

    state.camera.position.x = currentCamPos.current.x + parallaxX;
    state.camera.position.y = currentCamPos.current.y + parallaxY;
    state.camera.position.z = currentCamPos.current.z;

    // Apply camera roll based on horizontal mouse movement
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, mouseX * -0.02, 0.05);

    // Execute lookAt
    state.camera.lookAt(currentCamLookAt.current);

    // Sync light intensities
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, target.ambientIntensity, 0.08);
    }
    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.lerp(keyLightRef.current.intensity, target.keyIntensity, 0.08);
      keyLightRef.current.color.lerp(target.keyColor, 0.08);
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity = THREE.MathUtils.lerp(fillLightRef.current.intensity, target.fillIntensity, 0.08);
      fillLightRef.current.color.lerp(target.fillColor, 0.08);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={isMobile ? 68 : 50} position={[3.5, -0.8, -20.0]} />
      <SoftShadows size={15} samples={16} focus={0.5} />
      
      {/* Fog to obscure the back wall and add atmospheric depth */}
      <fog attach="fog" args={["#020306", 15, 50]} />
      
      {/* Ambient Light */}
      <ambientLight ref={ambientLightRef} intensity={0.4} />
      
      {/* Main Moon Light casting shadows through the back window */}
      <directionalLight 
        ref={keyLightRef}
        position={[1, 10, -24.5]} 
        intensity={2.0} 
        color="#A6C2F5"
        castShadow
        shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
      />
      
      {/* Warm Fill Light representing indoor ambient reflection */}
      <directionalLight 
        ref={fillLightRef}
        position={[-12, 6, 8]} 
        intensity={0.8} 
        color="#FFEAD4" 
      />

      {/* Realistic environment reflections */}
      <Environment preset="apartment" />

      <group ref={groupRef}>
        <StylizedBookshelves scrollYProgress={scrollYProgress} isMobile={isMobile} />
        {/* We can remove FloatingEntities for this realistic scene or keep it as subtle dust. Let's keep it as dust. */}
        <FloatingEntities scrollYProgress={scrollYProgress} />
      </group>

      {/* Post Processing for ultimate realism */}
      {(() => {
        const EffectComposerComponent = EffectComposer as React.ComponentType<{
          children?: React.ReactNode;
          disableNormalPass?: boolean;
        }>;
        const N8AOComponent = N8AO as React.ComponentType<{
          aoRadius?: number;
          intensity?: number;
          color?: string;
        }>;
        const BloomComponent = Bloom as React.ComponentType<{
          luminanceThreshold?: number;
          luminanceSmoothing?: number;
          mipmapBlur?: boolean;
          intensity?: number;
        }>;
        return (
          <EffectComposerComponent disableNormalPass>
            {/* N8AO for extremely realistic contact shadows in the shelves - bypassed on mobile for rendering speed */}
            {!isMobile && <N8AOComponent aoRadius={1.5} intensity={2.5} color="black" />}
            <BloomComponent 
              luminanceThreshold={1.2} // Only bloom things with emissive intensity > 1.2 (the open book & lamp glow)
              luminanceSmoothing={0.5}
              mipmapBlur 
              intensity={0.85} 
            />
          </EffectComposerComponent>
        );
      })()}
    </>
  );
}

export function BackgroundEcosystem({ 
  onLoaded, 
  isLoaded = false 
}: { 
  onLoaded?: () => void; 
  isLoaded?: boolean; 
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas 
        shadows
        gl={{ antialias: !isMobile, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }} 
        dpr={isMobile ? 1.0 : [1, 1.5]}
      >
        <color attach="background" args={["#020306"]} />
        <EcosystemScene onLoaded={onLoaded} isLoaded={isLoaded} isMobile={isMobile} />
      </Canvas>
      {/* Cinematic vignette for text readability */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(2,3,6,0)_20%,rgba(2,3,6,0.3)_60%,rgba(2,3,6,0.8)_100%)]" 
      />
    </div>
  );
}
