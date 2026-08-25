// src/types/pc.ts — Typy danych dla konfiguratora PC

export interface Dimensions {
  width: number;   // mm
  height: number;  // mm
  depth: number;   // mm
}

export interface CaseItem {
  id: string;
  name: string;
  price: number;
  color: string;
  dimensions: [number, number, number]; // [width, height, depth] w jednostkach sceny (Three.js)
  max_gpu_length_mm: number;
  supported_form_factors: ('ATX' | 'mATX' | 'ITX')[];
}

export interface MotherboardItem {
  id: string;
  name: string;
  price: number;
  color: string;
  dimensions: [number, number, number];
  form_factor: 'ATX' | 'mATX' | 'ITX';
  socket: string;
  ram_type: 'DDR4' | 'DDR5';
}

export interface GPUItem {
  id: string;
  name: string;
  price: number;
  color: string;
  dimensions: [number, number, number];
  length_mm: number;
  tdp: number;
  fan_count: number;
}

export interface BuildState {
  selectedCase: CaseItem;
  selectedMotherboard: MotherboardItem | null;
  selectedGPU: GPUItem | null;

  setMotherboard: (mobo: MotherboardItem | null) => void;
  setGPU: (gpu: GPUItem | null) => void;
  getTotalPrice: () => number;
}
