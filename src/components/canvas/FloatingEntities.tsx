"use client";

import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

interface DustData {
  pos: [number, number, number];
  speed: number;
  scale: number;
  opacity: number;
}

const DUST_PARTICLES: DustData[] = (() => {
  const items: DustData[] = [];
  for (let i = 0; i < 200; i++) {
    items.push({
      pos: [
        (Math.random() - 0.5) * 30, // x
        (Math.random() - 0.5) * 20, // y
        -(Math.random() * 25) + 5,  // z (focus mostly around the table and shelves)
      ],
      speed: Math.random() * 0.05 + 0.01,
      scale: Math.random() * 0.015 + 0.005,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }
  return items;
})();

interface FloatingEntitiesProps {
  scrollYProgress: MotionValue<number>;
}

export function FloatingEntities({ scrollYProgress }: FloatingEntitiesProps) {
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    // Lazy, realistic dust drift
    meshesRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const data = DUST_PARTICLES[idx];
      
      mesh.position.y += Math.sin(state.clock.elapsedTime * data.speed + idx) * delta * 0.1;
      mesh.position.x += Math.cos(state.clock.elapsedTime * data.speed * 0.5 + idx) * delta * 0.05;
    });
  });

  return (
    <group>
      {DUST_PARTICLES.map((dust, idx) => (
        <mesh 
          key={idx} 
          ref={(el) => {
            meshesRef.current[idx] = el;
          }}
          position={dust.pos} 
          scale={dust.scale}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial 
            color="#FFDDAA" 
            transparent 
            opacity={dust.opacity} 
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
