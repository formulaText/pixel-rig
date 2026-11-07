// Independent streams: world generation and runtime expressions never consume each other.
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
let source: (() => number) | null = null;
export const random = () => source ? source() : Math.random();
export function seedRuntime(seed: number | null) { source = seed === null ? null : mulberry32(seed); }
