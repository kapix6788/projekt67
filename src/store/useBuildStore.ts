// src/store/useBuildStore.ts — Globalny stan konfiguratora PC (Zustand)
import { create } from 'zustand';
import type {
  BuildState,
  CaseItem,
  CPUItem,
  GPUItem,
  MotherboardItem,
  RAMItem,
  CoolerItem,
} from '@/types/pc';

// ── Domyślna obudowa ──────────────────────────────────────────────────
const DEFAULT_CASE: CaseItem = {
  id: 'case-mid-tower',
  name: 'Mid Tower ATX',
  price: 350,
  color: '#1a1a2e',
  dimensions: [2.4, 5, 2.2],
  max_gpu_length_mm: 380,
  supported_form_factors: ['ATX', 'mATX', 'ITX'],
  affiliateUrl: 'https://sklep.pl/obudowa-mid-tower-atx?ref=pcbuilder',
};

// ── Store ─────────────────────────────────────────────────────────────
export const useBuildStore = create<BuildState>((set, get) => ({
  selectedCase: DEFAULT_CASE,
  selectedMotherboard: null,
  selectedCPU: null,
  selectedGPU: null,
  selectedRAM: null,
  selectedCooler: null,
  rgbColor: '#6366f1',

  setMotherboard: (mobo: MotherboardItem | null) => {
    const state = get();
    // Resetuj RAM gdy nowa płyta ma inny standard
    const shouldResetRAM =
      mobo && state.selectedRAM && state.selectedRAM.type !== mobo.ram_type;
    // Resetuj CPU gdy nowa płyta ma inny socket
    const shouldResetCPU =
      mobo && state.selectedCPU && state.selectedCPU.socket !== mobo.socket;

    set({
      selectedMotherboard: mobo,
      ...(shouldResetRAM ? { selectedRAM: null } : {}),
      ...(shouldResetCPU ? { selectedCPU: null, selectedCooler: null } : {}),
      // Jeśli usuwamy płytę, demontujemy też CPU, RAM, Cooler i GPU
      ...(!mobo
        ? { selectedCPU: null, selectedRAM: null, selectedCooler: null, selectedGPU: null }
        : {}),
    });
  },

  setCPU: (cpu: CPUItem | null) => {
    set({
      selectedCPU: cpu,
      // Jeśli usuwamy CPU, demontujemy też Cooler
      ...(!cpu ? { selectedCooler: null } : {}),
    });
  },

  setGPU: (gpu: GPUItem | null) => set({ selectedGPU: gpu }),
  setRAM: (ram: RAMItem | null) => set({ selectedRAM: ram }),
  setCooler: (cooler: CoolerItem | null) => set({ selectedCooler: cooler }),
  setRGBColor: (color: string) => set({ rgbColor: color }),

  getTotalPrice: () => {
    const s = get();
    let total = s.selectedCase.price;
    if (s.selectedMotherboard) total += s.selectedMotherboard.price;
    if (s.selectedCPU) total += s.selectedCPU.price;
    if (s.selectedGPU) total += s.selectedGPU.price;
    if (s.selectedRAM) total += s.selectedRAM.price;
    if (s.selectedCooler) total += s.selectedCooler.price;
    return total;
  },

  getTotalTDP: () => {
    const s = get();
    let tdp = 0;
    if (s.selectedMotherboard) tdp += s.selectedMotherboard.tdp;
    if (s.selectedCPU) tdp += s.selectedCPU.tdp;
    if (s.selectedGPU) tdp += s.selectedGPU.tdp;
    if (s.selectedCooler) tdp += s.selectedCooler.tdp;
    return tdp;
  },
}));
