/**
 * Portfolio content — pulled from the old site's constants.
 * Image paths point to the new public/img directories.
 */

/* --------------------------------------------------------------- */
/* Skills                                                            */
/* --------------------------------------------------------------- */

export type Skill = {
  name: string;
  icon: string;
  category: "languages" | "frameworks" | "tools";
  /** Per-icon size override. 1 = default for the category. Use e.g. 1.2 to
   *  bump a logo that reads small, or 0.85 to dial one back. */
  iconScale?: number;
};

export const skills: Skill[] = [
  // Languages
  { name: "Python", icon: "/img/tech/python.png", category: "languages" },
  { name: "TypeScript", icon: "/img/tech/Typescript.png", category: "languages" },
  { name: "JavaScript", icon: "/img/tech/javascript.png", category: "languages" },
  { name: "C / C++", icon: "/img/tech/C.png", category: "languages" },
  { name: "PHP", icon: "/img/tech/php.png", category: "languages" },
  { name: "Elixir", icon: "/img/tech/Elixir_programming_language_logo.svg-2.png", category: "languages" },

  // Frameworks (frontend + backend + ML libs)
  { name: "React", icon: "/img/tech/reactjs.png", category: "frameworks" },
  { name: "Next.js", icon: "/img/tech/nextjs.png", category: "frameworks" },
  { name: "Tailwind", icon: "/img/tech/tailwind.png", category: "frameworks" },
  { name: "Node.js", icon: "/img/tech/nodejs.png", category: "frameworks" },
  { name: "Flask", icon: "/img/tech/flask.png", category: "frameworks" },
  { name: "Laravel", icon: "/img/tech/Laravel.png", category: "frameworks" },
  { name: "Scikit-learn", icon: "/img/tech/sci-kit.png", category: "frameworks" },
  { name: "Pandas", icon: "/img/tech/pandas.png", category: "frameworks" },
  { name: "NumPy", icon: "/img/tech/numpy-image.svg", category: "frameworks" },

  // Infrastructure & Tools (DB, version control, hardware, ops)
  { name: "PostgreSQL", icon: "/img/tech/postgres.png", category: "tools" },
  { name: "MySQL", icon: "/img/tech/mysql.png", category: "tools" },
  { name: "GraphQL", icon: "/img/tech/graphql.svg.png", category: "tools" },
  { name: "Supabase", icon: "/img/tech/supabase.png", category: "tools", iconScale: 1.4 },
  { name: "Docker", icon: "/img/tech/docker.png", category: "tools" },
  { name: "Git", icon: "/img/tech/git.png", category: "tools" },
  { name: "Arduino", icon: "/img/tech/arduino.png", category: "tools" },
  { name: "Google Cybersecurity Cert.", icon: "/img/tech/google.png", category: "tools" },
];

export const skillCategoryLabels: Record<Skill["category"], string> = {
  languages: "Languages",
  frameworks: "Frameworks",
  tools: "Infrastructure & Tools",
};

/* --------------------------------------------------------------- */
/* Experience — work + leadership                                    */
/* --------------------------------------------------------------- */

export type Role = {
  title: string;
  org: string;
  date: string;
  icon: string;
  iconBg?: string;
  /** Override the default icon scale (1.18 fills + crops). Use <1 to inset
   *  the logo with visible iconBg around it. */
  iconScale?: number;
  bullets: string[];
};

export const workExperience: Role[] = [
  {
    title: "Software Engineering Intern",
    org: "Quantified Health",
    date: "Incoming · Summer 2026",
    icon: "/img/company/reimagine_health_canada_logo.jpeg",
    iconBg: "#4f46e5",
    bullets: [
      "Building scalable backend systems (Next.js, GraphQL, TypeScript) and DevOps infrastructure within a monorepo to power AI-driven telemedicine platforms serving 600+ patients monthly across Canadian healthcare.",
    ],
  },
  {
    title: "Software Engineering Intern",
    org: "North P&D",
    date: "Jun 2025 – Aug 2025",
    icon: "/img/company/northpnd.png",
    iconBg: "white",
    iconScale: 0.78,
    bullets: [
      "Developed and optimized 15+ client features including a scalable marketplace platform and RESTful API integrations using PHP, Vue.js, Laravel, and MySQL — increasing site performance metrics by 30%.",
      "Built database-driven functionality supporting real-time updates for multiple clients, improving data retrieval efficiency by 20% and ensuring scalable performance under high traffic.",
      "Identified and resolved 40+ critical bugs across frontend and backend systems, decreasing customer-reported issues by 25%.",
    ],
  },
  {
    title: "Software Engineering Intern",
    org: "Nvestiv",
    date: "Mar 2025 – Aug 2025",
    icon: "/img/company/Nvestiv.png",
    iconBg: "white",
    bullets: [
      "Built a full-stack investment platform with interactive search & filtering and real-time portfolio analytics; cut end-to-end request time 40% by batching API calls and eliminating redundant fetches in a Next.js frontend.",
      "Built an investor vector database in Weaviate with a CLI for semantic search across 20,000+ profiles, improving target accuracy by 30%.",
      "Refined AI-driven investment agents in Elixir, boosting performance 25% by streamlining data processing logic and integrating real-time financial APIs.",
    ],
  },
  {
    title: "Research Assistant",
    org: "University of Toronto — Shoichet Lab",
    date: "Feb 2024 – Mar 2024",
    icon: "/img/company/Uoft.png",
    iconBg: "white",
    iconScale: 0.78,
    bullets: [
      "Conducted research in tissue engineering and drug delivery, contributing to non-invasive systems for targeted therapeutic transport in complex tissue environments.",
      "Engineered and optimized 20+ hydrogel formulations, improving drug-loading efficiency 20% through controlled release studies and high-purity peptide synthesis.",
      "Applied statistical analysis and built ML models in Python with >85% accuracy to identify material properties, predict drug behaviour, and drive data-driven research insights.",
    ],
  },
];

export const leadership: Role[] = [
  {
    title: "Project Lead",
    org: "UW Blueprint",
    date: "Jan 2026 – Present",
    icon: "/img/company/bp-logo.svg",
    iconBg: "#2d7bdf",
    bullets: [
      "Leading a team of 8 developers building a full-stack platform for the Oakville & Milton Humane Society — owning technical direction, sprint planning, and client communication end-to-end.",
      "Translating non-profit operational needs into product specs and architecture decisions, shipping software pro bono to amplify the impact of community organizations across the GTA.",
    ],
  },
  {
    title: "Founder",
    org: "Nodaro",
    date: "Sep 2025 – Present",
    icon: "/img/company/nodaro_logo.jpeg",
    iconBg: "#0a0a0a",
    iconScale: 1.4,
    bullets: [
      "Co-founded Nodaro to close the hardware gap left by the software-startup boom — building tools, resources, and events that help student makers turn ideas into shipped, real-world hardware.",
      "Currently building an AI-assisted prototype builder that accelerates hardware R&D — collapsing the loop from concept to working prototype so makers can iterate at software speeds.",
    ],
  },
  {
    title: "Board Member",
    org: "Career Chats",
    date: "Jul 2024 – Present",
    icon: "/img/company/CareerChats.png",
    iconBg: "white",
    bullets: [
      "Led international expansion to 300+ members across 20+ countries by launching school-wide chapters and leveraging expert interviews.",
      "Drove 70% growth in visibility by implementing strategic marketing solutions early on.",
      "Managed and mentored a team of executives, guiding chapter development and organizational reach.",
    ],
  },
  {
    title: "Head of Finance",
    org: "JAMHacks",
    date: "Aug 2024 – Aug 2025",
    icon: "/img/company/Jamhacks.png",
    iconBg: "white",
    bullets: [
      "Directed a team of 3 officers to raise $6,000+ in sponsorships and develop strong corporate partnerships.",
      "Designed an event budget that reduced unnecessary expenses by 20%, supported by detailed financial reports for full transparency.",
      "Conducted data-driven analysis to inform cost allocations and troubleshoot event planning challenges under tight deadlines.",
    ],
  },
  {
    title: "Director of Web Development",
    org: "Youth Surgeons Association",
    date: "Jul 2024 – Aug 2025",
    icon: "/img/company/YSA.png",
    iconBg: "#9ec0c2",
    bullets: [
      "Built and maintained user-friendly web pages with React, JavaScript, CSS, HTML, and Node — focused on engaging, responsive UX.",
      "Oversaw a team of junior developers with mentorship and guidance to enhance their skills and ensure effective execution.",
      "Implemented SEO best practices, driving a 50% increase in organic search traffic and 35% boost in viewership within 3 months.",
    ],
  },
  {
    title: "Chapter President",
    org: "DECA",
    date: "Jun 2024 – Jun 2025",
    icon: "/img/company/DECA.png",
    iconBg: "white",
    bullets: [
      "Directed 12 executives leading a delegation of 300+ students through competitions and conferences.",
      "Reached a record 99 provincial qualifications — the highest in chapter history — by collaborating with presidents worldwide on training strategies.",
      "Targeted marketing recruited 25% more members and heightened chapter visibility.",
    ],
  },
  {
    title: "Director of Finance",
    org: "FinTech Nexus",
    date: "Jun 2024 – Dec 2024",
    icon: "/img/company/FinTech.png",
    iconBg: "white",
    bullets: [
      "Led 4 associates to secure FinTech partnerships and funding for a company-backed case competition.",
      "Developed and executed financial strategies to secure sponsorships, manage budgets, and ensure sustainable funding.",
      "Organized educational events and workshops introducing students to FinTech, including quantitative finance.",
    ],
  },
  {
    title: "Director of Marketing",
    org: "Movement For Change Youth Council",
    date: "Aug 2024 – Jun 2025",
    icon: "/img/company/MCYC.png",
    iconBg: "white",
    bullets: [
      "Led marketing campaigns for the Ambassador Program, building strategic plans, content outlines, and performance reports.",
      "Increased media impressions 30%, reaching 3,595 impressions through targeted social, email, and integrated efforts.",
      "Established cross-organizational collaborations to expand event reach and community engagement.",
    ],
  },
  {
    title: "Founder · Tutor",
    org: "Tutorly",
    date: "Dec 2021 – Jun 2025",
    icon: "/img/company/Tutorly.png",
    iconBg: "white",
    bullets: [
      "Operated a tutoring business with personalized lesson plans averaging a 15–20% improvement in student academic performance.",
      "Grew client base 40% via targeted outreach and digital campaigns; managed scheduling, communication, and progress tracking.",
      "Delivered measurable improvement on assignments and tests through tailored study strategies and ongoing assessment.",
    ],
  },
  {
    title: "National Associate of Finance",
    org: "JEC Canada",
    date: "Aug 2024 – Aug 2025",
    icon: "/img/company/JEC.png",
    iconBg: "black",
    bullets: [
      "Identified potential sponsors and cultivated relationships, helping secure funding through effective outreach.",
      "Prepared and oversaw budgets, monitoring expenditures and resource allocation to maintain efficiency.",
      "Crafted and implemented financial strategies aligned with JEC Toronto's short- and long-term objectives.",
    ],
  },
  {
    title: "Project Management Team — Data Science Committee",
    org: "STEM Fellowship",
    date: "Feb 2024 – Aug 2025",
    icon: "/img/company/STEMF.png",
    iconBg: "white",
    bullets: [
      "Collaborated on the execution of data science challenges and hackathons including HSBDC and IUBDC.",
      "Managed and organized event logistics including press releases, social posts, workshops, and Q&A sessions.",
      "Engaged industry experts, government officials, and partner organizations to facilitate workshops and guest speakers.",
    ],
  },
];

/* --------------------------------------------------------------- */
/* Education                                                         */
/* --------------------------------------------------------------- */

export type Education = {
  school: string;
  degree: string;
  date: string;
  icon: string;
  iconBg?: string;
  iconScale?: number;
  bullets: string[];
};

export const educations: Education[] = [
  {
    school: "University of Waterloo",
    degree: "B.Eng. Software Engineering",
    date: "Sep 2025 – Apr 2030",
    icon: "/img/company/Waterloo.png",
    iconBg: "white",
    bullets: [
      "GPA: 4.0",
      "President's Scholarship of Distinction ($5,000), Software Engineering Scholarship ($4,000), and external scholarships totaling $15,000+",
      "Engineering Society Leadership Excellence Award ($1,000)",
      "Coursework: Calculus I/II, Linear Algebra, Software Engineering Principles, Programming Principles, Discrete Math, Digital / Linear Circuits, Data Abstraction",
    ],
  },
  {
    school: "Y Combinator Startup School",
    degree: "Technical Builder Cohort · San Francisco, CA",
    date: "Jul 2026",
    icon: "/img/company/Y_Combinator_logo.svg",
    bullets: [
      "Selected to a hyper-curated cohort of top technical builders (~2% acceptance rate) for YC's in-person Startup School program in San Francisco — small-group sessions with YC partners on ideation, MVP development, and early-stage validation.",
      "Built alongside founders backed by Y Combinator and engaged directly with the partners, mentors, and operators who have shipped some of the most impactful companies of the last two decades.",
    ],
  },
  {
    school: "Castlebrooke Secondary School",
    degree: "High School Diploma",
    date: "Sep 2021 – Jun 2025",
    icon: "/img/company/Castlebrooke.png",
    iconBg: "white",
    bullets: [
      "Honour Standing · Top Ontario Scholar · 99% average (4.0 GPA)",
      "President / Founder of Math Club · President of DECA · President of Computer Science Club",
      "Fundraising Director for STEM Club · Vice-President of Physics Club · Engineering Club · Robotics · Math Contests",
      "Honor Roll (Gr 9–12) · Schulich Leader Nominee",
      "Scholarship offers from various universities and institutions totaling $220,000+",
    ],
  },
  {
    school: "Quantum School For Young Students (QSYS)",
    degree: "Enrichment Program",
    date: "August 2024",
    icon: "/img/company/Waterloo.png",
    iconBg: "white",
    bullets: [
      "Selective enrichment program with expert lectures, group discussions, problem solving, mentoring, and networking with world-leading researchers in quantum information science.",
      "Collaborated with fellow students and leading researchers on cutting-edge quantum advancements.",
      "Engaged in problem-solving sessions applying theoretical concepts to real-world quantum problems.",
    ],
  },
];

/* --------------------------------------------------------------- */
/* Projects                                                          */
/* --------------------------------------------------------------- */

export type Project = {
  name: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  /** Featured projects show first / larger */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "SignalM",
    description:
      "Market regime detection and prediction platform using PCA, HMM, and ML to classify market conditions (Calm, Crisis, Elevated Stress, Transition) across major indices, with custom horizon forecasting and interactive visualizations.",
    tags: ["Hidden Markov Models", "PCA", "Machine Learning"],
    image: "/img/projects/SignalM.png",
    link: "https://www.signalm.ca",
    featured: true,
  },
  {
    name: "PosePerfect",
    description:
      "Real-time fitness coaching app using OpenCV pose estimation in the browser to track body landmarks and joint angles, then applying generative AI to turn pose data and screenshots into actionable form feedback.",
    tags: ["Computer Vision", "OpenCV", "Generative AI"],
    image: "/img/projects/Pose.png",
    link: "https://github.com/Akishai18",
  },
  {
    name: "Pineapple Pathways",
    description:
      "Flask + React + Cohere ReRank + OpenAI integration delivering scholarship matching, AI-powered essay feedback, tuition prediction, and admissions statistics through a unified, data-driven interface.",
    tags: ["React", "Python · Flask", "Cohere ReRank"],
    image: "/img/projects/Pineapple.png",
    link: "https://github.com/Akishai18/Pineapple-Pathways",
  },
  {
    name: "Home Price Predictor",
    description:
      "Random Forest model in Scikit-learn, Pandas, and NumPy forecasting GTA home prices, served via a Flask backend with a React frontend for interactive real estate insights.",
    tags: ["React", "Python · Flask", "Machine Learning"],
    image: "/img/projects/Home.png",
    link: "https://github.com/Akishai18/Home-Price-Prediction-App",
  },
  {
    name: "NutriScan",
    description:
      "Computer vision-powered food recognition app using OpenCV, Flask, vector databases, and RAG to deliver real-time nutritional insights with semantic search and a React/Tailwind frontend.",
    tags: ["RAG", "Vector DB", "Computer Vision"],
    image: "/img/projects/nutriscan.png",
    link: "https://github.com/Akishai18/NutriScan",
  },
  {
    name: "Career Bot",
    description:
      "AI-driven resume and cover-letter optimization, personalized interview prep, and tailored career guidance — built to help early-career professionals excel in their journey.",
    tags: ["Python", "OpenCV", "Gemini"],
    image: "/img/projects/Career.png",
    link: "https://github.com/Akishai18/Career-Bot",
  },
  {
    name: "Heart Disease Predictor",
    description:
      "Scikit-learn model predicting heart disease risk via data preprocessing, feature engineering, and tuning — delivering accurate, data-driven health insights.",
    tags: ["Python", "NumPy · Pandas", "Scikit-learn"],
    image: "/img/projects/Heart.png",
    link: "https://github.com/Akishai18/Heart-Disease-Prediction-Project",
  },
  {
    name: "Mind — Mental Health",
    description:
      "React-based mental health platform offering insights across topics, plus interactive resources to support well-being and education.",
    tags: ["React", "JavaScript", "HTML / CSS"],
    image: "/img/projects/Mind.png",
    link: "https://github.com/Akishai18/Mind---Mental-Health-Site",
  },
  {
    name: "Quiz — Rigour",
    description:
      "A dynamic quiz platform with challenging questions across diverse topics, designed to test knowledge and reward continued learning.",
    tags: ["JavaScript", "HTML", "CSS"],
    image: "/img/projects/Quiz.png",
    link: "https://github.com/Akishai18/Quiz-Rigour",
  },
  {
    name: "Tetris Reloaded",
    description:
      "A modern twist on the classic — fresh designs and new power-ups elevating a reimagined version of the retro game.",
    tags: ["JavaScript", "CSS", "HTML"],
    image: "/img/projects/Tetris.png",
    link: "https://github.com/Akishai18/Tetris-Reloaded",
  },
];

/* --------------------------------------------------------------- */
/* Awards & Recognition                                              */
/* --------------------------------------------------------------- */

export type Award = {
  name: string;
  org: string;
  year: string;
  category: "featured" | "provincial" | "other";
  /** Quantitative tag — placement, percentage, dollar amount, etc. */
  value?: string;
  /** Optional one-line context */
  note?: string;
};

export const awardCategoryLabels: Record<Award["category"], string> = {
  featured: "Top Honors",
  provincial: "Provincial",
  other: "Honors & Scholarships",
};

export const awards: Award[] = [
  // ── Top Honors ── International DECA + IMC + Research/Publications
  {
    name: "First Place International Champion · Financial Consulting",
    org: "DECA · ICDC",
    year: "2025",
    category: "featured",
    value: "1st · World",
    note: "Won 1st place against thousands of competitors from across the world by presenting a unique venture capital portfolio strategy with a forecasing tool to a student athelete",
  },
  {
    name: "Second Place International Champion · Financial Consulting",
    org: "DECA · ICDC",
    year: "2024",
    category: "featured",
    value: "2nd · World",
    note: "Won 2nd place against thousands of competitors from across the world by presenting a unique venture capital portfolio strategy with a forecasing tool to a student athelete",
  },
  {
    name: "Top 10 International Finalist · Financial Consulting",
    org: "DECA · ICDC",
    year: "2024 · 2025",
    category: "featured",
    value: "Top 10 · ×2",
  },
  {
    name: "IMC Prosperity Algorithmic Trading · Finalist",
    org: "IMC Trading",
    year: "2025",
    category: "featured",
    value: "Top 7% · 22K+",
    note: "Advanced to the finals of IMC's global algorithmic trading competition, placing in the top 7% of 22,000+ competitors worldwide.",
  },
  {
    name: "Published CS Paper on P vs NP",
    org: "The STEM Spectrum",
    year: "2024",
    category: "featured",
    value: "8% select · 15K reads",
    note: "Selected from a competitive submission pool; distributed to 15,000+ readers across the journal's audience.",
  },
  {
    name: "Published Mathematics Paper",
    org: "Oxford Math Essay Writing Contest",
    year: "2024",
    category: "featured",
    note: "Published a mathematics essay on the Continuem Hypothesis through the Oxford Essay competition.",
  },
  {
    name: "Quantum School For Young Students (QSYS)",
    org: "Institute for Quantum Computing · University of Waterloo",
    year: "2024",
    category: "featured",
    note: "Selective research program in quantum information science alongside leading IQC researchers.",
  },
  {
    name: "Schulich Leader Nominee",
    org: "Schulich Foundation",
    year: "2025",
    category: "featured",
    note: "Nominated for Canada's most prestigious undergraduate STEM scholarship.",
  },

  // ── Provincial ── DECA Ontario
  {
    name: "Provincial Champion · Financial Consulting",
    org: "DECA Ontario",
    year: "2024 · 2025",
    category: "provincial",
    value: "1st · Ontario · ×2",
    note: "Back-to-back provincial champion in financial consulting at DECA Ontario.",
  },
  {
    name: "Top 10 Provincial Finalist · Financial Consulting",
    org: "DECA Ontario",
    year: "2024 · 2025",
    category: "provincial",
    value: "Top 10 · ×2",
  },

  // ── Honors & Scholarships ── everything else
  {
    name: "Total Scholarship Offers",
    org: "Universities & institutions",
    year: "2025",
    category: "other",
    value: "$220,000+",
    note: "Across multiple admission and merit-based scholarship offers.",
  },
  {
    name: "Euclid Math Contest · School Champion",
    org: "CEMC · University of Waterloo",
    year: "2024",
    category: "other",
    value: "1st · School",
  },
  {
    name: "Engineering Society Leadership Excellence Award",
    org: "University of Waterloo",
    year: "2025",
    category: "other",
    value: "$1,000",
  },
  {
    name: "Top Ontario Scholar",
    org: "Ontario Ministry of Education",
    year: "2025",
    category: "other",
    value: "99% avg",
  },
  {
    name: "Karla Bailey Trustee Award",
    org: "Peel District School Board",
    year: "2025",
    category: "other",
    note: "Trustee award recognizing academic excellence and community contribution.",
  },
  {
    name: "Honour Standing · Honor Roll",
    org: "Castlebrooke Secondary School",
    year: "2021–2025",
    category: "other",
    note: "Top academic standing maintained Grades 9–12.",
  },
];
