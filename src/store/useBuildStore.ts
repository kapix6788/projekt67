// src/store/useBuildStore.ts — Globalny stan konfiguratora PC (Zustand)
import { create } from 'zustand';
import type { BuildState, CaseItem, GPUItem, MotherboardItem } from '@/types/pc';

// ── Domyślna obudowa ──────────────────────────────────────────────────
const DEFAULT_CASE: CaseItem = {
  id: 'case-mid-tower',
  name: 'Mid Tower ATX',
  price: 350,
  color: '#1a1a2e',
  dimensions: [2.4, 5, 2.2],          // jednostki sceny Three.js
  max_gpu_length_mm: 380,
  supported_form_factors: ['ATX', 'mATX', 'ITX'],
};

// ── Store ─────────────────────────────────────────────────────────────
export const useBuildStore = create<BuildState>((set, get) => ({
  selectedCase: DEFAULT_CASE,
  selectedMotherboard: null,
  selectedGPU: null,

  setMotherboard: (mobo: MotherboardItem | null) => set({ selectedMotherboard: mobo }),
  setGPU: (gpu: GPUItem | null) => set({ selectedGPU: gpu }),

  getTotalPrice: () => {
    const s = get();
    let total = s.selectedCase.price;
    if (s.selectedMotherboard) total += s.selectedMotherboard.price;
    if (s.selectedGPU) total += s.selectedGPU.price;
    return total;
  },
}));
