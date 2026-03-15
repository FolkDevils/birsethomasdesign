import { SKEW } from "./constants";

export function clipAt(p: number) {
  const r = p * (100 + SKEW);
  const l = r - SKEW;
  return `polygon(${l}% 100%, ${r}% 0%, -${SKEW}% 0%, -${SKEW * 2}% 100%)`;
}

export function lerpPoints(a: string, b: string, t: number) {
  const pa = a.split(/[\s,]+/).map(Number);
  const pb = b.split(/[\s,]+/).map(Number);
  return pa.map((v, i) => v + (pb[i] - v) * t).join(",");
}
