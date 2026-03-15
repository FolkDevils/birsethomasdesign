import { WIPE_ANGLE_DEG } from "./constants";

const TAN = Math.tan((WIPE_ANGLE_DEG * Math.PI) / 180);

/**
 * Returns the skew as a percentage of the element's width,
 * computed so the diagonal maintains a constant visual angle
 * regardless of aspect ratio.
 */
export function getSkewPct(w: number, h: number) {
  return (TAN * h) / w * 100;
}

export function clipAt(p: number, skew: number) {
  const r = p * (100 + skew);
  const l = r - skew;
  return `polygon(${l}% 100%, ${r}% 0%, -${skew}% 0%, -${skew * 2}% 100%)`;
}

export function lerpPoints(a: string, b: string, t: number) {
  const pa = a.split(/[\s,]+/).map(Number);
  const pb = b.split(/[\s,]+/).map(Number);
  return pa.map((v, i) => v + (pb[i] - v) * t).join(",");
}
