"use client";

import { useState, useEffect, useCallback } from "react";
import { HERO_IMAGES } from "@/lib/constants";
import HeroCarousel from "@/components/HeroCarousel";
import LogoRevealSVG from "@/components/LogoRevealSVG";
import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";

const ACTIVE_PAGE = "HOME";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const toggleMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), []);

  useEffect(() => {
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    const img = new Image();
    img.onload = reveal;
    img.onerror = reveal;
    img.src = HERO_IMAGES[0];
    if (img.complete) reveal();

    const fallback = setTimeout(reveal, 3000);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-neutral-900 focus:shadow-lg">
        Skip to content
      </a>

      <div
        className="fixed inset-0 z-[100] bg-white transition-opacity duration-700 ease-in-out"
        style={{
          opacity: ready ? 0 : 1,
          pointerEvents: ready ? "none" : "auto",
        }}
        aria-hidden="true"
      />

      <main id="main-content" className="relative h-dvh w-full overflow-hidden bg-black">
        <HeroCarousel ready={ready} />

        <div className="pointer-events-none absolute inset-0 z-[3] bg-black/20" aria-hidden="true" />

        <DesktopNav activePage={ACTIVE_PAGE} />
        <MobileNav activePage={ACTIVE_PAGE} open={mobileMenuOpen} onToggle={toggleMenu} />

        <div
          className="absolute inset-0 z-10 flex items-center justify-center px-8 drop-shadow-[0_2px_48px_rgba(0,0,0,0.45)] md:px-16"
        >
          <LogoRevealSVG play={ready} />
        </div>
      </main>
    </>
  );
}
