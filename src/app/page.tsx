"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const NAV_ITEMS = ["HOME", "OFFICE", "PROJECTS", "CLIENTS", "CONTACT"];
const HERO_IMAGES = ["/images/hero/01.png", "/images/hero/02.png", "/images/hero/03.png"];
const HOLD = 7;
const WIPE = 2.8;
const SKEW = 12;

/*
 * Each image is visible for 2 full cycles:
 *   Cycle 1: it wipes in (WIPE) then holds (HOLD)  = WIPE + HOLD
 *   Cycle 2: it sits behind while the next wipes over it (HOLD + WIPE)
 * Total visible time = WIPE + HOLD + HOLD + WIPE = 2*(HOLD+WIPE)
 * The zoom runs for this entire duration so it never stops while visible.
 */
const ZOOM_FROM = 1;
const ZOOM_TO = 1.2;
const ZOOM_DUR = 2 * (HOLD + WIPE);

function clipAt(p: number) {
  const r = p * (100 + SKEW);
  const l = r - SKEW;
  return `polygon(${l}% 100%, ${r}% 0%, -${SKEW}% 0%, -${SKEW * 2}% 100%)`;
}

function LogoReveal({ play }: { play: boolean }) {
  const birseClipRef = useRef<SVGPolygonElement>(null);
  const thomasClipRef = useRef<SVGPolygonElement>(null);
  const slashRef = useRef<SVGGElement>(null);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!play || hasPlayed.current) return;
    hasPlayed.current = true;

    const birseClip = birseClipRef.current;
    const thomasClip = thomasClipRef.current;
    const slash = slashRef.current;
    if (!birseClip || !thomasClip || !slash) return;

    const dur = 1.5;
    const ease = "power2.inOut";

    gsap.set(slash, { opacity: 0 });

    // Birse wipe: right edge sweeps left→right
    // Start: "-43,88 -10,0 -10,0 -43,88" (collapsed)
    // End:   "-43,88 -10,0 278,0 245,88"  (revealed)
    const bp = { tr: -10, br: -43 };
    gsap.to(bp, {
      tr: 278, br: 245,
      duration: dur, ease,
      onUpdate: () => {
        birseClip.setAttribute("points", `-43,88 -10,0 ${bp.tr},0 ${bp.br},88`);
      },
    });

    // Thomas wipe: left edge sweeps right→left
    // Start: "713,0 680,88 680,88 713,0" (collapsed)
    // End:   "278,0 245,88 680,88 713,0" (revealed)
    const tp = { tl: 713, bl: 680 };
    gsap.to(tp, {
      tl: 278, bl: 245,
      duration: dur, ease,
      onUpdate: () => {
        thomasClip.setAttribute("points", `${tp.tl},0 ${tp.bl},88 680,88 713,0`);
      },
    });

    gsap.to(slash, { opacity: 1, duration: 0.4, delay: 1.0, ease: "power2.inOut" });
  }, [play]);

  return (
    <svg viewBox="0 0 669 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[90%] md:max-w-[560px] lg:max-w-[640px]">
      <defs>
        <clipPath id="birseClip">
          <polygon ref={birseClipRef} points="-43,88 -10,0 -10,0 -43,88" />
        </clipPath>
        <clipPath id="thomasClip">
          <polygon ref={thomasClipRef} points="713,0 680,88 680,88 713,0" />
        </clipPath>
      </defs>
      <g clipPath="url(#birseClip)">
        <path d="M203.89 72.43C211.86 77.48 221.69 74.89 226.27 67.26H240.01C237.41 79.95 226.24 86.97 213.58 87.43C195.34 88.1 182.09 75.56 181.73 57.46C181.48 45.23 187.12 33.47 197.67 28.26C209.16 22.59 223.38 23.59 232.41 32.69C239.77 40.1 242.03 50.03 241.28 60.22L198.81 60.29C198.19 64.24 199.82 69.83 203.9 72.42L203.89 72.43ZM224.41 49.6C224.38 41.7 218.45 36.63 210.79 37.22C204.04 37.74 198.79 42.32 198.46 49.59H224.41V49.6Z" fill="white"/>
        <path d="M167.35 83.53C157.28 86.68 147.16 86.6 137.99 83.07C130.34 80.12 125.33 73.92 125.19 64.85L140.66 64.9C141.5 69.17 143.1 71.94 146.44 73.37C151.24 75.42 157.06 75.36 161.49 72.39C162.73 71.56 164.21 68.46 164.1 67.06C163.38 57.85 138.12 60.7 129.48 50.79C125.64 46.39 125.82 40.47 127.83 34.8C129.23 30.83 133.62 26.78 138.94 25.17C152.82 20.98 178.09 22.13 178.72 42.11L163.7 42.21C162.87 40.27 161.63 37.37 160.31 36.41C156.03 33.34 149.66 33.8 145.34 35.65C144.12 36.17 142.93 39.07 143.12 40.27C143.35 41.66 145.26 44.33 146.66 44.68L163.42 48.95C168.36 50.21 174.69 51.95 177.71 56.35C184.49 66.24 179.11 79.87 167.38 83.55L167.35 83.53Z" fill="white"/>
        <path d="M102.96 85.78H86.73L86.68 26.69L101.97 26.39L102.73 36.14C107.86 28.18 115.64 23.44 125.11 25.32V40.37C119.36 39.96 114.32 39.7 109.89 42.64C106.28 45.03 103.38 50.51 103.32 55.58L102.96 85.79V85.78Z" fill="white"/>
        <path d="M81.33 85.76L64.85 85.67L64.9 26.45L81.3 26.48L81.33 85.76Z" fill="white"/>
        <path d="M81.35 22.16L64.93 22.17L64.88 8.84L81.25 8.67L81.35 22.16Z" fill="white"/>
        <path d="M57.54 71.64C53.25 82.8 43 88.51 31.7 87.28C25.25 86.58 20.37 84.18 16.09 79.32L15.56 85.76L-0.01 85.78V8.63L16.49 8.66L16.71 32.94C23.09 26.34 30.7 23.75 39.72 25.24C59.11 28.46 64.32 54.01 57.54 71.65V71.64ZM41.74 66.8C44.76 59.56 44.49 51.69 41.5 44.89C39.29 39.85 34.45 37.04 29.47 37.22C24.49 37.4 20.25 40.24 18.21 45.07C15.16 52.31 15.14 60.57 18.46 67.64C20.71 72.44 25.32 75.08 30.22 74.98C35.12 74.88 39.55 72.06 41.74 66.8Z" fill="white"/>
      </g>
      <g clipPath="url(#thomasClip)">
        <path d="M333.06 73.18L333.18 85.79C325.01 87.38 304.85 87.61 304.76 75.02L304.51 37.69L294.81 37.28L294.68 26.74L304.56 26.22L304.65 8.78H321.21L321.26 26.32L333.19 26.64L333.15 37.34L321.13 37.67L321.41 71.06C323.83 73.83 328.45 73.63 333.08 73.18H333.06Z" fill="white"/>
        <path d="M376.27 85.84L375.88 47.2C375.82 41.1 370.65 37.63 365.26 37.71C358.33 37.81 353.34 42.65 353.28 49.8L352.97 85.6L336.56 85.78L336.52 8.95L352.8 8.66L353.25 33.95C361.77 23.44 376.75 21.35 387.02 30.19C390.86 33.5 392.61 40.53 392.62 45.57L392.73 85.7L376.26 85.84H376.27Z" fill="white"/>
        <path d="M429.7 87.27C419.18 87.95 409.53 85.02 403 77.52C396.76 70.35 395.17 60.95 395.99 51.68C397.41 35.51 409.95 24.75 426.18 24.81C436.99 24.85 447.16 28.66 452.93 37.98C457.48 45.33 458.48 53.98 457.22 62.54C455.17 76.47 444.49 86.31 429.7 87.27ZM438.68 44.19C436.46 39.62 431.88 37.31 427.39 37.22C422.9 37.13 417.87 38.69 415.43 43.13C411.18 50.84 411.19 60.58 415.07 68.42C417.74 73.81 423.68 75.51 428.93 74.83C442.69 73.06 443.12 53.37 438.67 44.19H438.68Z" fill="white"/>
        <path d="M514.68 85.76L498.31 85.78L498.21 47.57C498.21 45.1 496.93 41.26 495.08 39.81C491.63 37.11 486.85 37.31 483.11 39.27C480.53 40.62 477.45 44.99 477.43 48.77L477.3 85.75L460.75 85.69V26.62L475.82 26.37L476.82 33.77C482.45 26.72 490.3 23.7 499 25.1C504.6 26 509.08 28.71 512.36 34.27C517.88 26.8 525.82 23.87 534.94 25.02C544.06 26.17 551.98 32.74 552.03 42.77L552.25 85.65L535.74 85.79L535.48 46.54C535.45 41.43 531.64 38.23 527.02 37.81C520.3 37.2 514.95 41.71 514.91 48.79L514.67 85.76H514.68Z" fill="white"/>
        <path d="M565.64 85.53C558.68 82.98 555.28 76.56 555.24 69.44C555.07 42.17 596.84 58.04 595.01 42.23C594.56 38.37 591.22 36.2 586.87 35.86C580.44 35.36 574.23 37.29 573.71 44.72H557.43C557.03 37.1 562.08 30.34 569.74 27.5C582.75 22.66 611.5 22.89 611.54 40.8L611.62 74.46C611.62 78.03 612.36 81.51 613.04 85.72L597.35 85.83L595.16 80.89C587.04 87.45 575.7 89.23 565.62 85.54L565.64 85.53ZM581.54 76.36C587.93 76.41 593.62 73.44 594.59 67.02C595.03 64.11 594.94 60.31 594.75 57.78L578.28 61.06C573.65 61.98 571.49 66.09 571.9 69.86C572.4 74.4 576.13 76.31 581.54 76.36Z" fill="white"/>
        <path d="M656.15 84.87C646.08 88.35 635.91 88.21 626.52 84.85C618.49 81.97 613.33 75.29 613.31 66.42L628.67 66.36C629.57 71.17 631.69 74.28 635.99 75.51C642.45 77.36 652.01 76.01 652.14 68.99C652.32 59.26 625.93 62.54 617.35 52.06C613.84 47.77 613.99 42.14 615.86 36.65C620.27 23.75 642.41 23.04 653.91 26.8C661.58 29.32 666.66 35.44 666.94 43.82L651.47 43.67C649.95 34.92 641.91 35.48 635.24 36.37C633.51 36.6 631.04 39.58 631.09 41.19C631.14 42.8 633.31 45.96 634.97 46.37L652.81 50.83C657.49 52 663.36 54.02 666.13 58.34C672.32 68.01 667.24 81.05 656.16 84.88L656.15 84.87Z" fill="white"/>
      </g>
      <g ref={slashRef} style={{ opacity: 0 }}>
        <path d="M258.83 85.24C254.73 85.69 250.98 85.69 245.49 85.33L277.38 0.29C281.91 -0.09 285.84 -0.11 290.76 0.29L258.82 85.24H258.83Z" fill="white"/>
      </g>
    </svg>
  );
}

function MobileMenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const leftRef = useRef<SVGLineElement>(null);
  const midRef = useRef<SVGLineElement>(null);
  const rightRef = useRef<SVGLineElement>(null);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const left = leftRef.current;
    const mid = midRef.current;
    const right = rightRef.current;
    if (!left || !mid || !right) return;

    if (open) {
      gsap.set(mid, { opacity: 0 });
      gsap.to(left, {
        attr: { x1: 8, y1: 3, x2: 26, y2: 21 },
        duration: 0.45,
        ease: "power2.inOut",
      });
      gsap.to(right, {
        attr: { x1: 26, y1: 3, x2: 8, y2: 21 },
        duration: 0.45,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(left, {
        attr: { x1: 8, y1: 1, x2: 0, y2: 23 },
        duration: 0.45,
        ease: "power2.inOut",
      });
      gsap.to(right, {
        attr: { x1: 26, y1: 1, x2: 18, y2: 23 },
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => { gsap.set(mid, { opacity: 1 }); },
      });
    }
  }, [open]);

  const color = open ? "#171717" : "white";

  return (
    <button
      onClick={onToggle}
      className="relative z-30 flex h-10 w-10 items-center justify-center"
      aria-label="Toggle menu"
      style={{ filter: open ? "none" : "drop-shadow(0 1px 80px rgba(0,0,0,0.5))" }}
    >
      <svg width="42" height="30" viewBox="-2 -1 38 26" fill="none" style={{ transition: "filter 0.3s" }}>
        <line ref={leftRef} x1="8" y1="1" x2="0" y2="23" stroke={color} strokeWidth="2" strokeLinecap="butt" style={{ transition: "stroke 0.3s" }} />
        <line ref={midRef} x1="17" y1="1" x2="9" y2="23" stroke={color} strokeWidth="2" strokeLinecap="butt" style={{ transition: "stroke 0.3s" }} />
        <line ref={rightRef} x1="26" y1="1" x2="18" y2="23" stroke={color} strokeWidth="2" strokeLinecap="butt" style={{ transition: "stroke 0.3s" }} />
      </svg>
    </button>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage] = useState("HOME");
  const [ready, setReady] = useState(false);

  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const aImgRef = useRef<HTMLImageElement>(null);
  const bImgRef = useRef<HTMLImageElement>(null);
  
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = HERO_IMAGES[0];

    const reveal = () => {
      setReady(true);
    };

    if (img.complete) {
      reveal();
    } else {
      img.onload = reveal;
      img.onerror = reveal;
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    const a = aRef.current;
    const b = bRef.current;
    const aImg = aImgRef.current;
    const bImg = bImgRef.current;
    if (!a || !b || !aImg || !bImg) return;

    let idx = 0;
    let front: "a" | "b" = "a";
    let dead = false;

    const L = {
      a: { wrap: a, img: aImg, zoom: null as gsap.core.Tween | null },
      b: { wrap: b, img: bImg, zoom: null as gsap.core.Tween | null },
    };

    function zoom(el: HTMLDivElement) {
      return gsap.fromTo(el,
        { scale: ZOOM_FROM },
        { scale: ZOOM_TO, duration: ZOOM_DUR, ease: "power2.inOut" },
      );
    }

    function wipeIn(el: HTMLDivElement, onDone: () => void) {
      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        duration: WIPE,
        ease: "power3.inOut",
        onUpdate: () => { el.style.clipPath = clipAt(proxy.p); },
        onComplete: onDone,
      });
    }

    function cycle() {
      if (dead) return;

      const cur = front;
      const nxt: "a" | "b" = cur === "a" ? "b" : "a";
      const nextIdx = (idx + 1) % HERO_IMAGES.length;

      const bg = L[cur];
      const fg = L[nxt];

      fg.img.src = HERO_IMAGES[nextIdx];

      if (fg.zoom) fg.zoom.kill();
      gsap.set(fg.wrap, { scale: ZOOM_FROM, zIndex: 2, clipPath: clipAt(0) });
      gsap.set(bg.wrap, { zIndex: 1 });

      fg.zoom = zoom(fg.wrap);

      wipeIn(fg.wrap, () => {
        if (dead) return;
        fg.wrap.style.clipPath = "none";
        gsap.set(fg.wrap, { zIndex: 1 });
        gsap.set(bg.wrap, { zIndex: 0 });

        idx = nextIdx;
        front = nxt;

        gsap.delayedCall(HOLD, () => cycle());
      });
    }

    aImg.src = HERO_IMAGES[0];
    gsap.set(a, { scale: ZOOM_FROM, zIndex: 1, clipPath: "none" });
    gsap.set(b, { scale: ZOOM_FROM, zIndex: 0, clipPath: "none" });

    L.a.zoom = zoom(a);

    gsap.delayedCall(HOLD, () => cycle());

    cleanupRef.current = () => {
      dead = true;
      gsap.killTweensOf(a);
      gsap.killTweensOf(b);
      gsap.killTweensOf({});
      if (L.a.zoom) L.a.zoom.kill();
      if (L.b.zoom) L.b.zoom.kill();
    };

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [ready]);

  return (
    <>
      {/* White loading screen */}
      <div
        className="fixed inset-0 z-[100] bg-white transition-opacity duration-700 ease-in-out"
        style={{
          opacity: ready ? 0 : 1,
          pointerEvents: ready ? "none" : "auto",
        }}
      />

      <div className="relative h-dvh w-full overflow-hidden bg-black">
        {/* Layer A */}
        <div ref={aRef} className="absolute inset-0 will-change-transform origin-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={aImgRef}
            alt="Birse Thomas project"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Layer B */}
        <div ref={bRef} className="absolute inset-0 will-change-transform origin-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={bImgRef}
            alt="Birse Thomas project"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Tint overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" style={{ zIndex: 3 }} />

        {/* Desktop Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-20 hidden md:block">
          <div className="flex items-center justify-end bg-white border-b border-neutral-200">
            <ul className="flex items-center">
              {NAV_ITEMS.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className={`nav-link inline-block px-5 lg:px-7 py-4 text-[10px] font-bold tracking-[0.1em] text-neutral-900 transition-colors duration-200 hover:text-neutral-900 ${
                      activePage === item ? "active" : ""
                    }`}
                  >
                    <svg
                      className="nav-slash"
                      height="11"
                      viewBox="-2 -2 12 26"
                      preserveAspectRatio="xMidYMid meet"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="0" y1="22"
                        x2="8" y2="0"
                        stroke="currentColor"
                        strokeWidth="4.5"
                        strokeLinecap="butt"
                      />
                    </svg>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-20 md:hidden">
          <div className="relative z-30 flex items-center justify-between px-5 py-5">
            <MobileMenuButton open={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          </div>

          {/* Mobile menu — fullscreen white */}
          <div
            className={`fixed inset-0 z-20 flex flex-col items-start justify-end pb-24 bg-white transition-all duration-500 ease-in-out ${
              mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <ul className="flex flex-col gap-0 px-14">
              {NAV_ITEMS.map((item, i) => (
                <li
                  key={item}
                  style={{
                    opacity: mobileMenuOpen ? 1 : 0,
                    transform: mobileMenuOpen ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.4s ease ${i * 0.06 + 0.15}s, transform 0.4s ease ${i * 0.06 + 0.15}s`,
                  }}
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`nav-link mobile-nav inline-block py-3 text-[clamp(1.5rem,5vw,2.5rem)] font-bold tracking-[0.02em] text-neutral-900 ${
                      activePage === item ? "active" : ""
                    }`}
                  >
                    <svg
                      className="nav-slash"
                      height="24"
                      viewBox="0 0 6 14"
                      preserveAspectRatio="xMidYMid meet"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ left: "-24px" }}
                    >
                      <line
                        x1="0.5" y1="14"
                        x2="5.5" y2="0"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="square"
                      />
                    </svg>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Centered Logo — GSAP-driven reveal, works on all browsers */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center px-8 md:px-16"
          style={{ filter: "drop-shadow(0 2px 4800px rgba(0,0,0,0.45))" }}
        >
          <LogoReveal play={ready} />
        </div>
      </div>
    </>
  );
}
