"use client";

import { useEffect, useRef } from "react";
import { lenisRef } from "@/components/smooth-scroll";

/* The open, as the reference does it: the WHOLE PAGE, not a title card.

   Measured on niccolomiranda.com, sampling its `.app` wrapper's transform
   every ~200ms from navigation:

     - the page appears at scale 0.4 on ink, sitting low in the window
     - it rises (ease-in-out, ~1.5s) until its top is ~13% down the screen
     - it holds for about half a second
     - then it turns through two full turns anticlockwise (-720deg) while
       growing to full size, on a steep in-out curve (~2.2s)

   The transform origin is the page's horizontal centre, ~0.7 of a screen
   down, so the final turns pivot on the first screenful.

   The previous version spun a separate overlay holding only NIRWAN and the
   masthead, then faded it out over the real page. It could not do this:
   it mounted after paint, and the page under it never moved.

   So the page is transformed from its very first paint. An inline script,
   parsed before the page body, sets `data-opening` on <body> (which already
   suppresses hydration warnings for its own attributes). CSS runs the
   animation off that attribute; this component clears it when the
   animation ends, which is what drops the transform and gives the fixed
   masthead its viewport back. Once per session, and never for reduced
   motion. */
const ARM = `try{var s=sessionStorage;if(s.getItem("seen-open")!=="1"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){s.setItem("seen-open","1");document.body.setAttribute("data-opening","")}}catch(e){}`;

export function Opening({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.body.hasAttribute("data-opening")) return;
    const el = ref.current;
    window.scrollTo(0, 0);
    lenisRef.current?.stop();
    const done = () => {
      document.body.removeAttribute("data-opening");
      lenisRef.current?.start();
    };
    // animationend, with a timer behind it in case the tab was hidden and
    // the animation never ran to its end event.
    const onEnd = (e: AnimationEvent) => e.target === el && done();
    el?.addEventListener("animationend", onEnd);
    const t = window.setTimeout(done, 5200);
    return () => {
      el?.removeEventListener("animationend", onEnd);
      window.clearTimeout(t);
      done();
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: ARM }} />
      <div ref={ref} className="opening">
        {children}
      </div>
    </>
  );
}
