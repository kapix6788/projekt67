'use client';
// src/app/page.tsx — Strona główna: 3D Canvas + Sidebar + odczyt URL params
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/ui/Sidebar';
import { BuildUrlLoader } from '@/components/ui/BuildUrlLoader';

// PCViewer używa WebGL → ładujemy go wyłącznie po stronie klienta
const PCViewer = dynamic(() => import('@/components/canvas/PCViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-full bg-[#08081a]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-white/30 text-sm">Ładowanie sceny 3D…</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#08081a]">
      {/* Odczyt parametrów URL w Suspense — bezpieczne dla SSR */}
      <Suspense fallback={null}>
        <BuildUrlLoader />
      </Suspense>

      {/* Tło: canvas 3D na pełnym ekranie */}
      <div className="absolute inset-0 pr-[340px]">
        <PCViewer />
      </div>

      {/* Pływający panel boczny 2D */}
      <Sidebar />
    </main>
  );
}
