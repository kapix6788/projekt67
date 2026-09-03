// src/components/ui/BuildUrlLoader.tsx — Odczyt parametrów URL i hydratacja stanu buildu
'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeBuildFromUrl } from '@/lib/shareUrl';

/**
 * Komponent renderowany w `<Suspense>` — bezpiecznie używa `useSearchParams()`
 * bez blokowania SSR. Odczytuje parametry URL jednorazowo po zamontowaniu
 * i ustawia odpowiedni stan w `useBuildStore`.
 */
export function BuildUrlLoader() {
  const searchParams = useSearchParams();
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    if (!searchParams || searchParams.toString() === '') return;

    hasLoaded.current = true;
    decodeBuildFromUrl(searchParams);
  }, [searchParams]);

  // Komponent nie renderuje niczego — służy wyłącznie do side-effectu
  return null;
}
