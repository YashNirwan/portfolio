/* ===========================================================================
   Content model for The Margin.

   Every claim in this file is traceable to a source on disk or on the web.
   Numbers were verified on 2026-09-28 against the repos themselves, not
   against a résumé. Where a figure moves (farewatch is still running), it
   carries the date it was read.

   The shape is deliberately paired: most things that make a claim also carry
   a `note`, because the margin is where this site does its arguing.
   =========================================================================== */

export const profile = {
  name: "Yash Nirwan",
  location: "New York, NY",
  education: "MS Management of Technology, NYU — May 2026",
  priorDegree: "BE Computer Science, Ramaiah Institute of Technology",
};

export const SITE = "https://yashnirwan.com";

export const links = {
  email: "yn2328@nyu.edu",
  linkedin: "https://www.linkedin.com/in/yash-nirwan-6942b2194",
  github: "https://github.com/yashnirwan",
  resume: "/Yash_Nirwan.pdf",
};

/* --- The statement -------------------------------------------------------- */

/* The opening leads with a scene rather than a position. A position is
   something a stranger could put someone else's name on; this scene only
   happened to one person, and it is simultaneously the funniest thing here
   and the hardest piece of evidence. */
export const statement = {
  first: "Yash",
  last: "Nirwan",
  /* Orienting, not arguing. The reader needs to know who this is before a
     story about vision models can land — dropping the forklift scene
     straight under the name gave them no bridge. */
  lede:
    "I build things that check other things. Nineteen months of that was paid, in insurance data and at a startup small enough that I also wrote the sales copy. The rest was because I wanted to know.",
  ledeAfter: "I finish a master's at NYU in May.",
  trim: "Index — New York",
  currently:
    "An eval harness for computer-use agents, and a flight-price watcher I have not turned off.",
  currentlyDate: "September 2026",
};

/* The bone slab. The single light plate in a page of saturated colour, and
   the only place the page reverses — which is what makes it land. It carries
   the best thing in the material at display scale rather than burying it in
   body copy where it reads as a non-sequitur. */
export const forklift = {
  /* Authored to the break, and short. Display type teases; the body below
     explains. The longest line here is eleven characters, which holds inside
     a 390px viewport at wdth 104. */
  lines: ["Both models", "believed a", "title card."],
  attribution: "foreman, 2026. I published that about my own system.",
  body:
    "The first frame of the first video was a title card: black screen, white words, PASSING IN FRONT OF A FORKLIFT. The perception model reported a pedestrian walking in front of a moving forklift at 0.95 confidence, and the verifier confirmed it as high severity. Both models had turned printed words into an observed event.",
  after:
    "Burned-in text is everywhere in real footage, so a scene gate in the same call removed the whole class at no extra cost. Finding things like that is most of what I actually do.",
};

/* The madder plate. First person, specific, and the origin of everything
   below it. */
export const bio = {
  paragraphs: [
    "I spent nineteen months in insurance data, where I once found a $4M property that had been keyed in as $40M. Nobody had noticed.",
    "That is more or less the story of everything I have built since. Something proposes an answer, and the interesting work is what you put downstream of it — a check, a second pass, a number you can go and verify yourself.",
    "I finish a master's at NYU in May. Before that, a CS degree, a year at Accenture and a product role at a startup small enough that I also wrote the sales copy.",
  ],
  trim: "Accenture, 2023–24 · Amoga, 2022–23 · NYU, 2024–26",
  /* Pre-cropped to 4:5 rather than cropped in CSS, so the browser isn't
     downloading pixels it will throw away. The source was a downscaled
     665x1182 copy; this is as much resolution as exists. */
  portrait: {
    src: "/portrait-4x5.jpg",
    alt: "Yash Nirwan on Calton Hill in Edinburgh, in a sherpa jacket and beanie, the National Monument behind him",
    w: 800,
    h: 1000,
  },
};

/* --- The argument --------------------------------------------------------- */

export const argument = {
  heading: "Why this is one job and not four",
  paragraphs: [
    "At Accenture I spent a year on commercial property data that arrived from brokers in whatever shape they felt like sending. Some of it was wrong in ways that mattered — a $4M building entered as $40M. You cannot review a hundred thousand rows by hand, so you write the cross-field checks that catch the row worth looking at.",
    "Every AI system I’ve built since is that same move, pointed at a model instead of a spreadsheet. Ask a vision model whether footage contains a hazard and it will almost always say yes. Ask an LLM for a tracklist and it will invent songs that don’t exist. The interesting part was never the generation. It’s what you put downstream of it.",
    "That work doesn’t stay in one discipline. Something has to propose, something has to verify, someone has to see what the check caught, and someone has to explain to a person with a budget what it means. Those are four layers of one problem, not four jobs.",
  ],
  note: {
    label: "A related lesson",
    body: "I once built a five-call orchestration for my own job applications and told myself it cost 15k tokens. Measured, it cost 161k — about 14k of fixed harness overhead, five times over. I deleted the architecture. Measuring your own work is the same instinct as verifying a model’s.",
  },
};

/* --- Work ----------------------------------------------------------------- */

export type Note = {
  label?: string;
  body: string;
  tone?: "default" | "cost";
};

export type Work = {
  slug: string;
  title: string;
  year: string;
  role: string;
  /* lead gets the full spread; minor gets a compressed one; note is a single
     margin paragraph with no spread of its own. */
  weight: "lead" | "major" | "minor" | "note";
  claim: string;
  evidence: string;
  cost?: string;
  also?: string;
  stack: string[];
  links: { label: string; href: string }[];
  image?: { src: string; alt: string; w: number; h: number };
  note?: Note;
  hasStudy?: boolean;
};

export const work: Work[] = [
  {
    slug: "foreman",
    title: "Foreman",
    year: "2026",
    role: "Agentic vision, NVIDIA NIM",
    weight: "lead",
    claim:
      "A second model that can only remove things roughly doubled precision on hazard detection.",
    evidence:
      "49 hand-labelled windows, seven ablation arms, three repeats. Precision 0.15 → 0.35 on a single run, 0.34 averaged.",
    cost: "Recall fell from 0.80 to 0.60. That’s a real trade, not a free lunch.",
    also:
      "The cheaper text-only verifier scored below doing nothing at all. I shipped that result too.",
    stack: ["Python", "NVIDIA NIM", "Nemotron VL", "MCP", "Streamlit", "ffmpeg"],
    links: [
      { label: "Live demo", href: "https://foreman-safety.streamlit.app" },
      { label: "GitHub", href: "https://github.com/YashNirwan/foreman" },
      { label: "Full eval", href: "https://github.com/YashNirwan/foreman/blob/main/evals/RESULTS.md" },
    ],
    image: {
      src: "/foreman.jpg",
      alt: "Foreman review console showing verified warehouse safety alerts with evidence clips",
      w: 1500,
      h: 1000,
    },
    note: {
      label: "The one that changed the design",
      body: "Both models once described a pedestrian walking in front of a moving forklift. The frame was a black title card reading PASSING IN FRONT OF A FORKLIFT. Burned-in text is everywhere in real footage; a scene gate in the same call removed the whole class at no extra cost.",
    },
    hasStudy: true,
  },
  {
    slug: "interface-cua",
    title: "interface-cua",
    year: "2026",
    role: "Computer-use agent, TypeScript",
    weight: "major",
    claim:
      "The model plans the run once. Replay executes it with no model in the loop at all.",
    evidence:
      "14,373 lines of TypeScript over Playwright and zod, including a legacy target app I built myself with injectable faults.",
    cost:
      "A plan that goes stale fails loudly rather than improvising. That’s the intended behaviour, but it means the agent is brittle by design.",
    stack: ["TypeScript", "Playwright", "zod", "Node.js"],
    links: [],
    note: {
      label: "Why build the target",
      body: "Public demo sites don’t break on command. To test how an agent handles a legacy CRM that half-fails, I had to write the legacy CRM that half-fails — so the error paths would reproduce identically on every run.",
    },
    hasStudy: true,
  },
  {
    slug: "raivana",
    title: "Raivana",
    year: "2024 – now",
    role: "Founder, full-stack commerce",
    weight: "minor",
    claim: "A live storefront that takes real money, which is a different standard than a demo.",
    evidence:
      "242 commits. HMAC-verified webhook handler and an idempotency key store with a 30-day TTL, so a payment lands exactly once. 156 products, 8 currencies.",
    cost:
      "Vanilla JS, no framework, no test suite. That was the right call for one person and 156 products, and it is the first thing I would undo before a second person touched it.",
    stack: ["Node.js", "Netlify Functions", "Razorpay", "Shiprocket", "Vanilla JS"],
    links: [
      { label: "Live", href: "https://raivana.in/" },
      { label: "GitHub", href: "https://github.com/yashnirwan/Raivana" },
    ],
    image: {
      src: "/raivana.jpg",
      alt: "Raivana storefront showing handcrafted Rajasthani homeware",
      w: 1500,
      h: 754,
    },
    note: {
      body: "Takes about 15 seconds to cold start. It’s a real store with real orders, not a demo, so I didn’t pay for always-on.",
    },
  },
  {
    slug: "farewatch",
    title: "farewatch",
    year: "2026",
    role: "Personal infrastructure",
    weight: "note",
    claim: "Nobody asked for this one.",
    evidence:
      "A flight-price watcher running unattended on four launchd agents. 213,257 observations and 441 alerts as of 28 September 2026, when I last looked. It alerted that morning.",
    stack: ["Python", "SQLite", "launchd"],
    links: [],
    note: {
      body: "Four swappable data sources behind one interface, a statistical baseline rather than a fixed threshold, and a small unit-test suite over the pure functions. It has an audience of one.",
    },
  },
  {
    slug: "firesight",
    title: "FireSight NYC",
    year: "2026",
    role: "Civic data analysis",
    weight: "minor",
    claim:
      "Using only data that existed before the fire, the model ranked Twin Parks #1,003 of 89,496 Bronx parcels.",
    evidence:
      "Four siloed NYC Open Data sources joined into one ontology, with a transparent 0–100 risk score weighting self-closing-door violations, complaint history and building age.",
    cost:
      "Which also means 1,002 buildings ranked ahead of it. Top 1.1% is a real signal, not a bullseye.",
    stack: ["Python", "Palantir Foundry", "AIP Logic", "NYC Open Data"],
    links: [{ label: "GitHub", href: "https://github.com/yashnirwan/firesight-nyc" }],
    image: {
      src: "/firesight.jpg",
      alt: "FireSight NYC inspection command centre showing ranked Bronx parcels in Palantir Foundry",
      w: 1600,
      h: 821,
    },
    note: {
      label: "How this was built",
      tone: "cost",
      body: "Most of this was written by Claude Code driving a browser, not by me typing. I’m listing it for the analysis, not the engineering. Saying so costs me the impressive version and keeps the claim checkable, which is the trade this whole site is about.",
    },
    hasStudy: true,
  },
];

/* --- The record ----------------------------------------------------------- */

export const record = {
  roles: [
    {
      org: "Accenture",
      title: "Product & Strategy Associate, Financial Services",
      period: "Jul 2023 – Jul 2024",
      lines: [
        "Commercial-insurance data platform covering 1,000+ property records, inside a team of about ten.",
        "Built the cross-field validation framework that caught a material data anomaly, and wrote the executive brief that got it remediated.",
        "Took AI-assisted validation adoption from 40% to 95% in eight weeks using a catch-log and field feedback.",
        "Cut correction cycles by 20 percentage points working across compliance, actuarial and data engineering.",
      ],
    },
    {
      org: "Amoga",
      title: "Product Manager, B2B SaaS",
      period: "Dec 2022 – Jun 2023",
      lines: [
        "Owned a CRM product end to end: research, stories, backlog, sprint ceremonies and the go-to-market around it.",
        "Drove +7% web traffic and +10% lead conversion through outbound campaigns and funnel dashboards in Superset and GA.",
      ],
    },
    {
      org: "American Express",
      title: "Graduate capstone engagement, NYU",
      period: "Jan – May 2026",
      lines: ["A client engagement run through NYU, not employment. Listed for completeness."],
    },
  ],
  education: [
    { school: "New York University", detail: "MS Management of Technology", period: "2024 – 2026" },
    {
      school: "Ramaiah Institute of Technology",
      detail: "BE Computer Science — a CS degree I still use",
      period: "2019 – 2023",
    },
  ],
  note: {
    label: "The boring answers",
    body: "About 19 months of professional experience, in product and data roles rather than engineering-titled ones. The engineering is real but it lives in the work above, not in a job title. Based in New York.",
  },
};

/* --- Archive -------------------------------------------------------------- */

export const archive: {
  title: string;
  year: string;
  line: string;
  href?: string;
  kind: "project" | "coursework";
}[] = [
  {
    title: "VibeCheck",
    year: "2025",
    kind: "project",
    line: "LLM proposes a tracklist; a YouTube Music API layer validates the invented songs out of existence.",
    href: "https://github.com/yashnirwan/VibeCheck",
  },
  {
    title: "Retail stockout prediction",
    year: "2025",
    kind: "coursework",
    line: "Team of four; I led the EDA, not the model. Found a 'buffer illusion' that broke the obvious threshold rule.",
    href: "https://github.com/yashnirwan/walmart-stockout-prediction",
  },
  {
    title: "Coupon acceptance",
    year: "2025",
    kind: "coursework",
    line: "An assignment. I treated it like a client brief because that’s more interesting than a grade.",
    href: "https://github.com/yashnirwan/coupon-acceptance-prediction",
  },
  {
    title: "Spotify review mining",
    year: "2025",
    kind: "coursework",
    line: "Sentiment and theme extraction over 20k reviews, turned into roadmap priorities.",
    href: "https://github.com/yashnirwan/Spotify-Product-Analytics-NLP",
  },
  {
    title: "RFM segmentation",
    year: "2025",
    kind: "coursework",
    line: "Recency-frequency-monetary segmentation in SQL, visualised in Tableau.",
    href: "https://github.com/yashnirwan/RFM-Analysis",
  },
];
