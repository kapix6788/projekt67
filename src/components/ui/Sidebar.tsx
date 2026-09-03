// src/components/ui/Sidebar.tsx — Rozbudowany panel konfiguracji
'use client';

import { useState } from 'react';
import { useBuildStore } from '@/store/useBuildStore';
import SummaryModal from '@/components/ui/SummaryModal';
import {
  MOTHERBOARD_CATALOG,
  CPU_CATALOG,
  GPU_CATALOG,
  RAM_CATALOG,
  COOLER_CATALOG,
  RGB_PRESETS,
} from '@/data/catalog';
import type {
  MotherboardItem,
  CPUItem,
  GPUItem,
  RAMItem,
  CoolerItem,
} from '@/types/pc';

// ── Sekcja akordeonowa ──────────────────────────────────────────────
function Section({
  title,
  badge,
  children,
  defaultOpen = false,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border-b border-white/[0.06]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3
                   text-xs font-medium uppercase tracking-widest text-white/30
                   hover:text-white/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          {title}
          {badge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 normal-case tracking-normal">
              {badge}
            </span>
          )}
        </span>
        <span className="text-white/20 text-sm">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="px-5 pb-4 space-y-2">{children}</div>}
    </section>
  );
}

// ── Przycisk wyboru komponentu ───────────────────────────────────────
function PartButton({
  label,
  sublabel,
  price,
  isActive,
  accentClass,
  onClick,
}: {
  label: string;
  sublabel: string;
  price: number;
  isActive: boolean;
  accentClass: { bg: string; border: string; text: string; shadow: string; badge: string };
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200
                 text-sm font-medium border relative
                 ${isActive
                   ? `${accentClass.bg} ${accentClass.border} ${accentClass.text} ${accentClass.shadow}`
                   : 'bg-white/[0.03] border-white/[0.06] text-white/70 hover:bg-white/[0.06] hover:border-white/[0.12]'
                 }`}
    >
      <div className="flex justify-between items-center">
        <span className="truncate pr-2">{label}</span>
        <span className={`text-xs whitespace-nowrap ${isActive ? accentClass.badge : 'text-white/40'}`}>
          {sublabel}
        </span>
      </div>
      <div className="flex justify-end items-center mt-1">
        <span className={`font-semibold ${isActive ? accentClass.text : 'text-white/50'}`}>
          {price.toLocaleString('pl-PL')} zł
        </span>
      </div>
    </button>
  );
}

// ── Przycisk usuwania ───────────────────────────────────────────────
function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-center px-4 py-2 rounded-lg text-xs
                 bg-red-500/10 border border-red-500/20 text-red-400
                 hover:bg-red-500/20 transition-all duration-200"
    >
      ✕ {label}
    </button>
  );
}

// ── Klasy akcentów per kategoria ─────────────────────────────────────
const ACCENT = {
  mobo: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/50',
    text: 'text-emerald-300',
    shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    badge: 'text-emerald-400',
  },
  cpu: {
    bg: 'bg-sky-500/20',
    border: 'border-sky-500/50',
    text: 'text-sky-300',
    shadow: 'shadow-[0_0_20px_rgba(14,165,233,0.15)]',
    badge: 'text-sky-400',
  },
  cooler: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/50',
    text: 'text-cyan-300',
    shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    badge: 'text-cyan-400',
  },
  ram: {
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/50',
    text: 'text-violet-300',
    shadow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]',
    badge: 'text-violet-400',
  },
  gpu: {
    bg: 'bg-indigo-500/20',
    border: 'border-indigo-500/50',
    text: 'text-indigo-300',
    shadow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    badge: 'text-indigo-400',
  },
} as const;

// ── Sidebar ─────────────────────────────────────────────────────────
export default function Sidebar() {
  const selectedMotherboard = useBuildStore((s) => s.selectedMotherboard);
  const selectedCPU = useBuildStore((s) => s.selectedCPU);
  const selectedGPU = useBuildStore((s) => s.selectedGPU);
  const selectedRAM = useBuildStore((s) => s.selectedRAM);
  const selectedCooler = useBuildStore((s) => s.selectedCooler);
  const rgbColor = useBuildStore((s) => s.rgbColor);
  const selectedCase = useBuildStore((s) => s.selectedCase);

  const setMotherboard = useBuildStore((s) => s.setMotherboard);
  const setCPU = useBuildStore((s) => s.setCPU);
  const setGPU = useBuildStore((s) => s.setGPU);
  const setRAM = useBuildStore((s) => s.setRAM);
  const setCooler = useBuildStore((s) => s.setCooler);
  const setRGBColor = useBuildStore((s) => s.setRGBColor);
  const getTotalPrice = useBuildStore((s) => s.getTotalPrice);
  const getTotalTDP = useBuildStore((s) => s.getTotalTDP);

  const [showSummary, setShowSummary] = useState(false);

  // ── Handlery toggle ──────────────────────────────────────────────
  const toggleMotherboard = (mobo: MotherboardItem) => {
    setMotherboard(selectedMotherboard?.id === mobo.id ? null : mobo);
  };
  const toggleCPU = (cpu: CPUItem) => {
    setCPU(selectedCPU?.id === cpu.id ? null : cpu);
  };
  const toggleGPU = (gpu: GPUItem) => {
    setGPU(selectedGPU?.id === gpu.id ? null : gpu);
  };
  const toggleRAM = (ram: RAMItem) => {
    setRAM(selectedRAM?.id === ram.id ? null : ram);
  };
  const toggleCooler = (cooler: CoolerItem) => {
    setCooler(selectedCooler?.id === cooler.id ? null : cooler);
  };

  // ── Przefiltrowane listy kompatybilnych komponentów ─────────────────
  const compatibleMobos = MOTHERBOARD_CATALOG.filter((mobo) =>
    selectedCase.supported_form_factors.includes(mobo.form_factor),
  );

  const compatibleCPUs = selectedMotherboard
    ? CPU_CATALOG.filter((cpu) => cpu.socket === selectedMotherboard.socket)
    : [];

  const compatibleRAM = selectedMotherboard
    ? RAM_CATALOG.filter((ram) => ram.type === selectedMotherboard.ram_type)
    : [];

  const compatibleGPUs = selectedMotherboard
    ? GPU_CATALOG.filter((gpu) => gpu.length_mm <= selectedCase.max_gpu_length_mm)
    : [];

  const compatibleCoolers = selectedCPU ? COOLER_CATALOG : [];

  // ── Komunikat zastępczy ────────────────────────────────────────────
  const DependencyHint = ({ text }: { text: string }) => (
    <p className="text-xs text-white/25 italic py-2">{text}</p>
  );

  return (
    <aside className="fixed right-0 top-0 h-full w-[340px] z-50 flex flex-col
                      bg-[#0c0c18]/90 backdrop-blur-xl border-l border-white/[0.06]
                      text-white overflow-y-auto">

      {/* ── Nagłówek ─────────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-4 border-b border-white/[0.06]">
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-indigo-400">⬡</span> PC Configurator
        </h1>
        <p className="text-xs text-white/40 mt-1">
          Kliknij komponent, aby zamontować go w obudowie
        </p>
      </div>

      {/* ── Płyta główna ─────────────────────────────────────── */}
      <Section title="Płyta główna" badge={selectedMotherboard?.socket} defaultOpen>
        {compatibleMobos.map((mobo) => (
          <PartButton
            key={mobo.id}
            label={mobo.name}
            sublabel={`${mobo.form_factor} · ${mobo.socket} · ${mobo.ram_type}`}
            price={mobo.price}
            isActive={selectedMotherboard?.id === mobo.id}
            accentClass={ACCENT.mobo}
            onClick={() => toggleMotherboard(mobo)}
          />
        ))}
        {selectedMotherboard && <RemoveButton onClick={() => setMotherboard(null)} label="Usuń płytę" />}
      </Section>

      {/* ── Procesor ─────────────────────────────────────────── */}
      <Section title="Procesor" badge={selectedCPU ? `${selectedCPU.tdp}W` : undefined}>
        {!selectedMotherboard ? (
          <DependencyHint text="Wybierz najpierw płytę główną, aby zobaczyć pasujące procesory" />
        ) : (
          compatibleCPUs.map((cpu) => (
            <PartButton
              key={cpu.id}
              label={cpu.name}
              sublabel={`${cpu.socket} · ${cpu.cores}C · ${cpu.clock_ghz}GHz`}
              price={cpu.price}
              isActive={selectedCPU?.id === cpu.id}
              accentClass={ACCENT.cpu}
              onClick={() => toggleCPU(cpu)}
            />
          ))
        )}
        {selectedCPU && <RemoveButton onClick={() => setCPU(null)} label="Usuń CPU" />}
      </Section>

      {/* ── Chłodzenie CPU ───────────────────────────────────── */}
      <Section title="Chłodzenie" badge={selectedCooler?.type.toUpperCase()}>
        {!selectedCPU ? (
          <DependencyHint text="Wybierz najpierw procesor, aby zobaczyć pasujące chłodzenia" />
        ) : (
          compatibleCoolers.map((cooler) => (
            <PartButton
              key={cooler.id}
              label={cooler.name}
              sublabel={cooler.type === 'aio' ? 'Liquid' : 'Air'}
              price={cooler.price}
              isActive={selectedCooler?.id === cooler.id}
              accentClass={ACCENT.cooler}
              onClick={() => toggleCooler(cooler)}
            />
          ))
        )}
        {selectedCooler && <RemoveButton onClick={() => setCooler(null)} label="Usuń cooler" />}
      </Section>

      {/* ── Pamięć RAM ───────────────────────────────────────── */}
      <Section title="Pamięć RAM" badge={selectedRAM?.type}>
        {!selectedMotherboard ? (
          <DependencyHint text="Wybierz najpierw płytę główną, aby zobaczyć pasujące pamięci" />
        ) : (
          compatibleRAM.map((ram) => (
            <PartButton
              key={ram.id}
              label={ram.name}
              sublabel={`${ram.type} · ${ram.speed_mhz}MHz`}
              price={ram.price}
              isActive={selectedRAM?.id === ram.id}
              accentClass={ACCENT.ram}
              onClick={() => toggleRAM(ram)}
            />
          ))
        )}
        {selectedRAM && <RemoveButton onClick={() => setRAM(null)} label="Usuń RAM" />}
      </Section>

      {/* ── Karta graficzna ──────────────────────────────────── */}
      <Section title="Karta graficzna" badge={selectedGPU ? `${selectedGPU.tdp}W` : undefined}>
        {!selectedMotherboard ? (
          <DependencyHint text="Wybierz najpierw płytę główną, aby zobaczyć pasujące karty" />
        ) : (
          compatibleGPUs.map((gpu) => (
            <PartButton
              key={gpu.id}
              label={gpu.name}
              sublabel={`${gpu.fan_count} wentylatory · ${gpu.tdp}W`}
              price={gpu.price}
              isActive={selectedGPU?.id === gpu.id}
              accentClass={ACCENT.gpu}
              onClick={() => toggleGPU(gpu)}
            />
          ))
        )}
        {selectedGPU && <RemoveButton onClick={() => setGPU(null)} label="Usuń GPU" />}
      </Section>

      {/* ── RGB ──────────────────────────────────────────────── */}
      <Section title="Podświetlenie RGB" defaultOpen>
        <div className="flex items-center gap-2 flex-wrap">
          {RGB_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              onClick={() => setRGBColor(preset.hex)}
              title={preset.name}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200
                         hover:scale-110
                         ${rgbColor === preset.hex
                           ? 'border-white scale-110 shadow-[0_0_12px_var(--glow)]'
                           : 'border-white/10'
                         }`}
              style={{
                backgroundColor: preset.hex,
                '--glow': preset.hex,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </Section>

      {/* ── Spacer ───────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Pasek dolny: cena + TDP + przycisk podsumowania ──── */}
      <div className="px-5 py-4 border-t border-white/[0.06] bg-[#08081a]/80 space-y-3">
        {/* TDP */}
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-white/30">Pobór mocy</span>
          <span className="text-sm font-semibold text-amber-400">
            {getTotalTDP()} <span className="text-xs text-white/40">W</span>
          </span>
        </div>
        {/* Cena */}
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-white/30">Łączna cena</span>
          <span className="text-xl font-bold text-white">
            {getTotalPrice().toLocaleString('pl-PL')}{' '}
            <span className="text-sm text-white/50">zł</span>
          </span>
        </div>
        {/* Przycisk podsumowania */}
        <button
          onClick={() => setShowSummary(true)}
          className="w-full py-2.5 rounded-lg text-sm font-semibold
                     bg-indigo-500/20 border border-indigo-500/40 text-indigo-300
                     hover:bg-indigo-500/30 hover:border-indigo-500/60
                     transition-all duration-200"
        >
          Zatwierdź zestaw / Podsumowanie
        </button>
      </div>

      {/* ── Modal podsumowania ──────────────────────────────────── */}
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
    </aside>
  );
}
