"use client";

import { useEffect, useRef } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import MobileMenuButton from "./MobileMenuButton";

interface MobileNavProps {
  activePage: string;
  open: boolean;
  onToggle: () => void;
}

export default function MobileNav({ activePage, open, onToggle }: MobileNavProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    if (!menu) return;

    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function trapFocus(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onToggle();
        return;
      }
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [open, onToggle]);

  return (
    <nav className="absolute top-0 right-0 left-0 z-20 md:hidden" aria-label="Mobile navigation">
      <div className="relative z-30 flex items-center justify-between px-5 py-5">
        <MobileMenuButton open={open} onToggle={onToggle} />
      </div>

      <div
        ref={menuRef}
        className={`fixed inset-0 z-20 flex flex-col items-start justify-end bg-white pb-24 transition-all duration-500 ease-in-out ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <ul className="flex flex-col gap-0 px-14">
          {NAV_ITEMS.map((item, i) => (
            <li
              key={item}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.4s ease ${i * 0.06 + 0.15}s, transform 0.4s ease ${i * 0.06 + 0.15}s`,
              }}
            >
              <a
                href={`#${item.toLowerCase()}`}
                onClick={onToggle}
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
  );
}
