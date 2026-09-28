/* ===========================================================================
   Content model.

   Every claim in this file is traceable to a source on disk or on the web.
   Numbers were verified on 2026-09-28 against the repos themselves, not
   against a resume. Where a figure moves (farewatch is still running), it
   carries the date it was read.
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

/* --- Not work -------------------------------------------------------------
   Hobbies get the same typographic weight as the employment. That is the
   whole argument of the section and it is never stated.

   Rule applied throughout: if the payload of a sentence is how much effort
   went in, it is a flex. If the payload is that the situation was absurd, it
   is a joke. Same facts, opposite read.

   `hot` marks the two numbers a reader can go and check. Turmeric appears
   five times on the entire site and two of them are here. */
export const notWork: {
  term: string;
  hot?: boolean;
  href?: string;
  line: string;
}[] = [
  {
    term: "213,965",
    hot: true,
    line: "flight prices, checked every few minutes since July. I have booked two of them. I look at the graph most mornings, which I understand is not normal.",
  },
  {
    term: "1709 rapid",
    hot: true,
    href: "https://lichess.org/@/YashNirwan",
    line: "I never learned any theory. I have played the London every game and worked the rest out live, which got me here across 2,669 games and will presumably stop working at some point.",
  },
  {
    term: "King of Comedy",
    line: "The Stephen Chow one, not the Scorsese. Hard enough to find that I ended up watching it on YouTube with subtitles from somewhere else entirely.",
  },
  {
    term: "Stay (2005)",
    line: "Better than its ratings suggested, which is roughly why I do not keep a Letterboxd. I would rather arrive at a film cold than through someone else's score.",
  },
  {
    term: "Mo lei tau",
    line: "Cantonese nonsense comedy, more or less. That, 90s Hong Kong action and Wong Kar-wai is most of what I watch.",
  },
  {
    term: "Unfinished books",
    line: "I start far more than I finish, and I have stopped pretending that is going to change.",
  },
];

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

/* --- Work ----------------------------------------------------------------

   No mandatory `cost` field. The previous version of this site required every
   project to state what was wrong with it, which is a schema enforcing
   self-deprecation rather than a person choosing honesty. Instead each entry
   has a `turn`: the thing that surprised me, cost me something, or that I
   would rather not have to say. Sometimes that is a lost metric. Sometimes it
   is a disclosure. It is never an apology.
   --------------------------------------------------------------------------- */

export type Work = {
  slug: string;
  title: string;
  year: string;
  role: string;
  claim: string;
  detail: string;
  turn: string;
  stack: string[];
  links: { label: string; href: string }[];
  image?: { src: string; alt: string; w: number; h: number; light?: boolean };
  hasStudy?: boolean;
};

export const work: Work[] = [
  {
    slug: "foreman",
    title: "Foreman",
    year: "2026",
    role: "Agentic vision, NVIDIA NIM",
    claim: "I built the eval before I trusted the demo.",
    detail:
      "A perception pass over-reports hazards on purpose; a second model re-opens the same frames and can only remove. 49 hand-labelled windows, seven ablation arms, three repeats. Frame-level verification roughly doubled precision, 0.15 to 0.35.",
    turn:
      "Recall fell from 0.80 to 0.60 paying for it, and the cheaper text-only verifier scored below doing nothing at all. I shipped both numbers.",
    stack: ["Python", "NVIDIA NIM", "Nemotron VL", "MCP", "Streamlit"],
    links: [
      { label: "Live demo", href: "https://foreman-safety.streamlit.app" },
      { label: "GitHub", href: "https://github.com/YashNirwan/foreman" },
      { label: "Full eval", href: "https://github.com/YashNirwan/foreman/blob/main/evals/RESULTS.md" },
    ],
    hasStudy: true,
  },
  {
    slug: "interface-cua",
    title: "interface-cua",
    year: "2026",
    role: "Computer-use agent, TypeScript",
    claim: "The model plans the run once. Replay executes it with no model in the loop.",
    detail:
      "14,373 lines of TypeScript. A lookup for a member who does not exist returns MEMBER_NOT_FOUND with exit code 0, not a checkpoint failure \u2014 because \u201cno such member\u201d is an answer, and the calling agent should not have to string-match an error to find that out.",
    turn:
      "Public demo sites do not break on command, so I wrote the legacy bank that does. It injects interstitials, session expiry, HTTP 500s and latency, which is what makes the error-path evidence reproducible rather than anecdotal.",
    stack: ["TypeScript", "Playwright", "zod", "Node.js"],
    links: [],
    image: {
      src: "/meridian.png",
      alt: "Meridian Core, a deliberately hostile 2000s bank back-office app, showing a member search that returned no records",
      w: 3840,
      h: 660,
      light: true,
    },
    hasStudy: true,
  },
  {
    slug: "raivana",
    title: "Raivana",
    year: "2024 \u2014 now",
    role: "Founder, full-stack commerce",
    claim: "A storefront that takes real money, which is a different standard than a demo.",
    detail:
      "242 commits. An HMAC-verified webhook handler and an idempotency key store with a 30-day TTL, so a payment lands exactly once. 156 products, 8 currencies, geolocation-routed.",
    turn:
      "Vanilla JS, no framework, no test suite. Right for one person and 156 products, and the first thing I would undo before a second person touched it.",
    stack: ["Node.js", "Netlify Functions", "Razorpay", "Shiprocket"],
    links: [
      { label: "Live", href: "https://raivana.in/" },
      { label: "GitHub", href: "https://github.com/yashnirwan/Raivana" },
    ],
    image: {
      src: "/raivana.jpg",
      alt: "The Raivana storefront showing handcrafted Rajasthani homeware",
      w: 1500,
      h: 754,
    },
  },
  {
    slug: "firesight",
    title: "FireSight NYC",
    year: "2026",
    role: "Civic data analysis",
    claim:
      "Using only data that existed before the fire, the model ranked Twin Parks #1,003 of 89,496 Bronx parcels.",
    detail:
      "Four siloed NYC Open Data sources joined into one ontology, then scored 0\u2013100 on self-closing-door violations, complaint history and building age. Every input stays visible and weighted, because an inspection queue a supervisor cannot argue with is one they will not use.",
    turn:
      "Which also means 1,002 buildings ranked ahead of it. And most of the implementation was written by Claude Code driving a browser rather than by me typing \u2014 I am listing this for the analysis, not the engineering.",
    stack: ["Python", "Palantir Foundry", "AIP Logic", "NYC Open Data"],
    links: [{ label: "GitHub", href: "https://github.com/yashnirwan/firesight-nyc" }],
    image: {
      src: "/firesight.jpg",
      alt: "FireSight inspection command centre showing ranked Bronx parcels on a risk map",
      w: 1600,
      h: 821,
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
