"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, startTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { links } from "@/lib/data";
import { lenisRef } from "@/components/smooth-scroll";
import { Torn } from "@/components/torn";

/* ===========================================================================
   The curtain: the page transition and the menu, which on the reference are
   one mechanism.

   Read out of the reference's source: a `PaperCurtainEffect` — an ink sheet
   (#1D1D1B) with a ripped edge — sweeps in on every internal link click, the
   page changes under it, and it sweeps out. The menu opens with the SAME
   curtain and its links sit on it. Easing power3.inOut. The effect itself is
   WebGL and is the reference's own code, so this is a reconstruction rather
   than a copy: one fixed ink panel with a torn edge top and bottom
   (components/torn.tsx), moved with a CSS transform.

   It lives in the ROOT LAYOUT, because App Router layouts persist across
   navigations and pages do not. A curtain mounted per page would unmount
   halfway through the transition it was running.

   Navigation is taken over with a capture-phase click listener. Next's <Link>
   checks `e.defaultPrevented` and stands down (read in
   next/dist/client/app-dir/link.js), so the listener can prevent the click,
   drop the curtain, and then push the route itself.

   Not intercepted: modified clicks, new tabs, downloads, other origins,
   same-page hashes, anything marked data-no-curtain — and moves between
   /work and a project page, which already have their own transition (the
   spine falls open into the hero via a shared ViewTransition) that a curtain
   would only hide.
   =========================================================================== */

type Phase = "idle" | "covering" | "covered" | "leaving";

type CurtainApi = {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const CurtainContext = createContext<CurtainApi>({
  menuOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
});

export const useCurtain = () => useContext(CurtainContext);

const DURATION = 900; // ms, each way
// power3.inOut, the reference's curtain easing.
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

const MENU = [
  { href: "/", label: "Index" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CurtainProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [menuOpen, setMenuOpen] = useState(false);
  const [animate, setAnimate] = useState(true);
  const pending = useRef<string | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const firstLink = useRef<HTMLAnchorElement | null>(null);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  // Lift the curtain: down and out, then back to its rest position above the
  // page with transitions off, so it does not sweep back up across the view.
  const lift = useCallback(() => {
    setMenuOpen(false);
    setPhase("leaving");
    later(() => {
      setAnimate(false);
      setPhase("idle");
      lenisRef.current?.start();
      later(() => setAnimate(true), 50);
    }, DURATION);
  }, []);

  const go = useCallback(
    (href: string) => {
      const target = new URL(href, window.location.href);
      if (target.pathname === window.location.pathname) {
        if (menuOpen) lift();
        return;
      }
      if (reducedMotion()) {
        setMenuOpen(false);
        router.push(href);
        return;
      }
      pending.current = target.pathname;
      const push = () => startTransition(() => router.push(href));
      if (phase === "covered") {
        push();
      } else {
        setPhase("covering");
        later(() => {
          setPhase("covered");
          push();
        }, DURATION);
      }
      // Never leave the page covered: if the route somehow does not change,
      // lift anyway.
      later(() => {
        if (pending.current) {
          pending.current = null;
          lift();
        }
      }, DURATION + 4000);
    },
    [lift, menuOpen, phase, router],
  );

  // The new route has rendered under the curtain: reset the scroll and lift.
  useEffect(() => {
    if (pending.current && pathname === pending.current) {
      pending.current = null;
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      later(lift, 80);
    }
  }, [pathname, lift]);

  // Take over internal navigation.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.hasAttribute("download") || a.hasAttribute("data-no-curtain")) return;
      if (a.target && a.target !== "_self") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;
      const from = window.location.pathname;
      if (from.startsWith("/work") && url.pathname.startsWith("/work") && from !== url.pathname) {
        if (menuOpen) setMenuOpen(false);
        return;
      }
      e.preventDefault();
      go(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [go, menuOpen]);

  const openMenu = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    lenisRef.current?.stop();
    setMenuOpen(true);
    setPhase(reducedMotion() ? "covered" : "covering");
    later(() => {
      setPhase("covered");
      firstLink.current?.focus();
    }, reducedMotion() ? 0 : DURATION * 0.6);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setPhase("idle");
    lenisRef.current?.start();
    // Back to the control that opened it. Not "whatever was focused at open":
    // Safari does not focus a button on click, so that was often <body>, and
    // a keyboard user closing the menu was dropped at the top of the page.
    const control = document.querySelector<HTMLElement>('button[aria-controls="site-menu"]');
    (control ?? returnFocus.current)?.focus?.();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const y = phase === "idle" ? "-112%" : phase === "leaving" ? "112%" : "0%";

  return (
    <CurtainContext.Provider value={{ menuOpen, openMenu, closeMenu }}>
      {children}

      <div
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className="curtain fixed inset-0 z-[70]"
        style={{
          transform: `translate3d(0, ${y}, 0)`,
          transition: animate ? `transform ${DURATION}ms ${EASE}` : "none",
          pointerEvents: phase === "idle" ? "none" : "auto",
        }}
      >
        {/* Torn at both edges: the bottom leads on the way down, the top
            trails on the way out. */}
        <Torn seed={11} fill="var(--color-ink)" className="absolute inset-x-0 -top-[46px] h-[48px]" />
        <div className="h-full w-full bg-ink" />
        <Torn seed={23} fill="var(--color-ink)" className="absolute inset-x-0 -bottom-[46px] h-[48px] -scale-y-100" />

        <nav
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="absolute inset-0 flex flex-col items-center px-[var(--gutter)] pb-8 pt-[72px] text-parchment md:pt-[97px]"
          style={{
            opacity: menuOpen && phase === "covered" ? 1 : 0,
            transition: "opacity 400ms ease-out",
          }}
        >
          {/* Measured on the reference's open menu: the three words CENTRED
              in the space under the bar, stacked tight with no rules
              between them, and the current page struck through with one
              ember bar rather than recoloured. The old version set them flush
              left with a rule under each, which at 1440 left the right 60%
              of the curtain empty and on a phone bunched the whole menu into
              the top quarter of the screen.

              Sized to the smaller of width and height, so three lines always
              fit: 18.75vw is the reference's 270px at 1440, the svh bound
              stops a short landscape window overflowing, and phones get
              34vw so the words hold the screen as they do there. */}
          <ul className="heavy heavy-xl my-auto text-center text-[min(34vw,24svh)] leading-[0.86] md:text-[min(18.75vw,24svh)]">
            {MENU.map((m, i) => {
              const current = m.href === "/" ? pathname === "/" : pathname.startsWith(m.href);
              return (
                <li key={m.href}>
                  <Link
                    href={m.href}
                    ref={i === 0 ? firstLink : undefined}
                    aria-current={current ? "page" : undefined}
                    className="tighten relative inline-block no-underline transition-opacity hover:opacity-70"
                  >
                    {m.label}
                    {current ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-[-4%] top-[44%] block h-[0.06em] bg-ember"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* The reference's social row: centred, dot-separated. */}
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {[
              { label: "Email", href: `mailto:${links.email}` },
              { label: "GitHub", href: links.github },
              { label: "LinkedIn", href: links.linkedin },
              { label: "Résumé", href: links.resume },
            ].map((l, i) => (
              <li key={l.label} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden="true" className="text-bone">•</span> : null}
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="heavy text-[17px] text-bone no-underline hover:text-parchment"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </CurtainContext.Provider>
  );
}
