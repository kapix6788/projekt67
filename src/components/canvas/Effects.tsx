// src/components/canvas/Effects.tsx — Postprocessing: Bloom
'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={1}
        luminanceSmoothing={0.4}
        intensity={1.2}
        mipmapBlur
      />
    </EffectComposer>
  );
}
