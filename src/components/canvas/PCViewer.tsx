// src/components/canvas/PCViewer.tsx — Wrapper z Canvas + Effects (client-only)
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PCScene from './PCScene';
import Effects from './Effects';

export default function PCViewer() {
  return (
    <Canvas
      shadows
      camera={{ position: [4, 3, 5], fov: 45 }}
      gl={{ antialias: true, toneMapping: 3 /* ACESFilmicToneMapping */ }}
    >
      <color attach="background" args={['#08081a']} />
      <fog attach="fog" args={['#08081a', 12, 22]} />

      <Suspense fallback={null}>
        <PCScene />
        <Effects />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.4}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
