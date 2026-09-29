/* ===========================================================================
   Figures.

   A screenshot of an interface tells a stranger nothing — it needs context
   the card cannot give, and halftoning one destroys the small text that made
   it worth showing. So each project gets a drawing of its subject instead,
   in the register of an 1890s patent illustration: flat ink line work, a
   figure number, one ember mark on the thing that matters.

   All stroke, no fill, no gradient. They sit on bone cream, inherit the page
   palette, and weigh a couple of kilobytes each.
   =========================================================================== */

const INK = "#1d1d1b";
const EMBER = "#c03f13";

function Fig({
  n,
  caption,
  label,
  children,
}: {
  n: string;
  caption: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bone">
      <svg
        viewBox="0 0 320 180"
        className="block h-auto w-full"
        role="img"
        aria-label={label}
      >
        <g
          stroke={INK}
          fill="none"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {children}
        </g>
      </svg>
      {/* The caption is HTML, not <text>. Inside the viewBox it scaled with
          the card, so the lead story printed its caption at twice the size
          of everyone else's. */}
      <p className="byline px-4 pb-3 pt-1">{`Fig. ${n} — ${caption}`}</p>
    </div>
  );
}

/* A forklift in side elevation with a figure standing in its path. The whole
   project exists because a model kept reporting this scene when it was not
   happening. */
export function FigForeman() {
  return (
    <Fig n="1" caption="A PEDESTRIAN IN THE TRAVEL PATH" label="Line drawing of a forklift with a person standing in front of it">
      {/* ground */}
      <line x1="16" y1="150" x2="304" y2="150" />
      {/* mast */}
      <line x1="196" y1="44" x2="196" y2="140" />
      <line x1="208" y1="44" x2="208" y2="140" />
      <line x1="196" y1="44" x2="208" y2="44" />
      {/* carriage and forks */}
      <path d="M196 116 L186 116 L186 132 L232 132" />
      <path d="M196 104 L232 104" strokeWidth="1" opacity="0.5" />
      {/* body */}
      <path d="M208 140 L208 96 L244 96 L244 74 L268 74 L272 96 L286 96 L286 140 Z" />
      {/* seat back */}
      <path d="M244 96 L244 74" opacity="0.6" />
      {/* counterweight hatching */}
      <path d="M262 104 L282 104 M262 112 L282 112 M262 120 L282 120" strokeWidth="1" opacity="0.4" />
      {/* wheels */}
      <circle cx="222" cy="144" r="10" />
      <circle cx="276" cy="144" r="8" />
      <circle cx="222" cy="144" r="3" strokeWidth="1" />
      <circle cx="276" cy="144" r="2.5" strokeWidth="1" />
      {/* operator */}
      <circle cx="252" cy="64" r="7" />
      <path d="M252 71 L252 90 M252 78 L240 84 M252 78 L262 82" />

      {/* the pedestrian, in the path — the one thing in ember */}
      <g stroke={EMBER} strokeWidth="1.8">
        <circle cx="96" cy="96" r="8" />
        <path d="M96 104 L96 128 M96 112 L84 120 M96 112 L108 120 M96 128 L86 150 M96 128 L106 150" />
      </g>
      {/* travel path */}
      <path d="M180 150 L110 150" stroke={EMBER} strokeWidth="1" strokeDasharray="4 5" />
    </Fig>
  );
}

/* A terminal with no way in but the screen, and a mechanical arm working it.
   The dashed arm is the model, which is present once and then never again. */
export function FigInterface() {
  return (
    <Fig n="2" caption="A MACHINE OPERATING A MACHINE" label="Line drawing of a mechanical arm working an old computer terminal">
      <line x1="16" y1="160" x2="304" y2="160" />
      {/* terminal */}
      <path d="M92 60 L212 60 L212 132 L92 132 Z" />
      <path d="M102 70 L202 70 L202 122 L102 122 Z" strokeWidth="1" opacity="0.55" />
      {/* screen lines */}
      <path
        d="M112 82 L170 82 M112 92 L186 92 M112 102 L156 102 M112 112 L178 112"
        strokeWidth="1"
        opacity="0.45"
      />
      {/* stand */}
      <path d="M140 132 L140 150 L164 150 L164 132 M120 150 L184 150" />
      {/* arm */}
      <g stroke={EMBER} strokeWidth="1.8">
        <path d="M276 40 L276 76 L236 100 L206 100" strokeDasharray="5 4" />
        <circle cx="276" cy="40" r="5" />
        <circle cx="276" cy="76" r="4" />
        <path d="M206 100 L196 96 M206 100 L196 104" strokeDasharray="0" />
      </g>
      {/* repeat marks: the replays, with no arm at all */}
      <path
        d="M236 118 L206 118 M236 128 L206 128 M236 138 L206 138"
        strokeWidth="1"
        opacity="0.5"
      />
    </Fig>
  );
}

/* A gramophone: the model proposes a tracklist, and something literal checks
   whether the records actually exist. */
export function FigVibeCheck() {
  return (
    <Fig n="3" caption="A RECORD THAT MAY OR MAY NOT EXIST" label="Line drawing of a gramophone with its horn">
      <line x1="16" y1="162" x2="304" y2="162" />
      {/* cabinet */}
      <path d="M84 126 L196 126 L196 158 L84 158 Z" />
      <path d="M94 136 L186 136" strokeWidth="1" opacity="0.4" />
      {/* turntable */}
      <ellipse cx="140" cy="122" rx="44" ry="11" />
      <ellipse cx="140" cy="122" rx="4" ry="1.6" strokeWidth="1" />
      {/* horn */}
      <path d="M176 112 L214 74 L268 30 L284 52 L246 96 L198 120" />
      <path d="M268 30 L246 96" strokeWidth="1" opacity="0.4" />
      <ellipse cx="276" cy="41" rx="9" ry="14" transform="rotate(-38 276 41)" strokeWidth="1" opacity="0.6" />
      {/* tonearm */}
      <path d="M176 112 L150 118" strokeWidth="1" />
      {/* the check mark — the literal part */}
      <path d="M52 118 l7 8 l14 -18" stroke={EMBER} strokeWidth="2" />
      <path d="M46 140 l24 18 M70 140 l-24 18" stroke={INK} strokeWidth="1.2" opacity="0.5" />
    </Fig>
  );
}

/* A vessel, thrown and painted. The only project here that is a physical
   object sold to real people. */
export function FigRaivana() {
  return (
    <Fig n="4" caption="A VESSEL, AND SOMEONE PAYING FOR IT" label="Line drawing of a painted ceramic vase">
      <line x1="16" y1="168" x2="304" y2="168" />
      {/* vase profile */}
      <path d="M146 44 L146 58 C112 72 104 108 116 138 C124 156 172 156 180 138 C192 108 184 72 150 58 L150 44 Z" />
      {/* rim */}
      <ellipse cx="148" cy="44" rx="13" ry="4" />
      {/* decorative bands */}
      <path d="M110 100 C132 92 164 92 186 100" strokeWidth="1" opacity="0.5" />
      <path d="M112 118 C134 110 162 110 184 118" strokeWidth="1" opacity="0.5" />
      {/* painted motif */}
      <g stroke={EMBER} strokeWidth="1.4">
        <circle cx="148" cy="110" r="9" />
        <path d="M148 96 L148 88 M148 132 L148 124 M130 110 L122 110 M174 110 L166 110" />
      </g>
      {/* base shadow line */}
      <path d="M118 168 C132 162 164 162 178 168" strokeWidth="1" opacity="0.45" />
      {/* a coin */}
      <circle cx="248" cy="150" r="13" />
      <circle cx="248" cy="150" r="8" strokeWidth="1" opacity="0.5" />
    </Fig>
  );
}

/* A tenement elevation with one door marked. The whole project is about the
   door that did not close. */
export function FigFireSight() {
  return (
    <Fig n="5" caption="THE DOOR THAT DID NOT CLOSE" label="Line drawing of an apartment building elevation with one door marked">
      <line x1="16" y1="170" x2="304" y2="170" />
      {/* building */}
      <path d="M96 30 L224 30 L224 170 L96 170 Z" />
      {/* cornice */}
      <path d="M90 30 L230 30 M90 36 L230 36" strokeWidth="1" />
      {/* windows */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={112 + col * 36}
            y={50 + row * 28}
            width={22}
            height={18}
            strokeWidth="1"
            opacity="0.7"
          />
        )),
      )}
      {/* door */}
      <path d="M148 170 L148 138 L172 138 L172 170" />
      {/* the door, ajar — the thing that mattered */}
      <g stroke={EMBER} strokeWidth="1.8">
        <path d="M172 138 L188 146 L188 170 L172 170" />
        <path d="M176 156 L180 156" />
      </g>
      {/* stoop */}
      <path d="M138 170 L182 170" strokeWidth="1" />
      {/* fire escape */}
      <path
        d="M232 60 L252 60 M232 88 L252 88 M232 116 L252 116 M242 60 L242 116"
        strokeWidth="1"
        opacity="0.55"
      />
    </Fig>
  );
}

/* An aeroplane seen from below, and a price that will not sit still. */
export function FigFarewatch() {
  return (
    <Fig n="6" caption="A PRICE THAT WILL NOT SIT STILL" label="Line drawing of an aeroplane above a jagged price line">
      {/* aeroplane, plan view */}
      <g transform="translate(0,-6)">
        <path d="M160 34 C166 34 170 44 170 58 L170 82 L214 106 L214 116 L170 104 L170 122 L184 134 L184 142 L160 136 L136 142 L136 134 L150 122 L150 104 L106 116 L106 106 L150 82 L150 58 C150 44 154 34 160 34 Z" />
        <path d="M160 40 L160 130" strokeWidth="1" opacity="0.35" />
      </g>
      {/* price line */}
      <path
        d="M20 160 L44 150 L62 156 L84 132 L106 148 L130 140 L152 164 L176 146 L200 154 L224 128 L248 150 L272 142 L300 156"
        stroke={EMBER}
        strokeWidth="1.8"
      />
      {/* the one worth taking */}
      <circle cx="224" cy="128" r="5" stroke={EMBER} strokeWidth="1.8" />
    </Fig>
  );
}

export const FIGURES: Record<string, () => React.JSX.Element> = {
  foreman: FigForeman,
  "interface-cua": FigInterface,
  vibecheck: FigVibeCheck,
  raivana: FigRaivana,
  firesight: FigFireSight,
  farewatch: FigFarewatch,
};
