// src/components/canvas/PCScene.tsx — Scena 3D z hierarchią: Case > Mobo > [CPU, GPU, RAM, Cooler]
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBuildStore } from '@/store/useBuildStore';
import RAMModel from './RAMModel';
import CoolerModel from './CoolerModel';
import * as THREE from 'three';

// ── GPU Fan (reusable) ──────────────────────────────────────────────
function Fan({
  position,
  radius = 0.12,
}: {
  position: [number, number, number];
  radius?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 14;
    }
  });

  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.008, 8, 32]} />
        <meshStandardMaterial color="#444" metalness={0.6} roughness={0.3} />
      </mesh>
      <group ref={groupRef}>
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 7;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius * 0.55,
                0,
                Math.sin(angle) * radius * 0.55,
              ]}
              rotation={[0.4, angle, 0]}
            >
              <boxGeometry args={[radius * 0.5, 0.006, 0.018]} />
              <meshStandardMaterial color="#555" />
            </mesh>
          );
        })}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[radius * 0.15, radius * 0.15, 0.015, 12]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// ── GPU ──────────────────────────────────────────────────────────────
function GPUModel() {
  const gpu = useBuildStore((s) => s.selectedGPU);
  if (!gpu) return null;

  const [w, h, d] = gpu.dimensions;
  const fanSpacing = w / (gpu.fan_count + 1);

  return (
    // Pozycja w przestrzeni płyty: slot PCIe jest poniżej socketa
    <group position={[0, -0.35, 0.3]}>
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={gpu.color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, h / 2 + 0.015, 0]}>
        <boxGeometry args={[w * 0.98, 0.02, d * 0.9]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.8} roughness={0.2} />
      </mesh>
      {Array.from({ length: gpu.fan_count }).map((_, i) => (
        <Fan
          key={i}
          position={[-w / 2 + fanSpacing * (i + 1), -h / 2 - 0.01, 0]}
        />
      ))}
      <mesh position={[w / 2 + 0.03, h / 2 - 0.05, 0]}>
        <boxGeometry args={[0.06, 0.08, 0.3]} />
        <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// ── CPU (IHS) ───────────────────────────────────────────────────────
function CPUModel() {
  const cpu = useBuildStore((s) => s.selectedCPU);
  if (!cpu) return null;

  return (
    <group position={[0, 0.3, 0.05]}>
      {/* IHS (Integrated Heat Spreader) */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.3, 0.04]} />
        <meshStandardMaterial color="#999" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Napis / logo na IHS */}
      <mesh position={[0, 0, 0.021]}>
        <boxGeometry args={[0.12, 0.03, 0.001]} />
        <meshStandardMaterial color="#666" />
      </mesh>
    </group>
  );
}

// ── Płyta główna (kontener nadrzędny) ───────────────────────────────
function MotherboardModel() {
  const mobo = useBuildStore((s) => s.selectedMotherboard);
  if (!mobo) return null;

  const [w, h, d] = mobo.dimensions;

  return (
    // Pozycja płyty głównej w obudowie: pionowo na tylnej ściance
    <group position={[0, 0.15, -0.95]}>
      {/* ── PCB ─────────────────────────────────────────────── */}
      <mesh castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#0d3320" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* ── Socket CPU ──────────────────────────────────────── */}
      <mesh position={[0, 0.3, d / 2 + 0.005]}>
        <boxGeometry args={[0.35, 0.35, 0.02]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* ── Sloty RAM ───────────────────────────────────────── */}
      {[0.5, 0.57, 0.64, 0.71].map((x, i) => (
        <mesh key={i} position={[x, 0.3, d / 2 + 0.005]}>
          <boxGeometry args={[0.04, 0.6, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
      ))}

      {/* ── Slot PCIe x16 ───────────────────────────────────── */}
      <mesh position={[0, -0.35, d / 2 + 0.005]}>
        <boxGeometry args={[0.7, 0.05, 0.02]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* ── VRM heatsink ────────────────────────────────────── */}
      <mesh position={[-0.5, 0.6, d / 2 + 0.02]}>
        <boxGeometry args={[0.4, 0.15, 0.04]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* ── I/O shield ──────────────────────────────────────── */}
      <mesh position={[-0.55, 0.7, d / 2 + 0.01]}>
        <boxGeometry args={[0.5, 0.12, 0.03]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* ── M.2 slot ────────────────────────────────────────── */}
      <mesh position={[0.1, -0.05, d / 2 + 0.005]}>
        <boxGeometry args={[0.15, 0.5, 0.01]} />
        <meshStandardMaterial color="#222" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* ══════════════════════════════════════════════════════
          Komponenty-dzieci (montowane względem płyty)
          ══════════════════════════════════════════════════════ */}

      {/* CPU */}
      <CPUModel />

      {/* Chłodzenie CPU */}
      <CoolerModel />

      {/* RAM */}
      <RAMModel />

      {/* GPU */}
      <GPUModel />
    </group>
  );
}

// ── Obudowa (szkło + ramka) ─────────────────────────────────────────
function CaseShell() {
  const pc = useBuildStore((s) => s.selectedCase);
  const [w, h, d] = pc.dimensions;

  return (
    <group>
      {/* Szklany panel (front) */}
      <mesh position={[0, 0, d / 2]}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial
          color="#88ccff"
          transparent
          opacity={0.1}
          roughness={0.05}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tylna */}
      <mesh position={[0, 0, -d / 2]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#111118" side={THREE.DoubleSide} />
      </mesh>

      {/* Lewa */}
      <mesh position={[-w / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[d, h]} />
        <meshStandardMaterial color="#15151f" side={THREE.DoubleSide} />
      </mesh>

      {/* Prawa */}
      <mesh position={[w / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[d, h]} />
        <meshStandardMaterial color="#15151f" side={THREE.DoubleSide} />
      </mesh>

      {/* Góra */}
      <mesh position={[0, h / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#111118" side={THREE.DoubleSide} />
      </mesh>

      {/* Dół */}
      <mesh position={[0, -h / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#0a0a12" side={THREE.DoubleSide} />
      </mesh>

      {/* ── Ramki pionowe ─────────────────────────────────── */}
      {(
        [
          [-w / 2, 0, d / 2],
          [w / 2, 0, d / 2],
          [-w / 2, 0, -d / 2],
          [w / 2, 0, -d / 2],
        ] as [number, number, number][]
      ).map((pos, i) => (
        <mesh key={`v-${i}`} position={pos}>
          <boxGeometry args={[0.04, h, 0.04]} />
          <meshStandardMaterial color="#222233" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ── Ramki poziome front/back ─────────────────────── */}
      {(
        [
          [0, h / 2, d / 2],
          [0, h / 2, -d / 2],
          [0, -h / 2, d / 2],
          [0, -h / 2, -d / 2],
        ] as [number, number, number][]
      ).map((pos, i) => (
        <mesh key={`h-${i}`} position={pos}>
          <boxGeometry args={[w, 0.04, 0.04]} />
          <meshStandardMaterial color="#222233" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ── Ramki boczne ──────────────────────────────────── */}
      {(
        [
          [-w / 2, h / 2, 0],
          [w / 2, h / 2, 0],
          [-w / 2, -h / 2, 0],
          [w / 2, -h / 2, 0],
        ] as [number, number, number][]
      ).map((pos, i) => (
        <mesh key={`s-${i}`} position={pos}>
          <boxGeometry args={[0.04, 0.04, d]} />
          <meshStandardMaterial color="#222233" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// ── Eksport główny ──────────────────────────────────────────────────
export default function PCScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 4, -2]} intensity={0.4} />
      <pointLight position={[0, 0, 3]} intensity={0.3} color="#6366f1" />

      <CaseShell />
      <MotherboardModel />
    </>
  );
}
