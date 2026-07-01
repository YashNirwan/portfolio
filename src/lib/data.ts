import type { LensId } from "./lenses";

export const profile = {
  name: "Yash Nirwan",
  location: "New York, NY",
  tagline: "Strategy · Product · Data · AI",
  education: "MS, Management of Technology — NYU (May 2026)",
  priorDegree: "BE, Computer Science — Ramaiah Institute of Technology",
};

export const links = {
  email: "yn2328@nyu.edu",
  linkedin: "https://www.linkedin.com/in/yash-nirwan-6942b2194",
  github: "https://github.com/yashnirwan",
  resume: "/Yash_Nirwan.pdf",
};

export type WorkItem = {
  id: string;
  kind: "experience" | "project";
  title: string;
  subtitle: string; // role or stack
  meta: string; // period or context
  blurb: string;
  highlights: string[];
  tags: LensId[]; // which lenses this surfaces under
  stack?: string[];
  links?: { label: string; href: string }[];
  featured?: boolean;
  image?: string; // optional screenshot/mockup in /public
  imageAlt?: string;
  imagePosition?: "top" | "center"; // which part of the screenshot to show
  imageDomain?: string; // faux URL shown in the browser frame
  external?: string; // if set, the card links straight here (live app/site)
  caseStudy?: {
    context: string;
    whatIDid: string[];
    outcome: string[];
    closing?: string;
    charts?: { src: string; caption: string }[];
  };
};

export const work: WorkItem[] = [
  {
    id: "accenture",
    kind: "experience",
    title: "Accenture",
    subtitle: "Product & Strategy Associate — Consulting, Financial Services",
    meta: "Jul 2023 – Jul 2024",
    blurb:
      "Owned delivery of a commercial-insurance data platform spanning 1,000+ property records, turning ambiguous client requirements into product features, success metrics, and roadmaps.",
    highlights: [
      "Engineered a cross-field validation framework that flagged a critical data anomaly, packaged into a decision-ready executive brief that drove client remediation.",
      "Drove AI-assisted validation adoption from 40% to 95% in eight weeks via a catch-log system and field-feedback iteration.",
      "Reduced correction cycles by 20 percentage points working across compliance, actuarial, and data-engineering teams on Jira-tracked sprints.",
    ],
    tags: ["consultant", "pm", "analyst"],
    stack: ["Product strategy", "Jira", "Executive comms", "Validation"],
    featured: true,
  },
  {
    id: "amoga",
    kind: "experience",
    title: "Amoga",
    subtitle: "Product Manager — B2B SaaS",
    meta: "Dec 2022 – Jun 2023",
    blurb:
      "Owned a CRM product end-to-end at a B2B SaaS startup: user research, stories and acceptance criteria, backlog, sprint ceremonies, and the GTM motion around it.",
    highlights: [
      "Shipped workflow improvements that cut admin overhead across the sales org.",
      "Drove +7% web traffic and +10% lead conversion via outbound campaigns (Mailchimp, HubSpot) and Superset / GA funnel dashboards.",
      "Built buyer-facing copy, one-pagers, and sales kits; synthesized competitive intel into briefs that shaped roadmap prioritization.",
    ],
    tags: ["pm", "pmm", "analyst"],
    stack: ["Product Management", "HubSpot", "Apache Superset", "GTM"],
    featured: true,
  },
  {
    id: "vibecheck",
    kind: "project",
    title: "VibeCheck",
    subtitle: "Agentic AI App",
    meta: "2025 – Present",
    blurb:
      "An agentic app built end-to-end with Claude Code — and a real production debugging story behind it.",
    highlights: [
      "Diagnosed an LLM hallucination failure mode and shipped a YouTube Music API validation layer running 40+ async parallel calls — cut error rate to near zero.",
      "Integrated MCP tool calls, JSON-enforced structured outputs, and session-state memory for multi-turn agentic workflows.",
    ],
    tags: ["engineer", "pm", "analyst"],
    stack: ["Python", "Llama 3.3", "Groq API", "Streamlit", "MCP"],
    image: "/vibecheck.jpg",
    imageAlt: "VibeCheck app — AI-curated, API-validated soundtracks",
    imagePosition: "top",
    imageDomain: "newvibecheck.streamlit.app",
    external: "https://newvibecheck.streamlit.app",
    links: [
      { label: "Live demo", href: "https://newvibecheck.streamlit.app" },
      { label: "GitHub", href: "https://github.com/yashnirwan/VibeCheck" },
    ],
    featured: true,
  },
  {
    id: "raivana",
    kind: "project",
    title: "Raivana",
    subtitle: "Founder — Full-Stack E-Commerce",
    meta: "2024 – Present",
    blurb:
      "A live e-commerce platform for authentic Rajasthani handicraft — serverless, multi-currency, and processing real transactions.",
    highlights: [
      "Architected a serverless backend with an HMAC-verified webhook handler and idempotency key store (30-day TTL) guaranteeing exactly-once payments.",
      "Built geolocation-based currency routing serving 45+ countries, 8 currencies, and 156 products.",
    ],
    tags: ["engineer", "pmm"],
    stack: ["Node.js", "Netlify Functions", "Stripe", "Vanilla JS"],
    image: "/raivana.jpg",
    imageAlt: "Raivana storefront — handcrafted Rajasthani homeware",
    imagePosition: "center",
    imageDomain: "raivana.in",
    external: "https://raivana.in/",
    links: [{ label: "GitHub", href: "https://github.com/yashnirwan/Raivana" }],
    featured: true,
  },
  {
    id: "firesight",
    kind: "project",
    title: "FireSight NYC",
    subtitle: "AI inspection prioritization · Palantir Foundry",
    meta: "Civic · Data",
    blurb:
      "Consolidates four siloed NYC building-safety databases into one ranked queue for fire-risk inspections — built in the shadow of the 2022 Twin Parks fire that killed 17.",
    highlights: [
      "Transparent 0–100 risk score weighting self-closing-door violations, complaint history, and building age across 89,496 Bronx parcels.",
      "On pre-fire data only, the model ranked Twin Parks #1,003 of 89,496 parcels (top 1.1%) — signal the city's siloed systems missed.",
      "Three-view operator workflow with AI-generated dispatch rationales and one-click inspection dispatch.",
    ],
    tags: ["analyst", "consultant", "engineer"],
    stack: ["Python", "Palantir Foundry", "AIP Logic", "NYC Open Data"],
    image: "/firesight.jpg",
    imageAlt: "FireSight NYC — Bronx fire-risk inspection command center in Palantir Foundry",
    imageDomain: "firesight · foundry workshop",
    links: [{ label: "GitHub", href: "https://github.com/yashnirwan/firesight-nyc" }],
    featured: true,
    caseStudy: {
      context:
        "In 2022, a fire at the Twin Parks apartments in the Bronx killed 17 people. The doors that should have self-closed had been cited as violations years earlier — but those signals lived in separate city databases that never talked to each other. FireSight asks a blunt question: if the data already existed, could the right building have been inspected first?",
      whatIDid: [
        "Joined four siloed NYC Open Data sources (via the Socrata API) into a single ontology in Palantir Foundry.",
        "Built a transparent 0–100 risk score weighting self-closing-door violations, complaint history, and building age — every input visible and defensible, not a black box.",
        "Designed a three-view operator workflow in Foundry Workshop — an inspection command map, a building detail view, and a historical case study — with AI-generated rationales and one-click dispatch (Python pipeline; AIP Logic for the reasoning layer).",
      ],
      outcome: [
        "Using only data available before the fire, the model ranked Twin Parks #1,003 of 89,496 Bronx parcels — the top 1.1%.",
        "A ranked, explainable inspection queue that turns scattered violations into a defensible order of action.",
      ],
      closing:
        "A study in turning ambiguous, siloed public data into a decision a human can act on — and defend.",
    },
  },
  {
    id: "spotify-nlp",
    kind: "project",
    title: "Spotify Product Analytics",
    subtitle: "NLP for roadmap prioritization",
    meta: "Data · Product",
    blurb:
      "Mined 20,000 real user reviews to prioritize the product roadmap and reduce churn — a PM question answered with data.",
    highlights: [
      "Sentiment and theme extraction with NLTK + VADER over 20k reviews.",
      "Translated findings into roadmap priorities and churn-reduction levers.",
    ],
    tags: ["pm", "analyst", "pmm"],
    stack: ["Python", "NLTK", "VADER", "Pandas"],
    links: [
      { label: "GitHub", href: "https://github.com/yashnirwan/Spotify-Product-Analytics-NLP" },
    ],
    caseStudy: {
      context:
        "Product teams drown in reviews but starve for priorities. I treated the Spotify app's review corpus as a roadmap input: what are users actually asking for, and what's quietly driving them to churn?",
      whatIDid: [
        "Mined 20,000 real user reviews with an NLP pipeline (NLTK + VADER) to score sentiment and surface recurring themes.",
        "Clustered complaints and requests into themes, then mapped each to a potential roadmap bet and churn-risk signal.",
      ],
      outcome: [
        "A prioritized, evidence-backed view of what to build next and where churn risk concentrates.",
        "The kind of synthesis a PM can take straight into a planning meeting — opinion backed by 20k data points.",
      ],
      closing: "Data answering a product question, not just a dashboard.",
    },
  },
  {
    id: "walmart",
    kind: "project",
    title: "Retail Stockout Prediction",
    subtitle: "Stockout risk + inventory optimization",
    meta: "Data · Team of 4",
    blurb:
      "A 51.86% stockout rate, predicted before it happens — then a budget-bounded restocking plan. I led the EDA and visualization that set the strategy.",
    highlights: [
      "Led EDA across 5 stores × 8 products — surfaced rainy/cloudy & Saturday peaks and a 'buffer illusion' that broke simple threshold rules.",
      "Team's tuned XGBoost hit 0.77 AUC / 76.6% recall; a Gurobi LP allocated 1,685 units across 11 stores within a $32,836 budget.",
    ],
    tags: ["analyst", "consultant"],
    stack: ["Python", "XGBoost", "Gurobi"],
    links: [
      { label: "GitHub", href: "https://github.com/yashnirwan/walmart-stockout-prediction" },
    ],
    caseStudy: {
      context:
        "Over half of the transactions in the dataset — 51.86% — ended in a stockout, proving existing replenishment logic couldn't anticipate demand spikes or supply delays. The goal: predict high-risk store-product combinations before they stock out, then allocate a fixed restocking budget against them. A 4-person team project; I was the EDA & Visualization Lead.",
      whatIDid: [
        "Led the exploratory analysis across 5 stores × 8 products, surfacing the risk patterns that shaped the model — including the counterintuitive ones.",
        "Found that rainy (54.0%) and cloudy (53.2%) days drive more stockouts than sunny ones (49.1%) as customers move indoors, that Saturday peaks at 54.2% (mid-week replenishment misses weekend traffic), and a 'buffer illusion' — stockout vs non-stockout transactions had nearly identical inventory buffers (151 vs 155), proving simple threshold rules fail.",
        "Built the visualizations and insight summaries that justified tree-based modeling over linear baselines and a reconstructed, operationally-meaningful target.",
      ],
      outcome: [
        "The team's tuned XGBoost hit 0.77 AUC and 76.6% recall — recall-prioritized, because missing a real stockout costs more than an early reorder.",
        "A Gurobi optimizer allocated 1,685 restocking units across 11 priority stores within a $32,836 budget, turning risk scores into a concrete reorder plan.",
        "Final recommendation: a Score-Monday → Optimize-Tuesday → Order-Wednesday workflow that converts reactive restocking into predictive inventory management.",
      ],
      closing: "EDA that didn't just describe the data — it set the strategy.",
      charts: [
        {
          src: "/chart-walmart-eda.jpg",
          caption:
            "Stockout rate by store and product — New York (55.4%) and tablets (54.4%) carry the most risk; Dallas and laptops the least.",
        },
        {
          src: "/chart-walmart-context.jpg",
          caption:
            "Contextual drivers — rainy (54%) and cloudy (53%) days drive more stockouts than sunny ones (49%) as customers move indoors.",
        },
        {
          src: "/chart-walmart-features.jpg",
          caption:
            "The team's XGBoost feature importance — actual demand dominates, then the demand-vs-reorder gap and supplier lead time.",
        },
      ],
    },
  },
  {
    id: "coupon",
    kind: "project",
    title: "Coupon Acceptance Prediction",
    subtitle: "Coupon acceptance → highway amenity strategy",
    meta: "Data · Strategy",
    blurb:
      "An NYU analytics project reframed as a planning brief: model which drivers accept coupons, then tell highway planners which amenities to actually build.",
    highlights: [
      "Engineered a 57-feature pipeline; tuned Gradient Boosting won at 76.65% accuracy, 80.07% F1, 0.84 AUC.",
      "Turned the model's top predictors into a 'priority amenity' strategy for interstate planners.",
    ],
    tags: ["analyst", "consultant", "pmm"],
    stack: ["Python", "Gradient Boosting", "GridSearchCV"],
    links: [
      { label: "GitHub", href: "https://github.com/yashnirwan/coupon-acceptance-prediction" },
    ],
    caseStudy: {
      context:
        "An NYU analytics project (IE-GY 9113) reframed as a real planning brief: an analytics team advising the amenity design of an interstate highway. By modeling which drivers accept promotional coupons — and why — we could tell planners which amenities to actually build. Stakeholders: the highway design team, amenity vendors, and interstate planners. I was the Data Architect & Analyst.",
      whatIDid: [
        "Owned the data pipeline: handled 10,505 missing cells (the 'car' column was 99% empty and dropped), then engineered 57 features — ordinal encoding for age/income/education, one-hot for nominal fields like destination, weather, and occupation.",
        "Engineered an `expiration_hours` feature that became a top predictor, and ran EDA showing the real drivers were visit frequency, income, and social context — not physical factors like weather or distance.",
        "Benchmarked four model families with 5-fold CV, tuned the winners (Random Forest, Gradient Boosting) via randomized search, and scored the 2,684-record holdout.",
      ],
      outcome: [
        "Gradient Boosting won: 76.65% accuracy, 80.07% F1, 0.84 ROC-AUC (0.78 precision / 0.82 recall on acceptance).",
        "Top predictors — coffee-house frequency, income, age — drove a 'priority amenity' strategy: coffee houses and quick-service/carry-out as anchors, affordable youth-oriented brands, and 1-day coupon windows over high-pressure 2-hour ones.",
        "Scored 2,684 new drivers (58% predicted likely acceptors), turning the model into an interstate design recommendation.",
      ],
      closing: "A model that didn't stop at accuracy — it told planners what to build.",
      charts: [
        {
          src: "/chart-coupon-eda.jpg",
          caption:
            "Coupon acceptance by amenity type — carry-out (74.8%) and sub-$20 restaurants (71.1%) far outperform bars (39.9%).",
        },
        {
          src: "/chart-coupon-features.jpg",
          caption:
            "Top-20 feature importance (tuned Gradient Boosting) — coffee-house frequency, income, and age lead the predictors.",
        },
      ],
    },
  },
  {
    id: "rfm-dbt",
    kind: "project",
    title: "RFM Analysis & dbt Analytics",
    subtitle: "Warehouse-native analytics",
    meta: "Data",
    blurb:
      "Customer segmentation and a modern analytics-engineering stack: RFM in SQL + Tableau, and dbt models on Snowflake.",
    highlights: [
      "RFM segmentation on car-sales data in SQL, visualized in Tableau.",
      "dbt Core project on Snowflake with staging + mart models (Jaffle Shop).",
    ],
    tags: ["analyst"],
    stack: ["SQL", "dbt", "Snowflake", "Tableau"],
    links: [
      { label: "RFM", href: "https://github.com/yashnirwan/RFM-Analysis" },
      { label: "dbt", href: "https://github.com/yashnirwan/dbt-analytics" },
    ],
    caseStudy: {
      context:
        "Two sides of analytics engineering: segmenting customers so someone can act, and building the warehouse models that make analysis repeatable instead of one-off.",
      whatIDid: [
        "Ran an RFM (recency, frequency, monetary) segmentation on car-sales data in SQL and visualized the segments in Tableau.",
        "Built a dbt Core project on Snowflake with staging and mart models (the Jaffle Shop reference), structured for clean, testable transformations.",
      ],
      outcome: [
        "Actionable customer segments leadership can target directly.",
        "A warehouse-native modeling setup that scales past a single analysis.",
      ],
      closing: "From ad-hoc query to maintainable analytics.",
    },
  },
];

export const skillGroups = [
  {
    title: "Product & Strategy",
    items: [
      "Product Management",
      "Roadmapping",
      "User Stories",
      "Backlog & Sprints",
      "Competitive Analysis",
      "Go-to-Market",
      "Stakeholder Comms",
    ],
  },
  {
    title: "Analytics & Data",
    items: [
      "Python",
      "SQL",
      "XGBoost",
      "Apache Superset",
      "Google Analytics",
      "VADER / NLTK",
      "Funnel Analysis",
      "KPI Reporting",
    ],
  },
  {
    title: "AI & Technical",
    items: [
      "LLM Integration",
      "Agentic Workflows",
      "MCP Tool Use",
      "Structured Outputs",
      "Node.js",
      "REST APIs",
      "Webhooks (HMAC)",
      "Claude Code",
    ],
  },
  {
    title: "Tools",
    items: ["Jira", "HubSpot", "Salesforce", "Mailchimp", "Git", "Streamlit", "Excel", "PowerPoint"],
  },
];

export const about = {
  lead: "I'm a generalist by design, not by accident.",
  paragraphs: [
    "I started in computer science, spent a year in financial-services consulting at Accenture owning a $450M+ data platform, and a stint before that as a product manager at a B2B SaaS startup. Now I'm finishing an MS in Management of Technology at NYU.",
    "The through-line: I take something ambiguous — a vague client ask, a messy dataset, a half-formed product idea — and turn it into something shipped that people can act on. Sometimes that's a strategy deck, sometimes a churn model, sometimes a payments system in production.",
    "I learn fastest by building, which is why most of my projects are live, not slideware. If you're hiring for a role that sits between the technical and the commercial, that's exactly the seam I work in.",
  ],
};
