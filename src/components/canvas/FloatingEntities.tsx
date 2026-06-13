"use client";

import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
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

// Scratch variables for instanced updates
const tempMatrix = new THREE.Matrix4();
const tempPosition = new THREE.Vector3();
const tempQuaternion = new THREE.Quaternion();
const tempScale = new THREE.Vector3();
const tempColor = new THREE.Color();

interface FloatingEntitiesProps {
  scrollYProgress: MotionValue<number>;
}

export function FloatingEntities(_props: FloatingEntitiesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const particles = useRef<DustData[]>([]);

  // Clone particles on mount to maintain a clean local tracking instance
  useEffect(() => {
    particles.current = DUST_PARTICLES.map((d) => ({
      pos: [...d.pos] as [number, number, number],
      speed: d.speed,
      scale: d.scale,
      opacity: d.opacity,
    }));
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || particles.current.length === 0) return;

    const list = particles.current;
    const count = list.length;

    for (let idx = 0; idx < count; idx++) {
      const data = list[idx];

      // Ambient drift motion
      data.pos[1] += Math.sin(state.clock.elapsedTime * data.speed + idx) * delta * 0.12;
      data.pos[0] += Math.cos(state.clock.elapsedTime * data.speed * 0.5 + idx) * delta * 0.06;

      // Wrap out-of-bounds particles to keep density stable
      if (data.pos[1] > 8) data.pos[1] = -6;
      if (data.pos[1] < -6) data.pos[1] = 8;
      if (data.pos[0] > 15) data.pos[0] = -15;
      if (data.pos[0] < -15) data.pos[0] = 15;

      tempPosition.set(...data.pos);
      const dist = getDistanceToBeam(tempPosition, tempVec1, tempVec2);

      // Light beam cone radius grows from 2.0 at window (z = -23.4) to 4.8 at table (z = 0)
      const relativeZ = Math.max(0, Math.min(1, (data.pos[2] - -23.4) / 23.4));
      const beamRadius = 2.0 + relativeZ * 2.8;

      let currentScale = data.scale;
      let opacity = data.opacity;
      let colorHex = "#FFDDAA"; // Warm tungsten reflection default

      if (dist < beamRadius && data.pos[2] > -23.4 && data.pos[2] < 2.0) {
        // Glistening effect inside the moonbeam ray
        const glintFactor = (1.0 - dist / beamRadius) * (Math.sin(state.clock.elapsedTime * 6.0 + idx) * 0.4 + 0.6);
        currentScale = data.scale * (1.0 + glintFactor * 2.5);
        opacity = Math.min(0.95, data.opacity + glintFactor * 0.65);
        colorHex = "#E4F2FF"; // Cool glistening moonlit blue
      }

      // Compose instance transform matrix
      tempScale.set(currentScale, currentScale, currentScale);
      tempQuaternion.set(0, 0, 0, 1); // Identity rotation for particles
      tempMatrix.compose(tempPosition, tempQuaternion, tempScale);
      meshRef.current.setMatrixAt(idx, tempMatrix);

      // Mix particle opacity directly into instance color because standard InstancedMesh basic material
      // doesn't support individual alphas out of the box. Since background is black, color * opacity
      // yields mathematically and visually identical pixels.
      tempColor.set(colorHex).multiplyScalar(opacity);
      meshRef.current.setColorAt(idx, tempColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null as unknown as THREE.BufferGeometry, null as unknown as THREE.Material, 200]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent={true} 
        depthWrite={false} 
      />
    </instancedMesh>
  );
}
