"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { profile } from "@/lib/data";
import { useCurtain } from "@/components/curtain";

/* The bar, measured off the reference at 1440: fixed, 97px, the page's own
   ground colour, no rule under it. Location left at reading size, the
   nameplate centred, a two-line menu control right.

   Its Webflow interactions hide it on scroll down (y -100px, 300ms outQuad)
   and bring it back on scroll up (y 0, 400ms outQuad). On a project page it
   stays out of the way until the reader is past the hero — "Project – Navbar
   SHOW" fires on scroll-into-view of an element below it — which is what
   `revealAfter` does here, in viewport heights.

   It sits above the curtain, so the same control opens and closes the menu,
   and its ink turns to parchment while the menu is down. */
export function SiteNav({
  tone = "parchment",
  revealAfter,
}: {
  tone?: "parchment" | "bone";
  revealAfter?: number;
}) {
  const { menuOpen, openMenu, closeMenu } = useCurtain();
  const [hidden, setHidden] = useState(revealAfter !== undefined);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (revealAfter !== undefined && y < window.innerHeight * revealAfter) {
        setHidden(true);
      } else if (y < 120) {
        setHidden(false);
      } else if (y > last + 4) {
        setHidden(true);
      } else if (y < last - 4) {
        setHidden(false);
      }
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealAfter]);

  const up = hidden && !menuOpen;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[80]"
        style={{
          transform: up ? "translate3d(0,-100%,0)" : "none",
          // outQuad, 300ms away and 400ms back, as measured.
          transition: `transform ${up ? 300 : 400}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 300ms ease, color 300ms ease`,
          backgroundColor: menuOpen ? "transparent" : `var(--color-${tone})`,
          color: menuOpen ? "var(--color-parchment)" : "var(--color-ink)",
        }}
      >
        <div className="sheet grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-[97px]">
          {/* Off on phones, as on the reference: beside a centred nameplate at
              390 it wrapped to two lines and crowded the title. */}
          <span className="plate-row whitespace-nowrap max-sm:invisible" style={{ color: "inherit" }}>
            {profile.location}
          </span>
          <Link href="/" className="gothic justify-self-center text-[24px] no-underline md:text-[32px]" style={{ color: "inherit" }}>
            The Second Opinion
          </Link>
          <button
            type="button"
            onClick={menuOpen ? closeMenu : openMenu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="justify-self-end p-2"
          >
            {/* Two lines that cross into an X. */}
            <span aria-hidden="true" className="relative block h-[9px] w-8">
              <span
                className="absolute inset-x-0 top-0 block h-[2px] bg-current transition-transform duration-500"
                style={{ transform: menuOpen ? "translateY(3.5px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute inset-x-0 bottom-0 block h-[2px] bg-current transition-transform duration-500"
                style={{ transform: menuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </header>
      {/* Holds the page clear of the fixed bar. Not on a project page, where
          the bar is hidden over the hero and must not push it down. */}
      {revealAfter === undefined ? <div aria-hidden="true" className="h-[72px] md:h-[97px]" /> : null}
    </>
  );
}
