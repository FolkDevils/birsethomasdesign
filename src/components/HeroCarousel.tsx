"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { clipAt, getSkewPct } from "@/lib/clip-path";
import { HERO_IMAGES, HOLD, ZOOM_FROM, ZOOM_TO, ZOOM_DUR } from "@/lib/constants";

export default function HeroCarousel({ ready }: { ready: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const aImgRef = useRef<HTMLImageElement>(null);
  const bImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!ready) return;

    const container = containerRef.current;
    const a = aRef.current;
    const b = bRef.current;
    const aImg = aImgRef.current;
    const bImg = bImgRef.current;
    if (!container || !a || !b || !aImg || !bImg) return;

    let idx = 0;
    let front: "a" | "b" = "a";

    function skew() {
      const { width, height } = container!.getBoundingClientRect();
      return getSkewPct(width, height);
    }

    const L = {
      a: { wrap: a, img: aImg, zoom: null as gsap.core.Tween | null },
      b: { wrap: b, img: bImg, zoom: null as gsap.core.Tween | null },
    };

    const ctx = gsap.context(() => {
      function zoom(el: HTMLDivElement) {
        return gsap.fromTo(
          el,
          { scale: ZOOM_FROM },
          { scale: ZOOM_TO, duration: ZOOM_DUR, ease: "power2.inOut" },
        );
      }

      function wipeIn(el: HTMLDivElement, onDone: () => void) {
        const s = skew();
        const proxy = { p: 0 };
        gsap.to(proxy, {
          p: 1,
          duration: 2.5,
          ease: "power2.inOut",
          onUpdate: () => {
            el.style.clipPath = clipAt(proxy.p, s);
          },
          onComplete: onDone,
        });
      }

      function cycle() {
        const cur = front;
        const nxt: "a" | "b" = cur === "a" ? "b" : "a";
        const nextIdx = (idx + 1) % HERO_IMAGES.length;

        const bg = L[cur];
        const fg = L[nxt];

        fg.img.src = HERO_IMAGES[nextIdx];

        if (fg.zoom) fg.zoom.kill();
        gsap.set(fg.wrap, { scale: ZOOM_FROM, zIndex: 2, clipPath: clipAt(0, skew()) });
        gsap.set(bg.wrap, { zIndex: 1 });

        fg.zoom = zoom(fg.wrap);

        wipeIn(fg.wrap, () => {
          fg.wrap.style.clipPath = "none";
          gsap.set(fg.wrap, { zIndex: 1 });
          gsap.set(bg.wrap, { zIndex: 0 });

          idx = nextIdx;
          front = nxt;

          gsap.delayedCall(HOLD, cycle);
        });
      }

      aImg.src = HERO_IMAGES[0];
      gsap.set(a, { scale: ZOOM_FROM, zIndex: 1, clipPath: "none" });
      gsap.set(b, { scale: ZOOM_FROM, zIndex: 0, clipPath: "none" });

      L.a.zoom = zoom(a);

      gsap.delayedCall(HOLD, cycle);
    });

    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <div ref={aRef} className="absolute inset-0 origin-center will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element -- raw img required for GSAP clip-path animation */}
        <img
          ref={aImgRef}
          alt=""
          role="presentation"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div ref={bRef} className="absolute inset-0 origin-center will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element -- raw img required for GSAP clip-path animation */}
        <img
          ref={bImgRef}
          alt=""
          role="presentation"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
