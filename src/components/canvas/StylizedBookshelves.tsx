"use client";

import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
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

interface BookData {
  id: number;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: [number, number, number];
  color: string;
  isFalling: boolean;
  fallDelay: number;
  isDetailed: boolean;
}

interface ShelfData {
  id: number;
  pos: [number, number, number];
  scale: [number, number, number];
  rot?: [number, number, number];
}

interface PillarData {
  id: number;
  pos: [number, number, number];
  scale: [number, number, number];
}

const LIBRARY_DATA = (() => {
  const books: BookData[] = [];
  const shelves: ShelfData[] = [];
  const pillars: PillarData[] = [];

  let bookId = 0;
  let shelfId = 0;
  let pillarId = 0;

  const startY = -4.5;
  const shelfHeight = 1.8;
  const shelfDepth = 0.9;
  const shelfWidth = 4.0;

  // ==========================================
  // 1. BACK SHELF WALL (At z = -23.0)
  // ==========================================
  const backCols = 7;
  const backRows = 9;
  const backStartX = -((backCols - 1) * shelfWidth) / 2;

  // Bounding pillars for the back wall
  for (let c = 0; c <= backCols; c++) {
    pillars.push({
      id: pillarId++,
      pos: [backStartX + c * shelfWidth - shelfWidth / 2, startY + (backRows * shelfHeight) / 2, -23.1],
      scale: [0.15, backRows * shelfHeight, shelfDepth + 0.1],
    });
  }

  // Back Wall Shelves and Books (c = 3 is the middle column skipped for the Window)
  for (let r = 0; r < backRows; r++) {
    const y = startY + r * shelfHeight;
    for (let c = 0; c < backCols; c++) {
      if (c === 3) continue; // Window Gap

      const xCenter = backStartX + c * shelfWidth;
      
      // Shelf board
      shelves.push({
        id: shelfId++,
        pos: [xCenter, y, -23.0],
        scale: [shelfWidth, 0.1, shelfDepth],
      });

      // Populate Books
      let currentX = xCenter - shelfWidth / 2 + 0.2;
      while (currentX < xCenter + shelfWidth / 2 - 0.3) {
        // Random gaps
        if (Math.random() > 0.85) {
          currentX += Math.random() * 0.3 + 0.1;
          continue;
        }

        const bWidth = Math.random() * 0.12 + 0.08;
        const bHeight = Math.random() * 0.35 + 0.75;
        const bDepth = Math.random() * 0.1 + 0.6;
        
        if (currentX + bWidth > xCenter + shelfWidth / 2 - 0.2) break;

        const isFalling = Math.random() > 0.9 && r > 2 && r < 7; // Middle rows fall
        const color = isFalling ? DECAY_COLORS[Math.floor(Math.random() * DECAY_COLORS.length)] : BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
        const leanRotZ = (!isFalling && Math.random() > 0.82) ? (Math.random() > 0.5 ? 0.14 : -0.14) : 0;
        
        books.push({
          id: bookId++,
          pos: [currentX + bWidth / 2, y + bHeight / 2 + 0.05, -23.0 + (Math.random() * 0.08)],
          rot: [0, (Math.random() - 0.5) * 0.08, leanRotZ],
          scale: [bWidth, bHeight, bDepth],
          color,
          isFalling,
          fallDelay: Math.random(),
          isDetailed: true, // Back wall is close to camera -> detailed covers and pages
        });

        currentX += bWidth + 0.02;
      }
    }
  }

  // ==========================================
  // 2. SIDE SHELF WALLS (Left at x = -14.0, Right at x = 14.0)
  // ==========================================
  const sideCols = 7;
  const sideRows = 7; // Slightly shorter for aesthetic balance
  const sideZStart = -23.0;

  // Left Side Shelves (facing +X) & Right Side Shelves (facing -X)
  const xWalls = { left: -14.0, right: 14.0 };

  for (const side of ["left", "right"] as const) {
    const isLeft = side === "left";
    const xWall = xWalls[side];
    const xShelfCenter = isLeft ? xWall + shelfDepth / 2 : xWall - shelfDepth / 2;

    // Pillars along Z axis
    for (let c = 0; c <= sideCols; c++) {
      const zPos = sideZStart + c * shelfWidth;
      pillars.push({
        id: pillarId++,
        pos: [isLeft ? xWall - 0.05 : xWall + 0.05, startY + (sideRows * shelfHeight) / 2, zPos],
        scale: [shelfDepth + 0.1, sideRows * shelfHeight, 0.15],
      });
    }

    // Shelf Boards and Books
    for (let r = 0; r < sideRows; r++) {
      const y = startY + r * shelfHeight;
      for (let c = 0; c < sideCols; c++) {
        const zCenter = sideZStart + c * shelfWidth + shelfWidth / 2;
        
        // Shelf Board (runs along Z axis)
        shelves.push({
          id: shelfId++,
          pos: [xShelfCenter, y, zCenter],
          scale: [shelfDepth, 0.1, shelfWidth],
        });

        // Books on side shelf (running along Z axis)
        let currentZ = zCenter - shelfWidth / 2 + 0.25;
        while (currentZ < zCenter + shelfWidth / 2 - 0.35) {
          if (Math.random() > 0.8) {
            currentZ += Math.random() * 0.4 + 0.15;
            continue;
          }

          const bWidth = Math.random() * 0.12 + 0.08; // Small thickness along Z
          const bHeight = Math.random() * 0.3 + 0.75; // Height along Y
          const bDepth = Math.random() * 0.1 + 0.6; // Depth along X

          if (currentZ + bWidth > zCenter + shelfWidth / 2 - 0.2) break;

          const color = BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
          const leanRotX = (Math.random() > 0.8) ? (Math.random() > 0.5 ? 0.12 : -0.12) : 0;
          
          books.push({
            id: bookId++,
            pos: [
              xShelfCenter + (Math.random() - 0.5) * 0.06,
              y + bHeight / 2 + 0.05,
              currentZ + bWidth / 2
            ],
            // Rotate to stand perpendicular along Z axis (+90deg or -90deg)
            rot: [leanRotX, (isLeft ? Math.PI / 2 : -Math.PI / 2) + (Math.random() - 0.5) * 0.08, 0],
            // Scale transposes width to Z and depth to X
            scale: [bDepth, bHeight, bWidth],
            color,
            isFalling: false, // Side books do not fall
            fallDelay: 0,
            isDetailed: false, // Background/side shelves use simplified LOD books (single mesh)
          });

          currentZ += bWidth + 0.03;
        }
      }
    }
  }

  return { books, shelves, pillars };
})();

// Optimized Book Component using LOD (Level of Detail)
function Book({ 
  pos, rot, scale, coverColor, isFalling, fallDelay, scrollYProgress, isDetailed 
}: { 
  pos: [number, number, number], 
  rot: [number, number, number], 
  scale: [number, number, number], 
  coverColor: string, 
  isFalling: boolean, 
  fallDelay: number,
  scrollYProgress: MotionValue<number>,
  isDetailed: boolean
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (!isFalling || !groupRef.current) return;
    
    const scroll = scrollYProgress.get();
    if (scroll > 0.30) {
      // Falling animation path
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
           // Hit the floor
           groupRef.current.position.y = -4.8;
           groupRef.current.rotation.set(Math.PI / 2, 0, rot[2] + fallProgress * 8);
        }
      }
    } else {
      // Reset
      groupRef.current.position.set(...pos);
      groupRef.current.rotation.set(...rot);
    }
  });

  return (
    <group ref={groupRef} position={pos} rotation={new THREE.Euler(...rot)}>
      {/* Cover / Book Box */}
      <RoundedBox args={scale} radius={0.008} smoothness={isDetailed ? 4 : 2} receiveShadow castShadow>
        <meshPhysicalMaterial 
          color={coverColor} 
          roughness={0.7} 
          metalness={0.1}
          clearcoat={0.1}
          clearcoatRoughness={0.3}
        />
      </RoundedBox>
      
      {/* Inset Pages block (rendered only for high-detail hero books on the back shelf) */}
      {isDetailed && (
        <mesh position={[0, 0, -0.015]} receiveShadow>
          <boxGeometry args={[scale[0] - 0.02, scale[1] - 0.04, scale[2] - 0.02]} />
          <meshPhysicalMaterial color={COLORS.paperAged} roughness={0.9} metalness={0} />
        </mesh>
      )}
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

      {/* Arched Top (Torus thetaLength Math.PI is a perfect semicircle arch) */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <torusGeometry args={[2.0, 0.06, 8, 32, Math.PI]} />
        <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.7} />
      </mesh>

      {/* Window Grid Bars (Muntins) */}
      {/* Vertical center bar */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.04, 8.4, 0.08]} />
        <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.8} />
      </mesh>
      {/* Horizontal grid bars */}
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
    // Elegant dark walnut tones
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

// Exposed Ceiling Beams running horizontally
function CeilingBeams() {
  const beams = [];
  const spacing = 6.0;
  const beamHeight = 8.0;
  
  for (let z = -24; z <= 12; z += spacing) {
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
        <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.8} />
      </RoundedBox>
    );
  }
  return <group>{beams}</group>;
}

// Detailed Library Table
function LibraryTable() {
  return (
    <group position={[0, -5, 0]} receiveShadow castShadow>
      {/* Table Top */}
      <RoundedBox position={[0, 1.5, 0]} args={[8, 0.2, 4]} radius={0.05} smoothness={4} receiveShadow castShadow>
        <meshPhysicalMaterial color={COLORS.tableWood} roughness={0.45} metalness={0.1} clearcoat={0.35} clearcoatRoughness={0.2} />
      </RoundedBox>
      {/* Legs */}
      <RoundedBox position={[-3.5, 0.75, -1.5]} args={[0.2, 1.5, 0.2]} radius={0.02} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.tableWood} roughness={0.6} />
      </RoundedBox>
      <RoundedBox position={[3.5, 0.75, -1.5]} args={[0.2, 1.5, 0.2]} radius={0.02} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.tableWood} roughness={0.6} />
      </RoundedBox>
      <RoundedBox position={[-3.5, 0.75, 1.5]} args={[0.2, 1.5, 0.2]} radius={0.02} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.tableWood} roughness={0.6} />
      </RoundedBox>
      <RoundedBox position={[3.5, 0.75, 1.5]} args={[0.2, 1.5, 0.2]} radius={0.02} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.tableWood} roughness={0.6} />
      </RoundedBox>
    </group>
  );
}

// Traditional green bankers lamp with a bulb and direct lighting
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
        {/* OpenEnded half-cylinder shade */}
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
      
      {/* Active Spotlight pointing down on the book */}
      <pointLight 
        position={[0.095, 0.38, 0]} 
        intensity={6.5} 
        color="#FFF0CC" 
        distance={6}
        decay={2.0}
        castShadow
        shadow-bias={-0.001}
      />
    </group>
  );
}

// Spindle-back library chair
function LibraryChair() {
  return (
    <group position={[0, -5, 1.25]} rotation={[0, Math.PI, 0]}>
      {/* Wooden Seat */}
      <RoundedBox position={[0, 0.8, 0]} args={[0.74, 0.04, 0.74]} radius={0.02} smoothness={2} castShadow receiveShadow>
        <meshPhysicalMaterial color={COLORS.woodMedium} roughness={0.5} />
      </RoundedBox>
      
      {/* Legs */}
      <mesh position={[-0.3, 0.4, -0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.8, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.4, -0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.8, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} roughness={0.6} />
      </mesh>
      <mesh position={[-0.3, 0.4, 0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.8, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} roughness={0.6} />
      </mesh>
      <mesh position={[0.3, 0.4, 0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.015, 0.8, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} roughness={0.6} />
      </mesh>

      {/* Spindles (Backrest poles) */}
      <mesh position={[-0.26, 1.15, -0.26]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} roughness={0.6} />
      </mesh>
      <mesh position={[0.26, 1.15, -0.26]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.15, -0.26]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />
        <meshPhysicalMaterial color={COLORS.woodMedium} roughness={0.6} />
      </mesh>
      
      {/* Curved Backrest Top Board */}
      <RoundedBox position={[0, 1.5, -0.26]} args={[0.68, 0.06, 0.08]} radius={0.01} smoothness={2} castShadow>
        <meshPhysicalMaterial color={COLORS.woodMedium} roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

// Cozy Area Rug under the table and chair
function Rug() {
  return (
    <mesh position={[0, -4.99, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[4.5, 3.4]} />
      <meshPhysicalMaterial 
        color="#3E1A1A" // Deep burgundy
        roughness={0.95} 
        metalness={0} 
      />
    </mesh>
  );
}

// Glowing Open Book on the table
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
      
      {/* Left Pages (Glowing) */}
      <mesh position={[-0.42, 0.06, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.8, 0.06, 1.15]} />
        <meshStandardMaterial color={COLORS.paper} emissive={COLORS.freshGlow} emissiveIntensity={0.8} />
      </mesh>
      {/* Right Pages (Glowing) */}
      <mesh position={[0.42, 0.06, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.8, 0.06, 1.15]} />
        <meshStandardMaterial color={COLORS.paper} emissive={COLORS.freshGlow} emissiveIntensity={0.8} />
      </mesh>

      {/* Floating glowing fresh nodes from the book */}
      <mesh position={[-0.1, 0.3, 0.1]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={COLORS.freshGlow} emissive={COLORS.freshGlow} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.2, 0.5, -0.1]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color={COLORS.freshGlow} emissive={COLORS.freshGlow} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
      <mesh position={[0.05, 0.8, 0.2]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={COLORS.freshGlow} emissive={COLORS.freshGlow} emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

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

      {/* Render Pillars */}
      {LIBRARY_DATA.pillars.map((p) => (
        <RoundedBox key={`p-${p.id}`} position={p.pos} args={p.scale} radius={0.015} smoothness={4} receiveShadow castShadow>
          <meshPhysicalMaterial color={COLORS.woodDark} roughness={0.65} clearcoat={0.1} />
        </RoundedBox>
      ))}

      {/* Render Shelves */}
      {LIBRARY_DATA.shelves.map((s) => (
        <RoundedBox key={`s-${s.id}`} position={s.pos} args={s.scale} radius={0.01} smoothness={4} receiveShadow castShadow>
          <meshPhysicalMaterial color={COLORS.woodMedium} roughness={0.55} clearcoat={0.15} />
        </RoundedBox>
      ))}

      {/* Render Books (Detailed on back shelf, simple on side shelves) */}
      {LIBRARY_DATA.books.map((b) => (
        <Book
          key={`b-${b.id}`}
          pos={b.pos}
          rot={b.rot}
          scale={b.scale}
          coverColor={b.color}
          isFalling={b.isFalling}
          fallDelay={b.fallDelay}
          scrollYProgress={scrollYProgress}
          isDetailed={b.isDetailed}
        />
      ))}

      {/* Reading area furniture */}
      <LibraryTable />
      <BankersLamp />
      <LibraryChair />
      <Rug />
      <OpenBook />
    </group>
  );
}
