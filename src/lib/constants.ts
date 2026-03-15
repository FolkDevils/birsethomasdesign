export const NAV_ITEMS = ["HOME", "OFFICE", "PROJECTS", "CLIENTS", "CONTACT"] as const;

export const HERO_IMAGES = [
  "/images/hero/01.webp",
  "/images/hero/02.webp",
  "/images/hero/03.webp",
];

export const HOLD = 7;
export const WIPE = 2.5;
export const SKEW = 35;

/**
 * Each image is visible for 2 full cycles:
 *   Cycle 1: it wipes in (WIPE) then holds (HOLD)  = WIPE + HOLD
 *   Cycle 2: it sits behind while the next wipes over it (HOLD + WIPE)
 * Total visible time = 2*(HOLD+WIPE)
 * The zoom runs for this entire duration so it never stops while visible.
 */
export const ZOOM_FROM = 1;
export const ZOOM_TO = 1.2;
export const ZOOM_DUR = 2 * (HOLD + WIPE);
