/* Owned here now. data.ts used to export this for the margin-note system on
   the old design; studies are the only thing still using the shape. */
export type Note = {
  label?: string;
  body: string;
  tone?: "default" | "cost";
};

/* ===========================================================================
   Long-form case studies.

   Typed blocks rather than MDX: the same expressiveness where it matters
   (a note paired to a specific paragraph, a figure with a real caption),
   no loader configuration, and zero client-side JavaScript. The tradeoff is
   portability — this is React-shaped content. For three studies maintained
   by one person, that is the right trade.
   =========================================================================== */

export type Block =
  | { kind: "p"; text: string; lede?: boolean; note?: Note }
  | { kind: "h"; text: string }
  | { kind: "pull"; text: string }
  | {
      kind: "figure";
      src: string;
      alt: string;
      w: number;
      h: number;
      caption: string;
      /* A second cut for phones, when the wide one would not survive being
         shrunk to 360px (the farewatch chart's labels would be ~5px). */
      narrow?: { src: string; w: number; h: number };
      /* A screen recording of the real app. When present, `src` is its
         poster frame and `alt` its label, so a figure is still a figure
         before the video loads, and for anyone who never plays it. */
      video?: { mp4: string; webm?: string };
    };

export type Study = {
  slug: string;
  title: string;
  standfirst: string;
  meta: string;
  blocks: Block[];
};

export const studies: Study[] = [
  {
    slug: "foreman",
    title: "Foreman",
    standfirst:
      "A warehouse-safety video agent, and a public eval measuring the part everyone skips: whether the verification step earns its place.",
    meta: "2026 · Python, NVIDIA NIM, Nemotron VL, MCP",
    blocks: [
      {
        kind: "p",
        lede: true,
        text: "Ask a vision language model whether footage contains a safety hazard and it will almost always say yes. On my labelled set a single-pass VLM flagged a hazard in 77% of windows that contained none. No amount of prompt rewriting fixes that, because the prompt is not the problem — showing a model a safety camera and asking about hazards hands it an overwhelming prior that hazards are present.",
      },
      {
        kind: "p",
        text: "So I treated it as an architecture problem instead. The perception pass is allowed to over-report. Behind it sits a second model that can only remove things: it re-opens the same frames and decides whether the evidence actually meets the bar for the class that was claimed.",
        note: {
          label: "Why it must see pixels",
          body: "The cheap version of this is a reasoning LLM reading the perception pass’s text. That arm scored F1 0.19 — below doing nothing at all. Written evidence is too thin to adjudicate on.",
        },
      },
      {
        kind: "figure",
        src: "/video/foreman-poster.jpg",
        video: { mp4: "/video/foreman.mp4", webm: "/video/foreman.webm" },
        alt: "Screen recording of Foreman's review console: 26 candidates raised, 11 confirmed, 15 filtered out; a confirmed alert opened to its evidence chain and the OSHA standard it cites; a plain-language search for someone sitting on the warehouse floor; then the audit tab, ending on a 0.95-confidence detection the verifier rejected",
        w: 1600,
        h: 900,
        caption:
          "The live demo, on one training video: 26 candidates raised, 11 kept, 15 thrown out. Midway it searches for “someone sitting on the warehouse floor”, a question none of the alert classes ask, and finds the window that shows it. It ends on a detection the model proposed at 0.95 confidence and the verifier threw out; my own label for that window agrees there was nothing there. The evidence panels are empty because the footage is not mine to redistribute.",
      },
      { kind: "h", text: "What I built" },
      {
        kind: "p",
        text: "Everything runs on NVIDIA-hosted NIM endpoints, so the whole thing reproduces on a laptop with an API key and no GPU: Nemotron Nano VL for perception, a reasoning VLM for verification, and NeMo Retriever embeddings for natural-language search across every analysed window. It also ships an MCP server exposing the timeline as agent tools, so any agent can query the footage in plain language.",
      },
      {
        kind: "p",
        text: "Then I hand-labelled 49 windows of real footage and built an eval harness with seven ablation arms — and measured run-to-run variance across repeats rather than quoting a single lucky number.",
        note: {
          label: "The unglamorous part",
          body: "Three weeks of that project was labelling. There is no shortcut, and an eval built on someone else’s labels would not have caught the failure below.",
        },
      },
      { kind: "h", text: "What the numbers say" },
      {
        kind: "p",
        text: "Frame-level verification roughly doubled precision: 0.15 → 0.35 on a single run, 0.34 averaged over three repeats. Recall fell from 0.80 to 0.60, and to 0.50 on the averaged figure. That is a real precision win that costs real recall — not a free lunch, and I would not present it as one.",
        note: {
          label: "Cost",
          tone: "cost",
          body: "On a real floor you would tune the verifier’s bar per class. Missing a pedestrian in a forklift path costs more than a missed PPE violation, so they should not share a threshold.",
        },
      },
      {
        kind: "p",
        text: "Two findings I did not expect, and would not have got from a demo. Confidence thresholds barely help — raising the bar from 0.15 to 0.80 moved precision 0.15 to 0.18. And text-only verification scores below the naive baseline, which is the result that changed what I built.",
      },
      { kind: "h", text: "The failure that changed the design" },
      {
        kind: "pull",
        text: "Both models described a pedestrian walking in front of a moving forklift. The frame was a black title card reading PASSING IN FRONT OF A FORKLIFT.",
      },
      {
        kind: "p",
        text: "Neither model was hallucinating exactly — they were reading. Burned-in text, slates and lower-thirds are everywhere in real deployed footage, and a system that treats printed words as observed events will fire on all of it. A scene gate in the same call removed the entire class at no extra cost.",
        note: {
          body: "This is the argument for hand-labelling rather than sampling. A 0.95-confidence detection on a title card looks identical to a correct one in any aggregate metric.",
        },
      },
      { kind: "h", text: "Honest limits" },
      {
        kind: "p",
        text: "The eval is small: 49 windows, 10 positive events, one annotator, and that annotator is me. Seven of the ten positives are one class, and blocked_egress has no positive examples at all, so its numbers mean nothing yet. Labels are judgement calls and a second annotator would move them. Treat the precision figures as a directional result on one labelled set, not a benchmark.",
        note: {
          label: "Why say all this",
          body: "A work sample that oversells is worse than one that is small. The limits are in the repo README too, not just here.",
        },
      },
      {
        kind: "p",
        text: "The demo was the easy half. The eval is the part that tells you whether the architecture is real, and it is the part that changed what I built.",
      },
    ],
  },

  {
    slug: "interface-cua",
    title: "interface-cua",
    standfirst:
      "A model works out how to drive a legacy UI that has no API. The successful run is recorded as a typed capability that then replays with no model in the decision loop at all.",
    meta: "2026 · TypeScript, Playwright, zod — 14,373 lines",
    blocks: [
      {
        kind: "p",
        lede: true,
        text: "An agent that calls a model on every step is an agent that can fail differently every time it runs. For a back-office flow that moves money, that is disqualifying. So discovery and execution are split: the model drives a real UI once, working out the flow, and the successful run is recorded as a typed, versioned capability. Replay executes that artifact deterministically and returns typed data. Replay needs no API key.",
      },
      { kind: "h", text: "Six decisions worth the argument" },
      {
        kind: "p",
        text: "The most consequential one is an ordering choice. Declared business outcomes are checked before step checkpoints, so looking up a member who does not exist returns MEMBER_NOT_FOUND with exit code 0 — not checkpoint_failed: expected element not found.",
        note: {
          label: "Why it matters",
          body: "The alternative forces the calling agent to string-match an error message to discover whether a customer exists. \"No such member\" is an answer, not a malfunction, and the type system should say so.",
        },
      },
      {
        kind: "p",
        text: "The locator stores seven ranked signals — role and accessible name, then section, neighbouring text, framework id, ordinal position. Replay records which tier actually fired and compares it to the tier recorded at discovery. A step that used to resolve on name and now resolves on position still passes, and raises driftDetected. Drift detection falls out of the locator design rather than being a separate system bolted on.",
      },
      {
        kind: "p",
        text: "Detectors are never shipped unwatched. Running a flow with inputs that should fail derives the detector from what the app actually rendered — after first running the happy path, so that page chrome present on every screen can never become a detector.",
      },
      {
        kind: "p",
        text: "The model never sees a parameter value. It is told the capability takes a memberId and instructed to type the literal {{memberId}}; substitution happens in the instant before the keystroke. The transcript therefore holds no customer data and no credentials, the recorded step is already parameterised, and a password can be typed into a login form the model discovered without the model ever holding it.",
        note: {
          label: "A quiet consequence",
          body: "This also means the recorded artifact is safe to commit as evidence, which is why the run logs are in the repo.",
        },
      },
      {
        kind: "p",
        text: "Control transfer to a human is a fenced lease, not a pause flag. Every transfer bumps an epoch, and an in-flight automation action that completes after a human took over is rejected rather than applied. A pause flag cannot give you that, and the failure it prevents is a click landing in the middle of an operator’s typing.",
      },
      { kind: "h", text: "The bug that sharpened the rule" },
      {
        kind: "p",
        text: "Assertions get retried; actions never do. You cannot distinguish \"the click was lost\" from \"the click worked and confirmation is slow\" by looking at a screen, so the safe reading is the one that does not act twice.",
      },
      {
        kind: "pull",
        text: "Clearing an interstitial often lands you where the interrupted action was already going, because the server accepted it. That would have double-posted a transaction.",
      },
      {
        kind: "p",
        text: "Live testing caught the sharper version, and replay now re-checks the checkpoint before repeating anything.",
        note: {
          label: "Found by running it",
          tone: "cost",
          body: "Not by reasoning about it. The rule as originally written was correct and still would have double-posted.",
        },
      },
      { kind: "h", text: "I built the target too" },
      {
        kind: "p",
        text: "apps/meridian is a deliberately hostile stand-in for a bank back-office app: a real frameset, table-based layout, ASP.NET-style ids, no test ids, no ARIA, no label-for. Form fields are labelled only by the adjacent table cell. It injects runtime faults on demand — interstitials, session expiry, HTTP 500, latency.",
        note: {
          label: "Why not a public demo site",
          body: "Public demo sites don’t break on command. To show how the engine handles a legacy app that half-fails, the error-path evidence had to be reproducible rather than anecdotal. All member data is synthetic.",
        },
      },
    ],
  },

  {
    slug: "firesight",
    title: "FireSight NYC",
    standfirst:
      "Four siloed NYC building-safety databases joined into one ranked inspection queue, tested against a fire that had already happened.",
    meta: "2026 · Python, Palantir Foundry, NYC Open Data",
    blocks: [
      {
        kind: "p",
        lede: true,
        text: "In 2022 a fire at the Twin Parks apartments in the Bronx killed 17 people. The doors that should have self-closed had been cited as violations years earlier, but those signals lived in separate city databases that never spoke to each other. FireSight asks a blunt question: if the data already existed, could the right building have been inspected first?",
      },
      {
        kind: "p",
        text: "Four NYC Open Data sources were joined into a single ontology, then scored 0–100 on self-closing-door violations, complaint history and building age. Every input stays visible and weighted rather than hidden behind a model, because an inspection queue a supervisor cannot argue with is one they will not use.",
      },
      {
        /* The Workshop app's own screen, from the owner's current site. It
           runs behind a Palantir AIP login, so it cannot be recaptured. */
        kind: "figure",
        src: "/firesight.jpg",
        alt: "FireSight's Inspection Command screen in Palantir Foundry: a dark map of the Bronx dotted with the 500 highest-risk buildings, beside a priority queue led by 2049 Bartow Avenue at risk score 100, and an AI-written dispatch plan below it",
        w: 1600,
        h: 821,
        caption:
          "Inspection Command, the dispatcher's view: the 500 highest-risk buildings on the map, the ranked queue beside it, and the model's reasons and dispatch plan underneath.",
      },
      { kind: "h", text: "The backtest" },
      {
        kind: "p",
        text: "Using only data available before the fire, the model ranked Twin Parks #1,003 of 89,496 Bronx parcels. That is the top 1.1%.",
        note: {
          label: "The uncomfortable half",
          tone: "cost",
          body: "It also means 1,002 buildings ranked ahead of it. Top 1.1% is a real signal on a queue nobody was running, not a bullseye, and anyone evaluating this should hold it to that standard.",
        },
      },
      { kind: "h", text: "Why a transparent score" },
      {
        kind: "p",
        text: "A black-box ranking is one a supervisor cannot argue with, and an inspection queue nobody can argue with is one nobody will use. Every input stays visible and weighted: open violations, how many of them are the self-closing-door kind, complaint density per unit, building age against the sprinkler mandate. A dispatcher can look at any building and see exactly which factors put it where it is.",
        note: {
          label: "The framing rule",
          body: "The claim is that the system would have put Twin Parks at the top of the queue, not that it would have prevented the fire. Those are different sentences and only one of them is true.",
        },
      },
      {
        kind: "p",
        text: "What the project does demonstrate is the same instinct as everything else here: a scoring model proposes an order, a transparent set of inputs lets a human verify it, and a backtest against a known outcome is the only thing that makes either trustworthy.",
      },
    ],
  },
];

export function getStudy(slug: string) {
  return studies.find((s) => s.slug === slug);
}
