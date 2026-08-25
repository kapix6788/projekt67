// src/data/catalog.ts — Katalog dostępnych komponentów PC
import type { GPUItem, MotherboardItem } from '@/types/pc';

export const GPU_CATALOG: GPUItem[] = [
  {
    id: 'rtx-4070-dual',
    name: 'RTX 4070 Dual Fan',
    price: 2800,
    color: '#2d2d3f',
    dimensions: [1.2, 0.3, 0.5],
    length_mm: 300,
    tdp: 200,
    fan_count: 2,
  },
  {
    id: 'rtx-4080-triple',
    name: 'RTX 4080 Triple Fan',
    price: 4500,
    color: '#1e1e30',
    dimensions: [1.5, 0.35, 0.55],
    length_mm: 340,
    tdp: 320,
    fan_count: 3,
  },
];

export const MOTHERBOARD_CATALOG: MotherboardItem[] = [
  {
    id: 'b650-atx',
    name: 'B650 ATX Gaming',
    price: 890,
    color: '#1a1a2e',
    dimensions: [1.6, 1.8, 0.08],
    form_factor: 'ATX',
    socket: 'AM5',
    ram_type: 'DDR5',
  },
];
