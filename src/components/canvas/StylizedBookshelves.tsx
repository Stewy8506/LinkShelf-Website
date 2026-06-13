"use client";

import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Earthy, realistic library color palette
const COLORS = {
  woodDark: "#22160F", // Deep dark walnut for pillars, window frame, beams
  woodMedium: "#3A271A", // Warm medium walnut/oak for shelves, table, chair
  paper: "#F4F1EA", // Clean paper color
  paperAged: "#D5CEBD", // Aged parchment paper color
  bookRed: "#501E1E", // Oxblood red cover
  bookGreen: "#1E2F20", // Deep forest green cover
  bookBlue: "#152535", // Deep navy blue cover
  bookBrown: "#3D2C1E", // Leather brown cover
  bookBlack: "#161616", // Charcoal cover
  bookDecay1: "#7E3E20", // Stale rusty orange
  bookDecay2: "#917543", // Stale faded ochre
  tableWood: "#2A1D15", // Massive dark oak table color
  freshGlow: "#E4F8DB", // Soft greenish-white glow for the open book
};

const BOOK_COLORS = [COLORS.bookRed, COLORS.bookGreen, COLORS.bookBlue, COLORS.bookBrown, COLORS.bookBlack];
const DECAY_COLORS = [COLORS.bookDecay1, COLORS.bookDecay2];

// ============================================================================
// Procedural Walnut Texture Cache (generates texture on startup, zero run-time cost)
// ============================================================================
let walnutTextureMedium: THREE.CanvasTexture | null = null;
let walnutTextureDark: THREE.CanvasTexture | null = null;

function createWalnutTexture(baseColor: string, grainColor: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  
  // Base wood color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);
  
  // Subtle soft horizontal grain lines
  for (let i = 0; i < 75; i++) {
    const y = Math.random() * 512;
    const thickness = Math.random() * 1.5 + 0.8;
    
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(
      128, y + (Math.random() - 0.5) * 12,
      384, y + (Math.random() - 0.5) * 12,
      512, y
    );
    ctx.globalAlpha = Math.random() * 0.12 + 0.04;
    ctx.lineWidth = thickness;
    ctx.strokeStyle = grainColor;
    ctx.stroke();
  }
  
  // Soft wood plank shading gradients
  ctx.globalAlpha = 1.0;
  for (let i = 0; i < 20; i++) {
    const y = Math.random() * 512;
    const h = Math.random() * 45 + 15;
    const grad = ctx.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.5, `rgba(0,0,0,${Math.random() * 0.06})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, 512, h);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 3.5); // Stretches grain length-wise to simulate walnut planks
  return texture;
}

function getWalnutTextureMedium() {
  if (typeof window === "undefined") return null;
  if (!walnutTextureMedium) {
    walnutTextureMedium = createWalnutTexture("#3A271A", "#25160E");
  }
  return walnutTextureMedium;
}

function getWalnutTextureDark() {
  if (typeof window === "undefined") return null;
  if (!walnutTextureDark) {
    walnutTextureDark = createWalnutTexture("#22160F", "#140C07");
  }
  return walnutTextureDark;
}

// ============================================================================
// Layout Generation and Book Mesh Instancing Pre-computation
// ============================================================================
interface BookData {
  id: number;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: [number, number, number];
  color: string;
  isFalling: boolean;
  fallDelay: number;
}

interface ShelfData {
  id: number;
  pos: [number, number, number];
  scale: [number, number, number];
}

interface PillarData {
  id: number;
  pos: [number, number, number];
  scale: [number, number, number];
}

const LIBRARY_DATA = (() => {
  const fallingBooks: BookData[] = [];
  const shelves: ShelfData[] = [];
  const pillars: PillarData[] = [];

  // Instanced matrices grouped by cover color
  const simpleCovers: Record<string, THREE.Matrix4[]> = {};
  const detailedCovers: Record<string, THREE.Matrix4[]> = {};
  const detailedPages: THREE.Matrix4[] = [];

  // Initialize maps
  BOOK_COLORS.concat(DECAY_COLORS).forEach((c) => {
    simpleCovers[c] = [];
    detailedCovers[c] = [];
  });

  let bookId = 0;
  let shelfId = 0;
  let pillarId = 0;

  const startY = -4.5;
  const shelfHeight = 1.8;
  const shelfDepth = 0.9;
  const shelfWidth = 4.0;

  // 1. BACK SHELF WALL (At z = -23.0)
  const backCols = 7;
  const backRows = 9;
  const backStartX = -((backCols - 1) * shelfWidth) / 2;

  // Back wall pillars
  for (let c = 0; c <= backCols; c++) {
    pillars.push({
      id: pillarId++,
      pos: [backStartX + c * shelfWidth - shelfWidth / 2, startY + (backRows * shelfHeight) / 2, -23.1],
      scale: [0.15, backRows * shelfHeight, shelfDepth + 0.1],
    });
  }

  // Back wall shelves & books (skip c = 3 for window gap)
  for (let r = 0; r < backRows; r++) {
    const y = startY + r * shelfHeight;
    for (let c = 0; c < backCols; c++) {
      if (c === 3) continue; // Window Gap

      const xCenter = backStartX + c * shelfWidth;
      shelves.push({
        id: shelfId++,
        pos: [xCenter, y, -23.0],
        scale: [shelfWidth, 0.1, shelfDepth],
      });

      let currentX = xCenter - shelfWidth / 2 + 0.2;
      while (currentX < xCenter + shelfWidth / 2 - 0.3) {
        if (Math.random() > 0.85) {
          currentX += Math.random() * 0.3 + 0.1;
          continue;
        }

        const bWidth = Math.random() * 0.12 + 0.08;
        const bHeight = Math.random() * 0.35 + 0.75;
        const bDepth = Math.random() * 0.1 + 0.6;
        
        if (currentX + bWidth > xCenter + shelfWidth / 2 - 0.2) break;

        const isFalling = Math.random() > 0.9 && r > 2 && r < 7; // Middle shelves fall
        const color = isFalling ? DECAY_COLORS[Math.floor(Math.random() * DECAY_COLORS.length)] : BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
        const leanRotZ = (!isFalling && Math.random() > 0.82) ? (Math.random() > 0.5 ? 0.14 : -0.14) : 0;
        
        const pos: [number, number, number] = [currentX + bWidth / 2, y + bHeight / 2 + 0.05, -23.0 + (Math.random() * 0.08)];
        const rot: [number, number, number] = [0, (Math.random() - 0.5) * 0.08, leanRotZ];
        const scale: [number, number, number] = [bWidth, bHeight, bDepth];

        if (isFalling) {
          fallingBooks.push({
            id: bookId++,
            pos,
            rot,
            scale,
            color,
            isFalling: true,
            fallDelay: Math.random(),
          });
        } else {
          // Precompute matrix for instanced cover
          const bookMatrix = new THREE.Matrix4().compose(
            new THREE.Vector3(...pos),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)),
            new THREE.Vector3(...scale)
          );
          detailedCovers[color].push(bookMatrix);

          // Precompute matrix for instanced pages (inset at the back Z face)
          const localScale: [number, number, number] = [
            (scale[0] - 0.02) / scale[0],
            (scale[1] - 0.04) / scale[1],
            (scale[2] - 0.02) / scale[2]
          ];
          const localPageMatrix = new THREE.Matrix4().compose(
            new THREE.Vector3(0, 0, -0.015),
            new THREE.Quaternion(),
            new THREE.Vector3(...localScale)
          );
          const pageMatrix = bookMatrix.clone().multiply(localPageMatrix);
          detailedPages.push(pageMatrix);
        }

        currentX += bWidth + 0.02;
      }
    }
  }

  // 2. SIDE SHELF WALLS (Left at x = -14.0, Right at x = 14.0)
  const sideCols = 7;
  const sideRows = 7;
  const sideZStart = -23.0;
  const xWalls = { left: -14.0, right: 14.0 };

  for (const side of ["left", "right"] as const) {
    const isLeft = side === "left";
    const xWall = xWalls[side];
    const xShelfCenter = isLeft ? xWall + shelfDepth / 2 : xWall - shelfDepth / 2;

    // Side wall pillars along Z
    for (let c = 0; c <= sideCols; c++) {
      const zPos = sideZStart + c * shelfWidth;
      pillars.push({
        id: pillarId++,
        pos: [isLeft ? xWall - 0.05 : xWall + 0.05, startY + (sideRows * shelfHeight) / 2, zPos],
        scale: [shelfDepth + 0.1, sideRows * shelfHeight, 0.15],
      });
    }

    // Side wall shelf boards and static simple books
    for (let r = 0; r < sideRows; r++) {
      const y = startY + r * shelfHeight;
      for (let c = 0; c < sideCols; c++) {
        const zCenter = sideZStart + c * shelfWidth + shelfWidth / 2;
        shelves.push({
          id: shelfId++,
          pos: [xShelfCenter, y, zCenter],
          scale: [shelfDepth, 0.1, shelfWidth],
        });

        let currentZ = zCenter - shelfWidth / 2 + 0.25;
        while (currentZ < zCenter + shelfWidth / 2 - 0.35) {
          if (Math.random() > 0.8) {
            currentZ += Math.random() * 0.4 + 0.15;
            continue;
          }

          const bWidth = Math.random() * 0.12 + 0.08; // Thickness along Z
          const bHeight = Math.random() * 0.3 + 0.75; // Height along Y
          const bDepth = Math.random() * 0.1 + 0.6; // Depth along X

          if (currentZ + bWidth > zCenter + shelfWidth / 2 - 0.2) break;

          const color = BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
          const leanRotX = (Math.random() > 0.8) ? (Math.random() > 0.5 ? 0.12 : -0.12) : 0;
          
          const pos: [number, number, number] = [
            xShelfCenter + (Math.random() - 0.5) * 0.06,
            y + bHeight / 2 + 0.05,
            currentZ + bWidth / 2
          ];
          const rot: [number, number, number] = [leanRotX, (isLeft ? Math.PI / 2 : -Math.PI / 2) + (Math.random() - 0.5) * 0.08, 0];
          const scale: [number, number, number] = [bDepth, bHeight, bWidth];

          // Precompute matrix for side shelf instanced cover (no pages)
          const bookMatrix = new THREE.Matrix4().compose(
            new THREE.Vector3(...pos),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)),
            new THREE.Vector3(...scale)
          );
          simpleCovers[color].push(bookMatrix);

          currentZ += bWidth + 0.03;
        }
      }
    }
  }

  return { fallingBooks, shelves, pillars, simpleCovers, detailedCovers, detailedPages };
})();

// ============================================================================
// Render Elements Components
// ============================================================================

// Instanced Books Renderer (Draws hundreds of books in a single draw call!)
function InstancedBooks({ 
  matrices, 
  color, 
  isPages 
}: { 
  matrices: THREE.Matrix4[]; 
  color: string; 
  isPages: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  useEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((matrix, idx) => {
      meshRef.current.setMatrixAt(idx, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Explicitly compute bounding volumes for the instanced mesh so shadow-mapping and raycasting work correctly
    if (meshRef.current.geometry) {
      meshRef.current.geometry.computeBoundingBox();
      meshRef.current.geometry.computeBoundingSphere();
    }
    meshRef.current.computeBoundingBox?.();
    meshRef.current.computeBoundingSphere?.();
  }, [matrices]);

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[null as unknown as THREE.BufferGeometry, null as unknown as THREE.Material, matrices.length]} 
      castShadow 
      receiveShadow
      frustumCulled={false}
    >
      <boxGeometry />
      <meshPhysicalMaterial 
        color={color}
        roughness={isPages ? 0.9 : 0.75}
        metalness={isPages ? 0.0 : 0.05}
        clearcoat={isPages ? 0.0 : 0.15}
        clearcoatRoughness={0.4}
      />
    </instancedMesh>
  );
}

// Falling/Decaying Book Component (keeps individual React structure for animation)
function FallingBook({ 
  pos, rot, scale, coverColor, fallDelay, scrollYProgress 
}: { 
  pos: [number, number, number], 
  rot: [number, number, number], 
  scale: [number, number, number], 
  coverColor: string, 
  fallDelay: number,
  scrollYProgress: MotionValue<number>
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!groupRef.current) return;
    
    const scroll = scrollYProgress.get();
    if (scroll > 0.30) {
      const fallStart = 0.35 + fallDelay * 0.08;
      if (scroll > fallStart) {
        const fallProgress = Math.min((scroll - fallStart) / 0.15, 1.0);
        const yDrop = Math.pow(fallProgress, 2) * 15; 
        const xDrift = fallProgress * (fallDelay - 0.5) * 5;
        const zDrift = fallProgress * 4;
        
        groupRef.current.position.set(pos[0] + xDrift, Math.max(pos[1] - yDrop, -4.8), pos[2] + zDrift);
        
        if (groupRef.current.position.y > -4.8) {
           groupRef.current.rotation.set(rot[0] + fallProgress * 5, rot[1] + fallProgress * 2, rot[2] + fallProgress * 8);
        } else {
           groupRef.current.position.y = -4.8;
           groupRef.current.rotation.set(Math.PI / 2, 0, rot[2] + fallProgress * 8);
        }
      }
    } else {
      groupRef.current.position.set(...pos);
      groupRef.current.rotation.set(...rot);
    }
  });

  return (
    <group ref={groupRef} position={pos} rotation={new THREE.Euler(...rot)}>
      {/* Cover Box */}
      <RoundedBox args={scale} radius={0.008} smoothness={4} receiveShadow castShadow>
        <meshPhysicalMaterial 
          color={coverColor} 
          roughness={0.7} 
          metalness={0.1}
          clearcoat={0.1}
          clearcoatRoughness={0.3}
        />
      </RoundedBox>
      
      {/* Page Inset */}
      <mesh position={[0, 0, -0.015]} receiveShadow>
        <boxGeometry args={[scale[0] - 0.02, scale[1] - 0.04, scale[2] - 0.02]} />
        <meshPhysicalMaterial color={COLORS.paperAged} roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

// Volumetric Moonlight God Rays streaming from back window
function VolumetricLight() {
  const groupRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.lookAt(new THREE.Vector3(0, -4.0, 0.0));
    }
  }, []);

  return (
    <group ref={groupRef} position={[0, 2.5, -23.4]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.0, 4.8, 25.0, 16, 4, true]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            varying vec3 vPosition;
            void main() {
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vPosition;
            void main() {
              float radialDist = length(vPosition.xz);
              
              // Cone expansion interpolation (height 25, bounds -12.5 to 12.5)
              float t = (vPosition.y - (-12.5)) / 25.0; // 0 to 1
              float currentRadius = mix(4.8, 2.0, t);
              
              // Radial fade
              float radialFade = smoothstep(currentRadius, currentRadius * 0.15, radialDist);
              
              // Length fade
              float lengthFade = smoothstep(-12.5, 8.0, vPosition.y);
              
              float opacity = radialFade * lengthFade * 0.15;
              
              gl_FragColor = vec4(0.65, 0.78, 0.98, opacity); // Moonlight color
            }
          `}
        />
      </mesh>
    </group>
  );
}

// Grand Arched Library Window with moonlight backdrop
function ArchedWindow() {
  return (
    <group position={[0, 2.5, -23.4]}>
      {/* Sky backdrop */}
      <mesh position={[0, 0, -0.3]} receiveShadow={false}>
        <planeGeometry args={[4.2, 8.5]} />
        <meshBasicMaterial color="#020306" />
      </mesh>
      
      {/* Moon Sphere */}
      <mesh position={[0.7, 2.0, -0.2]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#E8EEF8" />
      </mesh>
      
      {/* Window Frame Pillars (Left, Right, Bottom) */}
      <mesh position={[-2.0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 7.0, 0.2]} />
        <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[2.0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 7.0, 0.2]} />
        <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.7} />
      </mesh>
      <mesh position={[0, -3.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.1, 0.15, 0.2]} />
        <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.7} />
      </mesh>

      {/* Arched Top */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <torusGeometry args={[2.0, 0.06, 8, 32, Math.PI]} />
        <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.7} />
      </mesh>

      {/* Window Grid Bars */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.04, 8.4, 0.08]} />
        <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.8} />
      </mesh>
      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.9, 0.04, 0.08]} />
        <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.9, 0.04, 0.08]} />
        <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.8} />
      </mesh>
    </group>
  );
}

// Procedural Wooden Floor Planks
function FloorPlanks() {
  const planks = [];
  const count = 18;
  const plankWidth = 1.6;
  const plankLength = 45; // z = -28 to z = 17
  const startX = -((count - 1) * plankWidth) / 2;
  
  for (let i = 0; i < count; i++) {
    const shades = ["#0E0A08", "#140F0C", "#1B1410", "#0F0B09"];
    const color = shades[i % shades.length];
    
    planks.push(
      <RoundedBox 
        key={`floor-plank-${i}`}
        position={[startX + i * plankWidth, -5.01, -5.5]} 
        args={[plankWidth - 0.02, 0.02, plankLength]} 
        radius={0.005} 
        smoothness={2}
        receiveShadow
      >
        <meshPhysicalMaterial 
          color={color} 
          roughness={0.75} 
          metalness={0.05}
          clearcoat={0.35}
          clearcoatRoughness={0.4}
        />
      </RoundedBox>
    );
  }
  return <group>{planks}</group>;
}

// Exposed Ceiling Beams with dark walnut texture
function CeilingBeams() {
  const beams = [];
  const spacing = 6.0;
  const beamHeight = 8.0;
  
  for (let z = -24; z <= 12; z += spacing) {
    const texture = getWalnutTextureDark();
    beams.push(
      <RoundedBox 
        key={`ceiling-beam-${z}`}
        position={[0, beamHeight, z]}
        args={[30.0, 0.4, 0.4]}
        radius={0.01}
        smoothness={2}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial 
          color={COLORS.woodDark} 
          map={texture || undefined}
          roughness={0.8} 
        />
      </RoundedBox>
    );
  }
  return <group>{beams}</group>;
}

// Solid matte wood backing panels for the shelves (leaving window clear)
function BookshelfBacking() {
  const height = 9 * 1.8;
  const sideHeight = 7 * 1.8;
  const startY = -4.5;
  
  return (
    <group>
      <mesh position={[-8, startY + height / 2, -23.5]} castShadow receiveShadow>
        <boxGeometry args={[12, height, 0.05]} />
        <meshPhysicalMaterial color="#140D0A" roughness={0.9} metalness={0.0} />
      </mesh>
      
      <mesh position={[8, startY + height / 2, -23.5]} castShadow receiveShadow>
        <boxGeometry args={[12, height, 0.05]} />
        <meshPhysicalMaterial color="#140D0A" roughness={0.9} metalness={0.0} />
      </mesh>
      
      <mesh position={[-14.45, startY + sideHeight / 2, -9.0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, sideHeight, 28.0]} />
        <meshPhysicalMaterial color="#140D0A" roughness={0.9} metalness={0.0} />
      </mesh>
      
      <mesh position={[14.45, startY + sideHeight / 2, -9.0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, sideHeight, 28.0]} />
        <meshPhysicalMaterial color="#140D0A" roughness={0.9} metalness={0.0} />
      </mesh>
    </group>
  );
}

// Detailed Library Table with walnut grain
function LibraryTable() {
  const texture = getWalnutTextureDark();
  return (
    <group position={[0, -5, 0]} receiveShadow castShadow>
      {/* Table Top */}
      <RoundedBox position={[0, 1.5, 0]} args={[8, 0.2, 4]} radius={0.05} smoothness={4} receiveShadow castShadow>
        <meshPhysicalMaterial 
          color={COLORS.tableWood} 
          map={texture || undefined}
          roughness={0.45} 
          metalness={0.1} 
          clearcoat={0.35} 
          clearcoatRoughness={0.2} 
        />
      </RoundedBox>
      {/* Legs */}
      <RoundedBox position={[-3.5, 0.75, -1.5]} args={[0.2, 1.5, 0.2]} radius={0.02} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.tableWood} map={texture || undefined} roughness={0.6} />
      </RoundedBox>
      <RoundedBox position={[3.5, 0.75, -1.5]} args={[0.2, 1.5, 0.2]} radius={0.02} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.tableWood} map={texture || undefined} roughness={0.6} />
      </RoundedBox>
      <RoundedBox position={[-3.5, 0.75, 1.5]} args={[0.2, 1.5, 0.2]} radius={0.02} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.tableWood} map={texture || undefined} roughness={0.6} />
      </RoundedBox>
      <RoundedBox position={[3.5, 0.75, 1.5]} args={[0.2, 1.5, 0.2]} radius={0.02} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.tableWood} map={texture || undefined} roughness={0.6} />
      </RoundedBox>
    </group>
  );
}

// Traditional green bankers lamp
function BankersLamp() {
  return (
    <group position={[-0.8, -3.38, 0.4]} rotation={[0, 0.35, 0]}>
      {/* Brass circular base */}
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.03, 16]} />
        <meshPhysicalMaterial color="#CBB070" metalness={0.85} roughness={0.25} />
      </mesh>
      
      {/* Brass stand column */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
        <meshPhysicalMaterial color="#CBB070" metalness={0.85} roughness={0.25} />
      </mesh>
      
      {/* Brass horizontal support bar */}
      <mesh position={[0.045, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.1, 8]} />
        <meshPhysicalMaterial color="#CBB070" metalness={0.85} roughness={0.25} />
      </mesh>
      
      {/* Emerald Green Glass Shade */}
      <mesh position={[0.095, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.24, 16, 1, false, 0, Math.PI]} />
        <meshPhysicalMaterial 
          color="#06401F" 
          emissive="#011F0E"
          roughness={0.12} 
          metalness={0.05}
          transmission={0.45} 
          thickness={0.03}
        />
      </mesh>
      
      {/* Active point light */}
      <pointLight 
        position={[0.095, 0.38, 0]} 
        intensity={2.2} 
        color="#FFF0CC" 
        distance={6}
        decay={2.0}
      />
    </group>
  );
}

// Spindle-back library chair
function LibraryChair() {
  const texture = getWalnutTextureMedium();
  return (
    <group position={[0, -5, 1.25]} rotation={[0, Math.PI, 0]}>
      {/* Wooden Seat */}
      <RoundedBox position={[0, 0.8, 0]} args={[0.74, 0.04, 0.74]} radius={0.02} smoothness={2} castShadow receiveShadow>
        <meshPhysicalMaterial color={COLORS.woodMedium} map={texture || undefined} roughness={0.5} />
      </RoundedBox>
      
      {/* Legs */}
      <mesh position={[-0.3, 0.4, -0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.8, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} map={texture || undefined} roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.4, -0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.8, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} map={texture || undefined} roughness={0.6} />
      </mesh>
      <mesh position={[-0.3, 0.4, 0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.8, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} map={texture || undefined} roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.4, 0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.8, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} map={texture || undefined} roughness={0.6} />
      </mesh>

      {/* Spindles */}
      <mesh position={[-0.26, 1.15, -0.26]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} map={texture || undefined} roughness={0.6} />
      </mesh>
      <mesh position={[0.26, 1.15, -0.26]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} map={texture || undefined} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.15, -0.26]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} map={texture || undefined} roughness={0.6} />
      </mesh>
      
      {/* Curved Backrest Top Board */}
      <RoundedBox position={[0, 1.5, -0.26]} args={[0.68, 0.06, 0.08]} radius={0.01} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.woodMedium} map={texture || undefined} roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

// Cozy Area Rug
function Rug() {
  return (
    <mesh position={[0, -4.99, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[4.5, 3.4]} />
      <meshPhysicalMaterial color="#3E1A1A" roughness={0.95} metalness={0} />
    </mesh>
  );
}

// Glowing Open Book
function OpenBook() {
  return (
    <group position={[0, -3.38, 0.2]} rotation={[0.1, -0.25, 0]} castShadow>
      {/* Left Cover */}
      <RoundedBox position={[-0.45, 0.02, 0]} rotation={[0, 0, 0.1]} args={[0.9, 0.02, 1.2]} radius={0.01} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.bookBlack} roughness={0.7} />
      </RoundedBox>
      {/* Right Cover */}
      <RoundedBox position={[0.45, 0.02, 0]} rotation={[0, 0, -0.1]} args={[0.9, 0.02, 1.2]} radius={0.01} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.bookBlack} roughness={0.7} />
      </RoundedBox>
      
      {/* Stacked Pages - Bottom Layer */}
      <mesh position={[-0.44, 0.035, 0]} rotation={[0, 0, 0.08]}>
        <boxGeometry args={[0.82, 0.02, 1.17]} />
        <meshStandardMaterial color="#C4BEAE" roughness={0.9} />
      </mesh>
      <mesh position={[0.44, 0.035, 0]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.82, 0.02, 1.17]} />
        <meshStandardMaterial color="#C4BEAE" roughness={0.9} />
      </mesh>

      {/* Stacked Pages - Middle Layer */}
      <mesh position={[-0.43, 0.05, 0]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.81, 0.02, 1.16]} />
        <meshStandardMaterial color="#DBD5C5" roughness={0.9} />
      </mesh>
      <mesh position={[0.43, 0.05, 0]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.81, 0.02, 1.16]} />
        <meshStandardMaterial color="#DBD5C5" roughness={0.9} />
      </mesh>

      {/* Stacked Pages - Top Layer (Glowing) with Text Lines */}
      {/* Left Top Page */}
      <group position={[-0.42, 0.065, 0]} rotation={[0, 0, 0.16]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.8, 0.02, 1.15]} />
          <meshStandardMaterial color={COLORS.paper} emissive={COLORS.freshGlow} emissiveIntensity={0.35} />
        </mesh>
        {/* Text lines on left page */}
        {[-0.35, -0.18, 0.0, 0.18, 0.35].map((zOffset, i) => {
          const lineWidth = i === 2 || i === 4 ? 0.48 : 0.62;
          const xOffset = i === 2 || i === 4 ? -0.07 : 0.0;
          return (
            <mesh key={`l-line-${i}`} position={[xOffset, 0.011, zOffset]}>
              <boxGeometry args={[lineWidth, 0.002, 0.015]} />
              <meshBasicMaterial color="#30241E" transparent opacity={0.65} />
            </mesh>
          );
        })}
      </group>

      {/* Right Top Page */}
      <group position={[0.42, 0.065, 0]} rotation={[0, 0, -0.16]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[0.8, 0.02, 1.15]} />
          <meshStandardMaterial color={COLORS.paper} emissive={COLORS.freshGlow} emissiveIntensity={0.35} />
        </mesh>
        {/* Text lines on right page */}
        {[-0.35, -0.18, 0.0, 0.18, 0.35].map((zOffset, i) => {
          const lineWidth = i === 0 || i === 3 ? 0.48 : 0.62;
          const xOffset = i === 0 || i === 3 ? 0.07 : 0.0;
          return (
            <mesh key={`r-line-${i}`} position={[xOffset, 0.011, zOffset]}>
              <boxGeometry args={[lineWidth, 0.002, 0.015]} />
              <meshBasicMaterial color="#30241E" transparent opacity={0.65} />
            </mesh>
          );
        })}
      </group>

      {/* Spine Crease */}
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[0.028, 0.05, 1.16]} />
        <meshPhysicalMaterial color="#22160F" roughness={0.9} />
      </mesh>

      {/* Floating glowing fresh nodes */}
      <mesh position={[-0.1, 0.3, 0.1]}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshStandardMaterial color={COLORS.freshGlow} emissive={COLORS.freshGlow} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.2, 0.5, -0.1]}>
        <sphereGeometry args={[0.008, 12, 12]} />
        <meshStandardMaterial color={COLORS.freshGlow} emissive={COLORS.freshGlow} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.05, 0.8, 0.2]}>
        <sphereGeometry args={[0.016, 12, 12]} />
        <meshStandardMaterial color={COLORS.freshGlow} emissive={COLORS.freshGlow} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Minimalist Quill Pen & Brass Inkwell next to the open book
function QuillAndInkwell() {
  return (
    <group position={[-0.72, -3.38, 0.6]}>
      {/* Brass Inkwell base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 0.04, 12]} />
        <meshPhysicalMaterial color="#8B7343" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Dark Ink inside */}
      <mesh position={[0, 0.039, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.002, 8]} />
        <meshBasicMaterial color="#0A0A0F" />
      </mesh>
      {/* Quill Pen (leaning out) */}
      <group position={[0.01, 0.03, -0.01]} rotation={[0.4, 0.1, 0.5]}>
        {/* Shaft */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.003, 0.003, 0.26, 8]} />
          <meshPhysicalMaterial color="#EDEDE6" roughness={0.6} />
        </mesh>
        {/* White feather vane */}
        <mesh position={[0, 0.24, 0.008]} rotation={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.001, 0.16, 0.03]} />
          <meshPhysicalMaterial color="#F4F2EB" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// Scattered fallen books on the floor (represents rot/decay history)
function FloorBooks() {
  return (
    <group>
      {/* Fallen Book 1 - flat on the floor */}
      <group position={[1.5, -4.95, 0.7]} rotation={[0, 0.6, Math.PI / 2]}>
        <RoundedBox args={[0.11, 0.8, 0.58]} radius={0.008} smoothness={2} castShadow receiveShadow>
          <meshPhysicalMaterial color={COLORS.bookRed} roughness={0.7} />
        </RoundedBox>
      </group>
      
      {/* Fallen Book 2 - leaning on the table leg */}
      <group position={[-2.4, -4.95, -0.5]} rotation={[0.15, -0.7, Math.PI / 2]}>
        <RoundedBox args={[0.1, 0.82, 0.56]} radius={0.008} smoothness={2} castShadow receiveShadow>
          <meshPhysicalMaterial color={COLORS.bookBlue} roughness={0.7} />
        </RoundedBox>
      </group>
    </group>
  );
}

// ============================================================================
// Main StylizedBookshelves Component
// ============================================================================
interface StylizedBookshelvesProps {
  scrollYProgress: MotionValue<number>;
}

export function StylizedBookshelves({ scrollYProgress }: StylizedBookshelvesProps) {
  return (
    <group>
      {/* Render Architecture */}
      <FloorPlanks />
      <CeilingBeams />
      <ArchedWindow />
      <BookshelfBacking />
      <VolumetricLight />

      {/* Render Pillars with walnut texture */}
      {LIBRARY_DATA.pillars.map((p) => {
        const texture = getWalnutTextureDark();
        return (
          <RoundedBox key={`p-${p.id}`} position={p.pos} args={p.scale} radius={0.015} smoothness={4} receiveShadow castShadow>
            <meshPhysicalMaterial 
              color={COLORS.woodDark} 
              map={texture || undefined}
              roughness={0.65} 
              clearcoat={0.1} 
            />
          </RoundedBox>
        );
      })}

      {/* Render Shelves with walnut texture */}
      {LIBRARY_DATA.shelves.map((s) => {
        const texture = getWalnutTextureMedium();
        return (
          <RoundedBox key={`s-${s.id}`} position={s.pos} args={s.scale} radius={0.01} smoothness={4} receiveShadow castShadow>
            <meshPhysicalMaterial 
              color={COLORS.woodMedium} 
              map={texture || undefined}
              roughness={0.55} 
              clearcoat={0.15} 
            />
          </RoundedBox>
        );
      })}

      {/* Render Instanced Static Books (Simple covers) */}
      {Object.entries(LIBRARY_DATA.simpleCovers).map(([color, matrices]) => (
        matrices.length > 0 && (
          <InstancedBooks
            key={`inst-simple-${color}`}
            matrices={matrices}
            color={color}
            isPages={false}
          />
        )
      ))}

      {/* Render Instanced Static Books (Detailed covers) */}
      {Object.entries(LIBRARY_DATA.detailedCovers).map(([color, matrices]) => (
        matrices.length > 0 && (
          <InstancedBooks
            key={`inst-det-cov-${color}`}
            matrices={matrices}
            color={color}
            isPages={false}
          />
        )
      ))}

      {/* Render Instanced Static Books (Detailed pages) */}
      {LIBRARY_DATA.detailedPages.length > 0 && (
        <InstancedBooks
          matrices={LIBRARY_DATA.detailedPages}
          color={COLORS.paperAged}
          isPages={true}
        />
      )}

      {/* Render Falling Books (Animated individual components) */}
      {LIBRARY_DATA.fallingBooks.map((b) => (
        <FallingBook
          key={`b-fall-${b.id}`}
          pos={b.pos}
          rot={b.rot}
          scale={b.scale}
          coverColor={b.color}
          fallDelay={b.fallDelay}
          scrollYProgress={scrollYProgress}
        />
      ))}

      {/* Reading area furniture */}
      <LibraryTable />
      <BankersLamp />
      <LibraryChair />
      <Rug />
      <OpenBook />
      <QuillAndInkwell />
      <FloorBooks />
    </group>
  );
}
