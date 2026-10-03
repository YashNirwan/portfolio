import type { Block } from "./studies";

/* ===========================================================================
   Content.

   Written to be understood by someone who has never heard of a vision model.
   Every project says what the problem was, what the thing does, and what
   happened — in that order, in plain words. Jargon only appears after the
   plain-language version has already landed.

   Numbers were verified on 2026-09-28 against the repos and databases
   themselves, not against a resume.
   =========================================================================== */

export const profile = {
  name: "Yash Nirwan",
  location: "New York, NY",
};

export const SITE = "https://yashnirwan.com";

export const links = {
  email: "yn2328@nyu.edu",
  linkedin: "https://www.linkedin.com/in/yash-nirwan-6942b2194",
  github: "https://github.com/yashnirwan",
  resume: "/Yash_Nirwan.pdf",
};

/* --- The lede ------------------------------------------------------------- */

export const lede = {
  banner: "Nirwan",
  /* NOT a job title. The reference puts "INTERACTIVE ARTIST!" here and I
     filled the slot with one out of habit, which is the exact shoehorning
     this site is built to avoid — and "software engineer" is not even
     accurate: neither paid role carried that title. A stance instead. */
  kicker: "Prove it!",
  roles: [
    "Builds the check,",
    "not just the thing.",
    "Based in New York.",
  ],
  creed:
    "A demo tells you something can work once. A measurement tells you how often it works, and what it costs when it does. I would rather hand you the second one, even when the number is worse than the story.",
  headline: "I build the part that decides whether to believe the answer.",
  standfirst:
    "Most of what I make checks something else. I would rather hand you the measurement than the demo.",
  /* Opens the drop-cap column. Plain enough to be understood on one read,
     which the previous version was not. */
  paragraphs: [
    "Almost everything I make has the same shape. Something produces an answer — a model, a spreadsheet, a payment provider — and I build the part that works out whether to trust it.",
    "I learned that on unglamorous data. For a year at Accenture I worked on commercial insurance records that arrived from brokers in whatever shape they felt like sending, and once found a $4 million property that had been entered as $40 million. Nobody had noticed. You cannot read a hundred thousand rows by hand, so you write the checks that find the row worth reading.",
    "Everything since has been that same move pointed somewhere new: video, browsers, payments, city records. I graduated from NYU in May 2026 with a master's in Management of Technology, and before that took a computer science degree I still use daily.",
  ],
  meta: "Accenture, 2023–24 · Amoga, 2022–23 · NYU, MS 2026",
};

/* --- The dispatch ---------------------------------------------------------
   A boxed story, set up before it is delivered. The previous version led
   with the punchline and assumed the reader could supply the setup, which
   nobody outside the field can. */

export const dispatch = {
  kicker: "From the notebook",
  headline: "The model read a sign and called it an accident.",
  paragraphs: [
    "Ask a model to watch footage for accidents and it will find accidents, because finding them is what you asked about. Mine once reported a pedestrian walking in front of a moving forklift, at 95% confidence. A second model agreed and marked it high severity.",
    "The frame was a black title card. Printed on it, in white letters, were the words PASSING IN FRONT OF A FORKLIFT. It had read the words and filed them as something it had seen.",
    "Printed text is everywhere in real footage — slates, timestamps, captions burned into the picture. One extra check in the same call removed that whole category of mistake at no added cost. Finding things like this is most of the job, and it is why I build the measurement before I trust the demo.",
  ],
};

/* --- Work ----------------------------------------------------------------- */

export type Work = {
  slug: string;
  title: string;
  kicker: string;
  standfirst: string;
  body: string;
  turn: string;
  stack: string[];
  links: { label: string; href: string }[];
  /* objectPosition matters for very wide sources: a 3840x660 screenshot
     cropped to a card aspect takes a centred slice, which for a mostly-empty
     app UI is a slice of nothing. */
  image?: { src: string; alt: string; w: number; h: number; position?: string };
  hasStudy?: boolean;
  isNew?: boolean;
  /* Evidence shown on the project page under the text — a real screenshot
     or a real chart — as distinct from `image`, the drawn plate that is the
     project's cover. The owner rejected screenshots as COVERS; these are
     figures, captioned, in the reading column. */
  figures?: Omit<Extract<Block, { kind: "figure" }>, "kind">[];
};

export const work: Work[] = [
  {
    slug: "foreman",
    title: "Foreman",
    kicker: "Warehouse safety · 2026",
    standfirst:
      "Ask an AI to watch security footage for hazards and it finds them everywhere, because that is what you asked about.",
    body:
      "Foreman runs two passes. The first watches warehouse video and flags anything that might be a hazard. The second re-opens those same frames and throws out the ones that do not hold up. To find out whether the second pass was worth having, I hand-labelled 49 clips and tested seven versions of the idea against them. It roughly doubled how often an alert turned out to be real, from 15% to 35%.",
    turn:
      "It also missed more of the genuine hazards, catching 60% where the first pass alone caught 80%. That is the trade, and I published it rather than quoting the half that flatters me.",
    stack: ["Python", "NVIDIA NIM", "Nemotron VL", "MCP"],
    links: [
      { label: "Live demo", href: "https://foreman-safety.streamlit.app" },
      { label: "GitHub", href: "https://github.com/YashNirwan/foreman" },
      {
        label: "The full eval",
        href: "https://github.com/YashNirwan/foreman/blob/main/evals/RESULTS.md",
      },
    ],
    hasStudy: true,
    isNew: true,
    image: {
      src: "/art/foreman.jpg",
      alt: "Engraving of a warehouse aisle: pallet racking on both sides, a forklift in the aisle, and one pallet flagged in ember",
      w: 1456,
      h: 816,
    },
  },
  {
    slug: "interface-cua",
    title: "interface-cua",
    kicker: "Automation · 2026",
    standfirst:
      "A lot of company software has no way in except the screen. To get data out, something has to click through it the way a person would.",
    body:
      "This lets an AI work out a task once — sign in, look up a customer, read the result — and records exactly what it did. After that the recording replays on its own, with no AI involved, so it does the same thing every time instead of improvising a new route and quietly getting it wrong.",
    turn:
      "Real systems fail in ways demos never do, so I also built the thing it practises on: a fake bank back-office that breaks on purpose. It drops sessions, throws errors and stalls on command, which is what makes the failures worth measuring.",
    stack: ["TypeScript", "Playwright", "zod"],
    links: [],
    hasStudy: true,
    isNew: true,
    image: {
      src: "/art/interface-cua.jpg",
      alt: "Engraving of an old computer terminal showing a ruled form of unlabelled fields, with one field flagged in ember",
      w: 1456,
      h: 816,
    },
  },
  {
    slug: "raivana",
    title: "Raivana",
    kicker: "Shop · 2024 to now",
    standfirst:
      "A shop I built and still run, selling Rajasthani homeware to customers across eight currencies.",
    body:
      "Most of the work here is invisible. When someone pays, the payment company tells the site — and sometimes tells it twice, or late, or while the customer is refreshing the page. Making sure one order is recorded exactly once through all of that is the real engineering, and it is the difference between a demo and a shop.",
    turn:
      "It is plain JavaScript with no framework and no tests. That was right for one person and 156 products, and it is the first thing I would change before a second person touched it.",
    stack: ["Node.js", "Netlify Functions", "Razorpay"],
    links: [
      { label: "Visit the shop", href: "https://raivana.in/" },
      { label: "GitHub", href: "https://github.com/yashnirwan/Raivana" },
    ],
    figures: [
      {
        src: "/raivana.jpg",
        alt: "The Raivana shop's home page: 'Objects with centuries of memory', a hand-painted ceramic vase, and links to brass, ceramics and woodwork",
        w: 1500,
        h: 754,
        caption: "The shop as customers see it, at raivana.in.",
      },
    ],
    image: {
      src: "/art/raivana.jpg",
      alt: "Engraving of five thrown Rajasthani vessels on a shelf between block-printed borders, one picked out in ember",
      w: 1456,
      h: 816,
    },
  },
  {
    slug: "vibecheck",
    title: "VibeCheck",
    kicker: "Music · 2025",
    standfirst:
      "Ask a language model for a playlist and it will confidently invent songs that do not exist.",
    body:
      "So the model never gets the last word. It proposes tracks, and then the app checks every single one against YouTube Music before showing you anything — forty at a time, in parallel. Anything it cannot find gets dropped rather than displayed with a broken link.",
    turn:
      "It is the smallest version of the idea I keep coming back to: let the model be creative, then put something boring and literal downstream of it.",
    stack: ["Python", "gpt-oss-120b", "Groq", "Streamlit"],
    links: [
      { label: "Try it", href: "https://newvibecheck.streamlit.app" },
      { label: "GitHub", href: "https://github.com/yashnirwan/VibeCheck" },
    ],
    figures: [
      {
        src: "/video/vibecheck-poster.jpg",
        video: { mp4: "/video/vibecheck.mp4", webm: "/video/vibecheck.webm" },
        alt: "Screen recording of VibeCheck: typing a Kung Fu Hustle prompt, eight suggested tracks being checked against YouTube Music, the resulting playlist, and a notice naming the one track that could not be verified and was dropped",
        w: 1600,
        h: 900,
        caption:
          "The live app, asked for Kung Fu Hustle. Eight tracks proposed, seven found on YouTube Music. The eighth — Bai Guang, “夜来香”, 1940 — could not be matched, so it was dropped and named rather than shown. Most runs of this prompt check out clean; this was one of the four in eight that did not. The wait while the model writes the list is shortened.",
      },
    ],
    image: {
      src: "/art/vibecheck.jpg",
      alt: "Engraving of a grid of fifteen records; one is an empty dashed outline in ember, a track that does not exist",
      w: 1456,
      h: 816,
    },
  },
  {
    slug: "farewatch",
    title: "farewatch",
    kicker: "Nobody asked · 2026",
    standfirst:
      "A thing I built for myself that has been running unattended on my laptop since July.",
    body:
      "It checks the price of flight routes out of New York every few minutes, keeps every observation, and tells me when a fare drops far enough below its own recent baseline to be worth a look. Not a fixed threshold — a route that is always cheap should not alert every morning.",
    turn:
      "214,882 observations and 442 alerts so far. I have booked two flights off it. Nobody asked for it and it has never been switched off.",
    stack: ["Python", "SQLite", "launchd"],
    links: [{ label: "GitHub", href: "https://github.com/YashNirwan/farewatch" }],
    figures: [
      {
        /* Real data, animated: every fare farewatch.db holds for EWR to Tokyo
           with a December departure, the running median anomaly.py compares
           against (drawn as it stood after each poll), and the five alerts the
           route actually fired, at their real times and prices. Rebuilt from
           the raw observations, the medians and counts match the alerts'
           own text. */
        src: "/video/farewatch-poster.jpg",
        video: { mp4: "/video/farewatch.mp4", webm: "/video/farewatch.webm" },
        alt: "Animated chart of every fare farewatch recorded for Newark to Tokyo with a December departure, from Aug 22 to Sep 14: dots for each fare, a running median that settles at $1,897, a dashed alert line at 0.6 times the median, and five alerts in ember, ending on a $735 fare with farewatch's own alert text: 61% below the $1,897 median of 176 observations",
        w: 1600,
        h: 900,
        caption:
          "Every fare farewatch recorded for Newark to Tokyo with a December departure: 197 of them, Aug 22 to Sep 14. The solid line is the median the alert rule compares against; the dashed one is where it fires, at 60% of it. The five red points are the five alerts this route actually sent. The last, a $735 United round trip, came in 61% under a $1,897 median built from 176 earlier fares, and was the cheapest it ever saw.",
      },
      {
        /* Real data: scripts/farewatch-plot.py drawing
           scripts/farewatch-series.json, the committed slice of the
           owner's farewatch.db (six routes, cheapest fare per three-hour
           window). The alert line is anomaly.py's 0.6 x median, taken here
           over the whole route rather than per departure month. */
        src: "/farewatch.svg",
        narrow: { src: "/farewatch-narrow.svg", w: 620, h: 2212 },
        alt: "Six small line charts, one per route from New York: three to Seattle with medians of $337 to $357, three to Houston with medians of $238 to $267, from late July to late September. The Seattle routes never approach their alert lines. LGA and EWR to Houston both drop into the alert zone in mid-September, to $140 and $142.",
        w: 1440,
        h: 708,
        caption:
          "The cheapest fare in every three-hour window for the routes farewatch watches most. The dashed line is each route's median; the shaded band is where it alerts, under 60% of that. Two Houston routes fell into it in September.",
      },
    ],
    image: {
      src: "/art/farewatch.jpg",
      alt: "Engraving of six fare traces against a dashed baseline band, one dropping away below it in ember",
      w: 1456,
      h: 816,
    },
  },
  {
    slug: "firesight",
    title: "FireSight",
    kicker: "Civic data · 2026",
    standfirst:
      "Four New York City databases hold warnings about which buildings are fire risks. None of them talk to each other.",
    body:
      "In 2022 a fire at Twin Parks in the Bronx killed seventeen people. The building had been cited years earlier for fire doors that failed to close on their own, which is why smoke filled the stairwells. I joined the four datasets and scored every building in the borough on the signals that actually matter: open violations, complaint history, age.",
    turn:
      "Using only records that existed before the fire, Twin Parks came out 1,003rd of 89,496 buildings. That is the top 1.1% of a queue nobody was running — and it also means a thousand buildings ranked ahead of it.",
    stack: ["Python", "Palantir Foundry", "NYC Open Data"],
    links: [{ label: "GitHub", href: "https://github.com/yashnirwan/firesight-nyc" }],
    hasStudy: true,
    image: {
      src: "/art/firesight.jpg",
      alt: "Engraving of a tenement facade with a fire escape running up its centre bay, one window flagged in ember",
      w: 1456,
      h: 816,
    },
  },
];

/* --- The back page --------------------------------------------------------
   Newspapers keep the lighter material on the back page, and that is the
   organising idea rather than a list of hobbies with no reason to be there.
   Each entry is something I actually do, not a trait I am claiming. */

export const backPage = {
  /* The heading stays "The back page"; the line under it says plainly what
     is on it. It used to sit small and faint off to the right, so readers
     could not tell these were interests. */
  standfirst:
    "What I'm into, off the clock: the things I would talk about for an hour if you let me. One of them got out of hand and is still running.",
  items: [
    {
      term: "Hong Kong cinema",
      unit: "mostly the nineties",
      image: {
        src: "/art/marquee.jpg",
        alt: "Engraving of a cinema marquee with an unlettered bill, one bulb along its edge lit in ember",
        w: 1216,
        h: 832,
      },
      line: "Stephen Chow first, then the action films, then Wong Kar-wai when I want to feel something. Mo lei tau — the nonsense-comedy style Chow works in — is the thing I will talk your ear off about. King of Comedy was hard enough to find that I ended up watching it on YouTube with subtitles from somewhere else entirely.",
    },
    {
      term: "Films the ratings got wrong",
      unit: "exhibit A: Stay, 2005",
      image: {
        src: "/art/ticket.jpg",
        alt: "Engraving of a ticket torn along its perforation, the last figure of its serial printed in ember",
        w: 1216,
        h: 832,
      },
      line: "A film almost everyone scored badly and I think is good. That disagreement is roughly why I do not keep a Letterboxd: I would rather come to something cold than through someone else's score.",
    },
    {
      term: "Chess",
      unit: "1709 rapid on Lichess",
      href: "https://lichess.org/@/YashNirwan",
      image: {
        src: "/art/chessboard.jpg",
        alt: "Engraving of a chessboard four moves into the London System, the bishop's square marked in ember",
        w: 1216,
        h: 832,
      },
      line: "I never learned any theory. I have opened with the London 2,669 times and worked out everything after move four as it happened, which has got me this far and will presumably stop working at some point.",
    },
    {
      term: "Going places cheaply",
      unit: "which is why farewatch exists",
      image: {
        src: "/art/going-places.jpg",
        alt: "Engraving of a battered, sticker-covered suitcase on a platform with an ember luggage tag on its handle and a propeller plane passing overhead",
        w: 1216,
        h: 832,
      },
      line: "I like going places and I graduated broke, which is a bad combination. So I wrote something to watch flight routes out of New York and tell me when a fare drops far enough below its own baseline to be worth taking. 214,882 readings since July. I have booked two of them.",
    },
  ],
};

/* --- The record -----------------------------------------------------------
   Deliberately plain and complete. A recruiter needs to reconstruct a CV in
   thirty seconds without reading any of the prose above, and giving them a
   boring block low on the page is what frees the top of the site from having
   to do that job. */

export const record = {
  roles: [
    {
      org: "Accenture",
      title: "Product & Strategy Associate, Financial Services",
      period: "Jul 2023 – Jul 2024",
      lines: [
        "Commercial-insurance data covering 1,000+ properties, inside a team of about ten.",
        "Built the cross-field checks that caught a $4 million property entered as $40 million, and wrote the brief that got it corrected.",
        "Took AI-assisted validation from 40% to 95% adoption in eight weeks, using a log of what the checks caught to win people over.",
        "Cut correction cycles by 20 percentage points across compliance, actuarial and data engineering.",
      ],
    },
    {
      org: "Amoga",
      title: "Product Manager, B2B SaaS",
      period: "Dec 2022 – Jun 2023",
      lines: [
        "Owned a CRM product end to end at a startup: research, stories, backlog, sprints, and the go-to-market around it.",
        "Grew web traffic 7% and lead conversion 10% through outbound campaigns and funnel dashboards in Superset and Google Analytics.",
        "Wrote the buyer-facing copy and sales kits, because there was nobody else to write them.",
      ],
    },
  ],
  education: [
    { school: "New York University", detail: "MS, Management of Technology", period: "2024 – 2026" },
    {
      school: "Ramaiah Institute of Technology",
      detail: "BE, Computer Science",
      period: "2019 – 2023",
    },
  ],
};

/* --- The archive ----------------------------------------------------------
   Coursework, labelled as coursework. It belongs on the site because volume
   is evidence of practice, and it belongs down here because it is not the
   argument. */

/* Shown above the list, because an unlabelled block of four project titles
   reads as professional work and these are not that. */
export const archiveNote =
  "Coursework, labelled as coursework — volume is evidence of practice, not the argument.";

export const archive: { title: string; year: string; line: string; href: string }[] = [
  {
    title: "Retail stockout prediction",
    year: "2025",
    line: "Team of four; I led the analysis, not the model. Found that stockouts and healthy stock had near-identical inventory buffers, which broke the obvious threshold rule everyone starts with.",
    href: "https://github.com/yashnirwan/walmart-stockout-prediction",
  },
  {
    title: "Coupon acceptance",
    year: "2025",
    line: "57 engineered features predicting which drivers take a coupon, turned into a recommendation about which amenities a highway should actually build.",
    href: "https://github.com/yashnirwan/coupon-acceptance-prediction",
  },
  {
    title: "Spotify review mining",
    year: "2025",
    line: "Twenty thousand app reviews sorted into themes, then mapped onto what a product team should fix first.",
    href: "https://github.com/yashnirwan/Spotify-Product-Analytics-NLP",
  },
  {
    title: "RFM segmentation",
    year: "2025",
    line: "Recency, frequency and spend, in SQL, visualised in Tableau. The plainest possible version of turning a table into a decision.",
    href: "https://github.com/yashnirwan/RFM-Analysis",
  },
];

/* --- Portrait -------------------------------------------------------------
   Pre-cropped to 4:5 rather than cropped in CSS, so the browser is not
   downloading pixels it throws away. */

/* There was a `plate` key here pointing at /plate-portrait.png, described in
   a comment as a halftone dot screen that put the portrait in the page's own
   palette. No such file is in the repo and nothing ever read the key, so the
   comment described an intention rather than the site. Removed rather than
   left as a claim about a file that does not exist. The halftone is still the
   better idea; it needs the plate to be generated and committed first. */

/* The portrait is the owner's own illustrated version of the Calton Hill
   photo, supplied 2026-09-30 and used as given — colour intact, cropped
   just inside its printed keyline (it arrived as a photograph of the print,
   with a strip of the page above it and a ~0.3° tilt that the inset absorbs).

   It replaces three generated attempts, all rejected: a duotone of the photo
   (read as a pasted-on photo), a stipple hedcut (too detailed), and a bold
   linocut. The reference's own portraits are colour illustrations sitting
   under the page's paper layer, which is what this now does. The original
   photo stays at /portrait-4x5.jpg. */
/* The /about classified: the owner asked for something fun that says he is
   looking, and says the quiet part. Every fact in it is already on the site:
   NYU, May 2026, and the four areas in the page title. */
export const situationWanted = {
  kicker: "Situation wanted",
  headline: "Graduated. Gowned. Available.",
  paragraphs: [
    "That is Yankee Stadium in May 2026: one master's degree, one gown in NYU violet, one person squinting at the sun. What I am looking for now is the right next room: a role in strategy, product, data or AI, somewhere the answer has to be checked before it ships.",
    "Also, if you have read this far down an about page, you either have far too much time on your hands or an opening on your team. I cannot help with the first. Please let me help with the second.",
  ],
};

export const graduation = {
  src: "/graduation.jpg",
  alt: "Yash Nirwan in an NYU violet gown and mortarboard at the Class of 2026 commencement in Yankee Stadium, the field and a stage tent behind him",
  w: 1120,
  h: 1500,
  caption: "Yankee Stadium, Class of 2026.",
};

export const portrait = {
  src: "/portrait-illustrated.jpg",
  alt: "Illustrated portrait of Yash Nirwan on Calton Hill in Edinburgh at sunset, in a sherpa jacket and beanie, with the National Monument behind him",
  w: 1064,
  h: 1914,
  caption: "Edinburgh, on the hill with the unfinished Parthenon on it.",
};

/* --- Stats ----------------------------------------------------------------
   The reference runs awards here. These are measurements instead.

   The comment that used to sit here claimed every one of them was checkable
   and then listed four sources — an eval, a commit count, a Lichess rating,
   an observation count — only one of which is a stat in this array. It was
   describing an earlier version of the list. Sources for what is actually
   here, so the next person does not inherit the same false reassurance:

     Clips 49   the labelled set, in the Foreman repo's evals/ — checkable
     Lines 14k  interface-cua, 14,373 lines per studies.ts — checkable, but
                the label says "in production" and that project has no
                public link and runs against a synthetic bank app
     Years 4    a judgement call, not a measurement; the two paid roles are
                ~20 months
     Countries 45  unsourced anywhere on the site, and the Raivana entry
                says "eight currencies" a screen away

   The last three are the owner's calls to confirm or cut, not mine. */

export const stats = [
  { label: "Building things that ship", unit: "Years", value: "4" },
  { label: "Live, taking real payments", unit: "Countries", value: "45" },
  { label: "Hand-labelled to test my own work", unit: "Clips", value: "49" },
  { label: "Written, reviewed, in production", unit: "Lines", value: "14k" },
];

/* --- The story ------------------------------------------------------------
   Not invented. This is the arc that is already in the material: a year of
   catching wrong numbers in insurance records, and then the same move
   pointed at models that are wrong in the same confident way. Every fact
   here appears elsewhere on the site with its source. */

export const story = {
  kicker: "The short version",
  headline: "It started with a spreadsheet that lied.",
  paragraphs: [
    "A $4 million building had been keyed into an insurance record as $40 million. It had been sitting there for a while. Nobody had noticed, because nobody reads a hundred thousand rows — they read the summary, and the summary was wrong in a way that looked completely normal.",
    "What fixed it was not attention. It was a set of cross-field checks that could say: this number disagrees with that number, go and look. I spent a year building those, and watching people trust the output more once they could see what it had caught.",
    "Models are wrong in exactly the same way. Confidently, plausibly, in the shape you were expecting. So I build the same thing for them — the eval, the second pass, the number you can go and check yourself. That is the whole job, and it is why every project here ships with what it cost as well as what it did.",
  ],
  signoff: "— Y.N., New York",
};

/* --- The classified -------------------------------------------------------
   A paper runs adverts. This one advertises the author. */

export const classified = [
  "Wanted: problems where the obvious answer is probably wrong",
  "Will trade one measurement for one coffee",
  "Available now",
  "Enquiries: yn2328@nyu.edu",
  "No agencies, no crypto, no dashboards nobody opens",
];

/* --- The identity plate ---------------------------------------------------
   The big landscape in the homepage identity section's right column, where
   the reference runs a large image above its display-caps description. Drawn
   in the same conceit as every plate — a field of like things, one ember
   exception — and the exception is a lone figure on the hill where the
   portrait beside it was taken. */
export const identityPlate = {
  src: "/art/calton-hill.jpg",
  alt: "Engraving of the unfinished National Monument on Calton Hill, Edinburgh, at night, with one small figure in ember standing on the hill below it",
  w: 1456,
  h: 816,
};
