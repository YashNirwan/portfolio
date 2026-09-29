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
  headline: "I build the part that decides whether to believe the answer.",
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
    image: {
      src: "/foreman.jpg",
      alt: "The Foreman review console, showing verified safety alerts beside the video evidence for each one",
      w: 1500,
      h: 1000,
    },
    hasStudy: true,
    isNew: true,
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
    image: {
      src: "/meridian.png",
      alt: "Meridian Core, the deliberately broken bank system built to test against, showing a member search that returned nothing",
      w: 3840,
      h: 660,
      position: "left top",
    },
    hasStudy: true,
    isNew: true,
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
    image: {
      src: "/raivana.jpg",
      alt: "The Raivana storefront, showing handcrafted Rajasthani homeware",
      w: 1500,
      h: 754,
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
    image: {
      src: "/firesight.jpg",
      alt: "The FireSight inspection view, showing Bronx buildings ranked by fire risk on a map",
      w: 1600,
      h: 821,
    },
    hasStudy: true,
  },
];

/* --- The back page --------------------------------------------------------
   Newspapers keep the lighter material on the back page, and that is the
   organising idea rather than a list of hobbies with no reason to be there.
   Each entry is something I actually do, not a trait I am claiming. */

export const backPage = {
  standfirst:
    "Every paper keeps a back page. Here is mine — including one thing that started as a joke and has not stopped running.",
  items: [
    {
      term: "213,965",
      unit: "flight prices",
      line: "I have checked six routes out of New York every few minutes since July. I have booked two of them. I look at the graph most mornings, which I am aware is not normal.",
      hot: true,
    },
    {
      term: "1709",
      unit: "rapid, on Lichess",
      href: "https://lichess.org/@/YashNirwan",
      line: "I never learned any theory. I have played the same opening 2,669 times and worked the rest out as it happened, which will presumably stop working at some point.",
      hot: true,
    },
    {
      term: "Hong Kong",
      unit: "cinema, 1990s",
      line: "Stephen Chow, the action films, Wong Kar-wai. It is most of what I watch. King of Comedy was hard enough to find that I ended up on YouTube with subtitles from somewhere else entirely.",
    },
    {
      term: "Stay",
      unit: "2005",
      line: "Better than its reviews suggested, which is roughly why I do not keep a Letterboxd. I would rather come to a film cold than through someone else's score.",
    },
  ],
};
