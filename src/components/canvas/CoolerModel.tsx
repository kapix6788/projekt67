// src/components/canvas/CoolerModel.tsx — Chłodzenie CPU: wieżowe lub AIO
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBuildStore } from '@/store/useBuildStore';
import * as THREE from 'three';

// ── Pozycja CPU socketa względem płyty (musi się zgadzać z PCScene) ──
const CPU_POS: [number, number, number] = [0, 0.3, 0.05];

// ── Wentylator wielokrotnego użytku ─────────────────────────────────
function SpinningFan({
  position,
  radius = 0.18,
  speed = 12,
  rgbRim = false,
}: {
  position: [number, number, number];
  radius?: number;
  speed?: number;
  rgbRim?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const rgbColor = useBuildStore((s) => s.rgbColor);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z -= delta * speed;
    }
  });

  return (
    <group position={position}>
      {/* Obręcz */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.01, 8, 32]} />
        {rgbRim ? (
          <meshStandardMaterial
            color={rgbColor}
            emissive={new THREE.Color(rgbColor)}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial color="#444" metalness={0.6} roughness={0.3} />
        )}
      </mesh>
      {/* Obracające się łopatki */}
      <group ref={groupRef}>
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 7;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius * 0.6,
                0,
                Math.sin(angle) * radius * 0.6,
              ]}
              rotation={[0.4, angle, 0]}
            >
              <boxGeometry args={[radius * 0.5, 0.006, 0.018]} />
              <meshStandardMaterial color="#555" />
            </mesh>
          );
        })}
        {/* Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[radius * 0.15, radius * 0.15, 0.015, 12]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// ── Chłodzenie wieżowe ──────────────────────────────────────────────
function AirCooler() {
  const cooler = useBuildStore((s) => s.selectedCooler);
  if (!cooler || cooler.type !== 'air') return null;

  const [w, h, d] = cooler.dimensions;

  return (
    <group position={[CPU_POS[0], CPU_POS[1], CPU_POS[2] + 0.05]}>
      {/* Podstawa (kontakt z CPU) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.25, 0.25, 0.02]} />
        <meshStandardMaterial color="#aaa" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Heatpipes */}
      {[-0.06, -0.02, 0.02, 0.06].map((x, i) => (
        <mesh key={i} position={[x, 0, h / 2 * 0.5]}>
          <cylinderGeometry args={[0.012, 0.012, h * 0.7, 8]} />
          <meshStandardMaterial color="#c07030" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Radiator (żeberka) */}
      <group position={[0, 0, h * 0.45]}>
        {Array.from({ length: 18 }).map((_, i) => (
          <mesh key={i} position={[0, -w / 2 + (i * w) / 17, 0]}>
            <boxGeometry args={[d * 0.85, 0.005, h * 0.55]} />
            <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
      </group>
      {/* Wentylator na radiatora */}
      <SpinningFan
        position={[0, d * 0.5, h * 0.45]}
        radius={w * 0.42}
        rgbRim
      />
      {/* Drugi wentylator (jeśli dual fan) */}
      {cooler.fan_count >= 2 && (
        <SpinningFan
          position={[0, -d * 0.5, h * 0.45]}
          radius={w * 0.42}
          rgbRim
        />
      )}
    </group>
  );
}

// ── Chłodzenie AIO ──────────────────────────────────────────────────
function AIOCooler() {
  const cooler = useBuildStore((s) => s.selectedCooler);
  const caseItem = useBuildStore((s) => s.selectedCase);
  const rgbColor = useBuildStore((s) => s.rgbColor);

  // Proceduralna geometria węży AIO — CubicBezierCurve3 + TubeGeometry
  const tubeGeometries = useMemo(() => {
    if (!cooler || cooler.type !== 'aio') return null;

    const caseH = caseItem.dimensions[1];
    // Pozycja bloku na CPU (w przestrzeni płyty)
    const pumpWorldY = CPU_POS[1];
    const pumpWorldZ = CPU_POS[2] + 0.08;
    // Pozycja radiatora na topie obudowy (w przestrzeni globalnej — ale renderujemy względem grupy płyty)
    // Radiator montowany jest na topie obudowy → y = caseH/2, przeniesione do local space płyty
    const moboOffsetY = 0.15; // offset grupy płyty głównej
    const radLocalY = caseH / 2 - moboOffsetY - 0.1;
    const radLocalZ = -0.95 + 0.3; // przybliżona pozycja Z radiatora w local space

    // Lewy wąż
    const curveL = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.08, pumpWorldY, pumpWorldZ),
      new THREE.Vector3(-0.15, pumpWorldY + 0.5, pumpWorldZ + 0.3),
      new THREE.Vector3(-0.2, radLocalY - 0.3, radLocalZ),
      new THREE.Vector3(-0.15, radLocalY, radLocalZ)
    );
    // Prawy wąż
    const curveR = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.08, pumpWorldY, pumpWorldZ),
      new THREE.Vector3(0.15, pumpWorldY + 0.5, pumpWorldZ + 0.3),
      new THREE.Vector3(0.2, radLocalY - 0.3, radLocalZ),
      new THREE.Vector3(0.15, radLocalY, radLocalZ)
    );

    const tubeL = new THREE.TubeGeometry(curveL, 32, 0.018, 8, false);
    const tubeR = new THREE.TubeGeometry(curveR, 32, 0.018, 8, false);

    return { tubeL, tubeR, radLocalY, radLocalZ };
  }, [cooler, caseItem]);

  if (!cooler || cooler.type !== 'aio' || !tubeGeometries) return null;

  const { tubeL, tubeR, radLocalY, radLocalZ } = tubeGeometries;
  const fanCount = cooler.fan_count;
  const radWidth = fanCount === 3 ? 1.8 : 1.2;

  return (
    <group>
      {/* ── Blokopompka na CPU ──────────────────────────────── */}
      <group position={[CPU_POS[0], CPU_POS[1], CPU_POS[2] + 0.05]}>
        {/* Blok */}
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 24]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Logo / LED na bloku */}
        <mesh position={[0, 0.031, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.005, 16]} />
          <meshStandardMaterial
            color={rgbColor}
            emissive={new THREE.Color(rgbColor)}
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ── Węże ────────────────────────────────────────────── */}
      <mesh geometry={tubeL}>
        <meshStandardMaterial color="#111" metalness={0.3} roughness={0.8} />
      </mesh>
      <mesh geometry={tubeR}>
        <meshStandardMaterial color="#111" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* ── Radiator na topie obudowy ───────────────────────── */}
      <group position={[0, radLocalY, radLocalZ]}>
        {/* Korpus radiatora */}
        <mesh>
          <boxGeometry args={[radWidth, 0.06, 0.4]} />
          <meshStandardMaterial color="#222" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Żeberka */}
        {Array.from({ length: Math.floor(radWidth / 0.05) }).map((_, i) => (
          <mesh key={i} position={[-radWidth / 2 + 0.025 + i * 0.05, 0, 0]}>
            <boxGeometry args={[0.003, 0.06, 0.38]} />
            <meshStandardMaterial color="#333" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
        {/* Wentylatory na radiatorze */}
        {Array.from({ length: fanCount }).map((_, i) => {
          const spacing = radWidth / fanCount;
          const xPos = -radWidth / 2 + spacing / 2 + i * spacing;
          return (
            <SpinningFan
              key={i}
              position={[xPos, -0.05, 0]}
              radius={spacing * 0.4}
              rgbRim
            />
          );
        })}
      </group>
    </group>
  );
}

// ── Eksport główny ──────────────────────────────────────────────────
export default function CoolerModel() {
  return (
    <>
      <AirCooler />
      <AIOCooler />
    </>
  );
}
