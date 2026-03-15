"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
      style={{ filter: open ? "none" : "drop-shadow(0 1px 4px rgba(0,0,0,0.5))" }}
    >
      <svg width="34" height="24" viewBox="-2 -1 38 26" fill="none" style={{ transition: "filter 0.3s" }}>
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

  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const aImgRef = useRef<HTMLImageElement>(null);
  const bImgRef = useRef<HTMLImageElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
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
  }, []);

  return (
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
                className=""
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

      {/* Centered Logo */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center px-8 md:px-16"
        style={{ filter: "drop-shadow(0 2px 40px rgba(0,0,0,0.45))" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Logo_BirseThomas_White.svg"
          alt="Birse Thomas"
          className="w-full max-w-[90%] md:max-w-[560px] lg:max-w-[640px]"
        />
      </div>
    </div>
  );
}
