// The signature of the site: one operator, five lenses.
// Selecting a lens reframes the hero headline, the proof points, the radar
// chart, and the accent color — and filters the work below. The first entry is
// the resting/default ("generalist") view.

export type LensId = "all" | "consultant" | "pm" | "pmm" | "analyst" | "engineer";

// The five radar axes, in clockwise order from the top.
export const radarAxes = ["Strategy", "Product", "Marketing", "Data", "Build"] as const;

export type Lens = {
  id: LensId;
  /** Short chip label in the switcher. */
  label: string;
  /** Role title shown when this lens is active. */
  role: string;
  /** Accent color for this lens. */
  accent: string;
  /** The morphing hero headline. Keep the cadence consistent across lenses. */
  headline: string;
  /** One-line framing under the headline. */
  blurb: string;
  /** Three proof points, framed for this audience. */
  proof: { value: string; label: string }[];
  /** Radar values for [Strategy, Product, Marketing, Data, Build], 0–1. */
  radar: [number, number, number, number, number];
  /** Which radar axis (index) this lens spikes; null for the generalist view. */
  axis: number | null;
};

export const lenses: Lens[] = [
  {
    id: "all",
    label: "Generalist",
    role: "Strategy · Product · Data · AI",
    accent: "#3b9eff",
    headline: "I turn ambiguity into shipped outcomes.",
    blurb:
      "One operator across strategy, product, data, and code. Pick the lens you're hiring for — the story reframes.",
    proof: [
      { value: "40→95%", label: "AI adoption I drove in 8 weeks" },
      { value: "5", label: "disciplines, one through-line" },
      { value: "45+", label: "countries served by what I built" },
    ],
    radar: [0.86, 0.84, 0.8, 0.86, 0.82],
    axis: null,
  },
  {
    id: "consultant",
    label: "Consultant",
    role: "Management Consultant",
    accent: "#f0a830",
    headline: "I turn ambiguous client problems into decisions executives act on.",
    blurb:
      "Financial-services consulting at Accenture: discovery through steady state, framed for the people who sign off.",
    proof: [
      { value: "1,000+", label: "property records owned end-to-end" },
      { value: "40→95%", label: "AI-assisted validation adoption driven" },
      { value: "20pts", label: "fewer correction cycles" },
    ],
    radar: [1.0, 0.7, 0.62, 0.78, 0.46],
    axis: 0,
  },
  {
    id: "pm",
    label: "Product",
    role: "Product Manager",
    accent: "#5b9dff",
    headline: "I own products end-to-end, from user research to shipped workflow.",
    blurb:
      "B2B SaaS PM at Amoga: research, user stories, backlog, sprint ceremonies — and the releases that follow.",
    proof: [
      { value: "E2E", label: "CRM product ownership" },
      { value: "40→95%", label: "AI-assisted workflow adoption driven" },
      { value: "20k", label: "user reviews mined for the roadmap" },
    ],
    radar: [0.8, 1.0, 0.72, 0.72, 0.62],
    axis: 1,
  },
  {
    id: "pmm",
    label: "Marketing",
    role: "Product Marketer",
    accent: "#ff6aa0",
    headline: "I translate product capability into buyer-facing narrative that converts.",
    blurb:
      "GTM at Amoga: positioning, one-pagers, sales kits, and the competitive intel that shapes the roadmap.",
    proof: [
      { value: "+10%", label: "lead conversion improvement" },
      { value: "+7%", label: "web traffic growth" },
      { value: "2", label: "channels launched (Mailchimp + HubSpot)" },
    ],
    radar: [0.72, 0.76, 1.0, 0.66, 0.48],
    axis: 2,
  },
  {
    id: "analyst",
    label: "Analyst",
    role: "Data & Business Analyst",
    accent: "#2fd4ad",
    headline: "I turn messy data into models and recommendations leaders can use.",
    blurb:
      "Python, SQL, and the modeling stack — pointed at decisions, not just dashboards.",
    proof: [
      { value: "76.6%", label: "recall on stockout prediction model" },
      { value: "$32.8k", label: "restock budget optimized via Gurobi LP" },
      { value: "0.84", label: "AUC on coupon-acceptance pipeline" },
    ],
    radar: [0.7, 0.66, 0.56, 1.0, 0.62],
    axis: 3,
  },
  {
    id: "engineer",
    label: "Solutions Eng",
    role: "Builder / Solutions Engineer",
    accent: "#a87bff",
    headline: "I build working systems and explain them to anyone in the room.",
    blurb:
      "Agentic AI apps and serverless commerce — shipped, in production, and demoable on demand.",
    proof: [
      { value: "45+", label: "countries on live serverless commerce" },
      { value: "8", label: "currencies, exactly-once payments" },
      { value: "40+", label: "async calls in an agentic validation layer" },
    ],
    radar: [0.56, 0.72, 0.5, 0.72, 1.0],
    axis: 4,
  },
];

export const lensById = (id: LensId): Lens =>
  lenses.find((l) => l.id === id) ?? lenses[0];
