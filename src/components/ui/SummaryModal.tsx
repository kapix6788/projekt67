// src/components/ui/SummaryModal.tsx — Modal podsumowania konfiguracji + schowek + afiliacja
'use client';

import { useState, useCallback } from 'react';
import { useBuildStore } from '@/store/useBuildStore';
import { encodeBuildToUrl } from '@/lib/shareUrl';

// ── Typ pozycji na liście podsumowania ───────────────────────────────
interface SummaryLine {
  category: string;
  name: string;
  price: number;
  affiliateUrl: string;
}

// ── Komponent: Modal ────────────────────────────────────────────────
export default function SummaryModal({ onClose }: { onClose: () => void }) {
  const selectedCase = useBuildStore((s) => s.selectedCase);
  const selectedMotherboard = useBuildStore((s) => s.selectedMotherboard);
  const selectedCPU = useBuildStore((s) => s.selectedCPU);
  const selectedGPU = useBuildStore((s) => s.selectedGPU);
  const selectedRAM = useBuildStore((s) => s.selectedRAM);
  const selectedCooler = useBuildStore((s) => s.selectedCooler);
  const getTotalPrice = useBuildStore((s) => s.getTotalPrice);
  const getTotalTDP = useBuildStore((s) => s.getTotalTDP);

  const [copySpecLabel, setCopySpecLabel] = useState('📋 Kopiuj specyfikację');
  const [copyLinkLabel, setCopyLinkLabel] = useState('🔗 Skopiuj link do buildu');

  // ── Buduj listę ─────────────────────────────────────────────────
  const lines: SummaryLine[] = [];

  lines.push({ category: 'Obudowa', name: selectedCase.name, price: selectedCase.price, affiliateUrl: selectedCase.affiliateUrl });
  if (selectedMotherboard) lines.push({ category: 'Płyta główna', name: selectedMotherboard.name, price: selectedMotherboard.price, affiliateUrl: selectedMotherboard.affiliateUrl });
  if (selectedCPU) lines.push({ category: 'Procesor', name: selectedCPU.name, price: selectedCPU.price, affiliateUrl: selectedCPU.affiliateUrl });
  if (selectedCooler) lines.push({ category: 'Chłodzenie', name: selectedCooler.name, price: selectedCooler.price, affiliateUrl: selectedCooler.affiliateUrl });
  if (selectedRAM) lines.push({ category: 'Pamięć RAM', name: selectedRAM.name, price: selectedRAM.price, affiliateUrl: selectedRAM.affiliateUrl });
  if (selectedGPU) lines.push({ category: 'Karta graficzna', name: selectedGPU.name, price: selectedGPU.price, affiliateUrl: selectedGPU.affiliateUrl });

  const totalPrice = getTotalPrice();
  const totalTDP = getTotalTDP();
  const shareUrl = encodeBuildToUrl();

  // ── Formatowana specyfikacja do schowka ─────────────────────────
  const buildSpecText = useCallback(() => {
    const header = '═══ PC Build ═══';
    const parts = lines
      .map((l) => `▸ ${l.category}: ${l.name} — ${l.price.toLocaleString('pl-PL')} zł`)
      .join('\n');
    const footer = [
      `─────────────────`,
      `💰 Łączna cena: ${totalPrice.toLocaleString('pl-PL')} zł`,
      `⚡ Pobór mocy: ${totalTDP} W`,
      `🔗 Odtwórz build: ${shareUrl}`,
    ].join('\n');

    return `${header}\n${parts}\n${footer}`;
  }, [lines, totalPrice, totalTDP, shareUrl]);

  // ── Kopiuj specyfikację ─────────────────────────────────────────
  const handleCopySpec = async () => {
    try {
      await navigator.clipboard.writeText(buildSpecText());
      setCopySpecLabel('✅ Skopiowano!');
      setTimeout(() => setCopySpecLabel('📋 Kopiuj specyfikację'), 2000);
    } catch {
      setCopySpecLabel('❌ Błąd kopiowania');
      setTimeout(() => setCopySpecLabel('📋 Kopiuj specyfikację'), 2000);
    }
  };

  // ── Kopiuj link ─────────────────────────────────────────────────
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyLinkLabel('✅ Skopiowano!');
      setTimeout(() => setCopyLinkLabel('🔗 Skopiuj link do buildu'), 2000);
    } catch {
      setCopyLinkLabel('❌ Błąd kopiowania');
      setTimeout(() => setCopyLinkLabel('🔗 Skopiuj link do buildu'), 2000);
    }
  };

  return (
    // ── Overlay ───────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* ── Panel ──────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-lg mx-4 bg-[#12122a] border border-white/10
                    rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white tracking-tight">
            <span className="text-indigo-400">⬡</span> Podsumowanie zestawu
          </h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* ── Lista komponentów ───────────────────────────────── */}
        <div className="px-6 py-4 space-y-3 max-h-[50vh] overflow-y-auto">
          {lines.map((line) => (
            <div
              key={line.category}
              className="flex items-center justify-between gap-3 py-2 border-b border-white/[0.04] last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-white/30">{line.category}</p>
                <p className="text-sm text-white/80 truncate">{line.name}</p>
              </div>

              <span className="text-sm font-semibold text-white/60 whitespace-nowrap">
                {line.price.toLocaleString('pl-PL')} zł
              </span>

              <a
                href={line.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium
                           bg-indigo-500/20 border border-indigo-500/40 text-indigo-300
                           hover:bg-indigo-500/30 transition-colors whitespace-nowrap"
              >
                Kup&nbsp;→
              </a>
            </div>
          ))}
        </div>

        {/* ── Stopka: sumy ──────────────────────────────────── */}
        <div className="px-6 py-3 bg-white/[0.03] border-t border-white/[0.06] space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Pobór mocy</span>
            <span className="font-semibold text-amber-400">{totalTDP} W</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-white/40">Łączna cena</span>
            <span className="font-bold text-white">
              {totalPrice.toLocaleString('pl-PL')} <span className="text-sm text-white/50">zł</span>
            </span>
          </div>
        </div>

        {/* ── Akcje ─────────────────────────────────────────── */}
        <div className="px-6 py-4 flex flex-col gap-2 border-t border-white/[0.06]">
          <button
            onClick={handleCopySpec}
            className="w-full py-2.5 rounded-lg text-sm font-medium
                       bg-white/[0.06] border border-white/10 text-white/70
                       hover:bg-white/[0.1] transition-colors"
          >
            {copySpecLabel}
          </button>
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-lg text-sm font-medium
                       bg-indigo-500/20 border border-indigo-500/40 text-indigo-300
                       hover:bg-indigo-500/30 transition-colors"
          >
            {copyLinkLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
