"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { lensById, type Lens, type LensId } from "@/lib/lenses";

type LensContextValue = {
  active: LensId;
  lens: Lens;
  setActive: (id: LensId) => void;
};

const LensContext = createContext<LensContextValue | null>(null);

export function LensProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<LensId>("all");
  const lens = useMemo(() => lensById(active), [active]);

  const value = useMemo(
    () => ({ active, lens, setActive }),
    [active, lens],
  );

  return (
    <LensContext.Provider value={value}>
      <div
        className="accent-root"
        style={{ ["--accent" as string]: lens.accent } as React.CSSProperties}
      >
        {children}
      </div>
    </LensContext.Provider>
  );
}

export function useLens() {
  const ctx = useContext(LensContext);
  if (!ctx) throw new Error("useLens must be used within LensProvider");
  return ctx;
}
