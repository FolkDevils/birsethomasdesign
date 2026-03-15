"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MobileMenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
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

    const ctx = gsap.context(() => {
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
          onComplete: () => {
            gsap.set(mid, { opacity: 1 });
          },
        });
      }
    });

    return () => ctx.revert();
  }, [open]);

  const color = open ? "#171717" : "white";

  return (
    <button
      onClick={onToggle}
      className="relative z-30 flex h-10 w-10 items-center justify-center"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
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
