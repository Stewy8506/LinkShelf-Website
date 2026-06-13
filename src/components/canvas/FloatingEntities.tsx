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
        (Math.random() - 0.5) * 16 - 2, // y (centered around shelf & table)
        -(Math.random() * 30) + 5,  // z (spans back wall to foreground)
      ],
      speed: Math.random() * 0.05 + 0.015,
      scale: Math.random() * 0.014 + 0.006,
      opacity: Math.random() * 0.35 + 0.1,
    });
  }
  return items;
})();

// Geometry and vector pools for garbage-collection-free calculations inside useFrame
const tempPos = new THREE.Vector3();
const tempVec1 = new THREE.Vector3();
const tempVec2 = new THREE.Vector3();
const beamStart = new THREE.Vector3(0, 2.5, -23.4);
const beamEnd = new THREE.Vector3(0, -4.0, 0.0);
const beamVector = beamEnd.clone().sub(beamStart);
const beamLengthSq = beamVector.lengthSq();

// Distance from point to line segment representing the volumetric moonbeam
function getDistanceToBeam(pos: THREE.Vector3, t1: THREE.Vector3, t2: THREE.Vector3) {
  t1.copy(pos).sub(beamStart);
  const t = Math.max(0, Math.min(1, t1.dot(beamVector) / beamLengthSq));
  t2.copy(beamStart).addScaledVector(beamVector, t);
  return pos.distanceTo(t2);
}

interface FloatingEntitiesProps {
  scrollYProgress: MotionValue<number>;
}

export function FloatingEntities({ scrollYProgress: _scrollYProgress }: FloatingEntitiesProps) {
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    meshesRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const data = DUST_PARTICLES[idx];
      
      // Ambient drift motion
      mesh.position.y += Math.sin(state.clock.elapsedTime * data.speed + idx) * delta * 0.12;
      mesh.position.x += Math.cos(state.clock.elapsedTime * data.speed * 0.5 + idx) * delta * 0.06;

      // Wrap out-of-bounds particles to keep density stable
      if (mesh.position.y > 8) mesh.position.y = -6;
      if (mesh.position.y < -6) mesh.position.y = 8;
      if (mesh.position.x > 15) mesh.position.x = -15;
      if (mesh.position.x < -15) mesh.position.x = 15;
      
      tempPos.copy(mesh.position);
      const dist = getDistanceToBeam(tempPos, tempVec1, tempVec2);
      
      // Light beam cone radius grows from 2.0 at window (z = -23.4) to 4.8 at table (z = 0)
      const relativeZ = Math.max(0, Math.min(1, (mesh.position.z - (-23.4)) / 23.4));
      const beamRadius = 2.0 + relativeZ * 2.8;

      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (!mat) return;

      if (dist < beamRadius && mesh.position.z > -23.4 && mesh.position.z < 2.0) {
        // Glistening effect inside the moonbeam ray
        const glintFactor = (1.0 - dist / beamRadius) * (Math.sin(state.clock.elapsedTime * 6.0 + idx) * 0.4 + 0.6);
        mesh.scale.setScalar(data.scale * (1.0 + glintFactor * 2.5));
        mat.opacity = Math.min(0.95, data.opacity + glintFactor * 0.65);
        mat.color.set("#E4F2FF"); // Cool glinting moonlit color
      } else {
        // Normal warm amber glow in the dark
        mesh.scale.setScalar(data.scale);
        mat.opacity = data.opacity;
        mat.color.set("#FFDDAA"); // Warm tungsten reflection
      }
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
          <sphereGeometry args={[1, 6, 6]} />
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
