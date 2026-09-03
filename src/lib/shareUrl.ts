// src/lib/shareUrl.ts — Serializacja / deserializacja buildu w parametrach URL
import {
  MOTHERBOARD_CATALOG,
  CPU_CATALOG,
  GPU_CATALOG,
  RAM_CATALOG,
  COOLER_CATALOG,
} from '@/data/catalog';
import { useBuildStore } from '@/store/useBuildStore';

// ── Klucze parametrów URL ────────────────────────────────────────────
const PARAM_KEYS = {
  mobo: 'mobo',
  cpu: 'cpu',
  gpu: 'gpu',
  ram: 'ram',
  cooler: 'cooler',
  rgb: 'rgb',
} as const;

// ── Encode: stan → URL string ────────────────────────────────────────
/** Generuje pełny URL z aktualnymi parametrami konfiguracji. */
export function encodeBuildToUrl(): string {
  const state = useBuildStore.getState();
  const params = new URLSearchParams();

  if (state.selectedMotherboard) params.set(PARAM_KEYS.mobo, state.selectedMotherboard.id);
  if (state.selectedCPU) params.set(PARAM_KEYS.cpu, state.selectedCPU.id);
  if (state.selectedGPU) params.set(PARAM_KEYS.gpu, state.selectedGPU.id);
  if (state.selectedRAM) params.set(PARAM_KEYS.ram, state.selectedRAM.id);
  if (state.selectedCooler) params.set(PARAM_KEYS.cooler, state.selectedCooler.id);
  if (state.rgbColor !== '#6366f1') params.set(PARAM_KEYS.rgb, state.rgbColor.replace('#', ''));

  const query = params.toString();
  const base = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return query ? `${base}?${query}` : base;
}

// ── Decode: URL params → ustawienie stanu ────────────────────────────
/**
 * Odczytuje parametry URL i ustawia stan w `useBuildStore`.
 * Respektuje zasady kompatybilności:
 *  - Mobo musi pasować do obudowy (form factor)
 *  - CPU musi mieć ten sam socket co mobo
 *  - RAM musi być tego samego typu co mobo
 *  - GPU musi mieścić się w obudowie
 *  - Cooler wymaga CPU
 */
export function decodeBuildFromUrl(searchParams: URLSearchParams): void {
  const store = useBuildStore.getState();
  const selectedCase = store.selectedCase;

  // 1. Płyta główna — musi pasować do obudowy
  const moboId = searchParams.get(PARAM_KEYS.mobo);
  const mobo = moboId ? MOTHERBOARD_CATALOG.find((m) => m.id === moboId) ?? null : null;

  if (mobo && !selectedCase.supported_form_factors.includes(mobo.form_factor)) {
    // Niekompatybilna płyta — ignoruj cały build
    return;
  }

  if (mobo) store.setMotherboard(mobo);

  // 2. Procesor — socket musi się zgadzać z mobo
  const cpuId = searchParams.get(PARAM_KEYS.cpu);
  const cpu = cpuId ? CPU_CATALOG.find((c) => c.id === cpuId) ?? null : null;

  if (cpu && mobo && cpu.socket === mobo.socket) {
    store.setCPU(cpu);
  }

  // 3. RAM — typ musi się zgadzać z mobo
  const ramId = searchParams.get(PARAM_KEYS.ram);
  const ram = ramId ? RAM_CATALOG.find((r) => r.id === ramId) ?? null : null;

  if (ram && mobo && ram.type === mobo.ram_type) {
    store.setRAM(ram);
  }

  // 4. GPU — długość karty musi się mieścić w obudowie
  const gpuId = searchParams.get(PARAM_KEYS.gpu);
  const gpu = gpuId ? GPU_CATALOG.find((g) => g.id === gpuId) ?? null : null;

  if (gpu && mobo && gpu.length_mm <= selectedCase.max_gpu_length_mm) {
    store.setGPU(gpu);
  }

  // 5. Cooler — wymaga zamontowanego CPU
  const coolerId = searchParams.get(PARAM_KEYS.cooler);
  const cooler = coolerId ? COOLER_CATALOG.find((c) => c.id === coolerId) ?? null : null;

  if (cooler && cpu && mobo && cpu.socket === mobo.socket) {
    store.setCooler(cooler);
  }

  // 6. RGB kolor
  const rgbHex = searchParams.get(PARAM_KEYS.rgb);
  if (rgbHex && /^[0-9a-fA-F]{6}$/.test(rgbHex)) {
    store.setRGBColor(`#${rgbHex}`);
  }
}
