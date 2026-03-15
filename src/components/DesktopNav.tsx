"use client";

import { NAV_ITEMS } from "@/lib/constants";

export default function DesktopNav({ activePage }: { activePage: string }) {
  return (
    <nav className="absolute top-0 right-0 left-0 z-20 hidden md:block" aria-label="Main navigation">
      <div className="flex items-center justify-end border-b border-neutral-200 bg-white">
        <ul className="flex items-center">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className={`nav-link inline-block px-5 py-4 text-[10px] font-bold tracking-[0.1em] text-neutral-900 transition-colors duration-200 hover:text-neutral-900 lg:px-7 ${
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
  );
}
