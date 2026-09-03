// src/types/pc.ts — Typy danych dla konfiguratora PC

export interface CaseItem {
  id: string;
  name: string;
  price: number;
  color: string;
  dimensions: [number, number, number]; // [w, h, d] w jednostkach sceny Three.js
  max_gpu_length_mm: number;
  supported_form_factors: FormFactor[];
  affiliateUrl: string;
}

export type FormFactor = 'ATX' | 'mATX' | 'ITX';
export type RAMType = 'DDR4' | 'DDR5';
export type CoolerType = 'air' | 'aio';

export interface MotherboardItem {
  id: string;
  name: string;
  price: number;
  color: string;
  dimensions: [number, number, number];
  form_factor: FormFactor;
  socket: string;
  ram_type: RAMType;
  tdp: number;
  affiliateUrl: string;
}

export interface CPUItem {
  id: string;
  name: string;
  price: number;
  color: string;
  dimensions: [number, number, number];
  socket: string;
  tdp: number;
  cores: number;
  clock_ghz: number;
  affiliateUrl: string;
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
  affiliateUrl: string;
}

export interface RAMItem {
  id: string;
  name: string;
  price: number;
  color: string;
  dimensions: [number, number, number];
  type: RAMType;
  capacity_gb: number;
  speed_mhz: number;
  sticks: number;
  affiliateUrl: string;
}

export interface CoolerItem {
  id: string;
  name: string;
  price: number;
  color: string;
  dimensions: [number, number, number];
  type: CoolerType;
  height_mm: number;
  tdp: number;
  fan_count: number;
  affiliateUrl: string;
}

export interface BuildState {
  selectedCase: CaseItem;
  selectedMotherboard: MotherboardItem | null;
  selectedCPU: CPUItem | null;
  selectedGPU: GPUItem | null;
  selectedRAM: RAMItem | null;
  selectedCooler: CoolerItem | null;
  rgbColor: string;

  setMotherboard: (mobo: MotherboardItem | null) => void;
  setCPU: (cpu: CPUItem | null) => void;
  setGPU: (gpu: GPUItem | null) => void;
  setRAM: (ram: RAMItem | null) => void;
  setCooler: (cooler: CoolerItem | null) => void;
  setRGBColor: (color: string) => void;
  getTotalPrice: () => number;
  getTotalTDP: () => number;
}
