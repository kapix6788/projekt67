// src/components/canvas/RAMModel.tsx — Kości RAM z paskiem LED RGB
'use client';

import { useBuildStore } from '@/store/useBuildStore';
import * as THREE from 'three';

const RAM_SLOT_POSITIONS: [number, number, number][] = [
  [0.5, 0.3, 0.05],
  [0.57, 0.3, 0.05],
  [0.64, 0.3, 0.05],
  [0.71, 0.3, 0.05],
];

export default function RAMModel() {
  const ram = useBuildStore((s) => s.selectedRAM);
  const rgbColor = useBuildStore((s) => s.rgbColor);

  if (!ram) return null;

  const sticksToRender = ram.sticks;
  // Przy 2 kościach → sloty 0, 2 (dual channel); przy 4 → wszystkie
  const slotIndices =
    sticksToRender === 2 ? [0, 2] : sticksToRender === 4 ? [0, 1, 2, 3] : [0];

  return (
    <group>
      {slotIndices.map((slotIdx) => {
        const pos = RAM_SLOT_POSITIONS[slotIdx];
        return (
          <group key={slotIdx} position={pos}>
            {/* Kość RAM — PCB */}
            <mesh castShadow>
              <boxGeometry args={[0.04, 0.4, 0.008]} />
              <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.6} />
            </mesh>
            {/* Chipy na PCB */}
            {[-0.1, -0.02, 0.06, 0.14].map((yOff, i) => (
              <mesh key={i} position={[0, yOff, 0.005]}>
                <boxGeometry args={[0.03, 0.05, 0.003]} />
                <meshStandardMaterial color="#111" />
              </mesh>
            ))}
            {/* Heatspreader */}
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.045, 0.38, 0.012]} />
              <meshStandardMaterial color="#2a2a3e" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Pasek LED RGB na górze — świecący */}
            <mesh position={[0, 0.21, 0]}>
              <boxGeometry args={[0.042, 0.03, 0.013]} />
              <meshStandardMaterial
                color={rgbColor}
                emissive={new THREE.Color(rgbColor)}
                emissiveIntensity={2.5}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
