"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { useScroll, MotionValue } from "framer-motion";

const particleCount = 3000;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(Math.random() * 2 - 1);
  // radius clustered slightly more towards center but spread out
  const r = 20 * Math.cbrt(Math.random());
  
  particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  particlePositions[i * 3 + 2] = r * Math.cos(phi);
}

function ParticleCloud({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const ref = useRef<THREE.Points>(null!);

  useFrame((state, delta) => {
    // Subtle rotation of the entire cloud
    ref.current.rotation.y -= delta * 0.05;
    ref.current.rotation.x -= delta * 0.02;

    // Based on scroll progress, adjust the particle cloud's position and color
    const scrollY = scrollYProgress.get();
    
    // As we scroll down, particles slowly drift up (we move down)
    ref.current.position.y = scrollY * 10;
  });

  return (
    <Points ref={ref} positions={particlePositions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FBBF24" // Mid freshness color base
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

export function AtmosphereCanvas() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-background">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={["#0a0a0a", 10, 25]} />
        <ParticleCloud scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
