/**
 * Single source of truth for personal info shown across the site.
 * Update here, propagates everywhere.
 */

export const profile = {
  name: "Akishai",
  fullName: "Akishai Sabaratnasarma",
  role: "Software Engineer",
  school: "University of Waterloo",
  program: "B.Eng. Software Engineering",
  tagline:
    "Engineer and builder on a mission to push the boundaries of what's possible through technology",
  shortBio:
    "I'm a Software Engineering student at the University of Waterloo with a passion for programming, engineering, and finance. I build things at the intersection of machine learning, full-stack systems, and quantitative finance.",
  /**
   * Two paragraphs shown in the home-page About section. Edit freely.
   */
  aboutParagraphs: [
    "I'm a Software Engineering student at the University of Waterloo, dedicated to pushing the boundaries of what's possible through technology. I'm drawn to the overlap between engineering and finance which has led me to build at the intersection of machine learning, full-stack systems, and quantitative trading — and I'm currently exploring LLM as an integration into quant finance.",
    "At my core, I'm a builder who loves to explore the world through tech and ship products that solve complex problems. Most recently I built SignalM a market regime detection and prediction platform using PCA, HMM, and ML models. In the future, I aspire to continuing to work at the intersection of trading and tech all the while disrupting the space by founding my own company ",
  ],
  /**
   * "Right now" panel shown next to the home-page contact form.
   * Edit these freely to keep the page feeling current.
   */
  now: [
    { label: "Location", value: "Toronto, ON" },
    { label: "Listening", value: "Daft Punk · Random Access Memories" },
    { label: "Watching", value: "Game of Thrones" },
    { label: "Building", value: "SignalM" },
    { label: "Exploring", value: "Where LLMs add edge in trading" },
  ],
  currentlyBuilding: [
    "A market-regime detection framework using unsupervised learning on volatility, correlation, and factor dynamics",
    "Nodaro — a student-led initiative providing mentorship and opportunities in hardware technology",
    "Research on ML for quantitative finance: algorithmic trading, risk modeling, predictive market analytics",
  ],
  /**
   * Hero jot-notes. Wrap any term in {{double curlies}} to render it as a gold pill.
   */
  quickFacts: [
    {
      label: "previously",
      body: "SWE intern @ {{Quantified Health}} building telemedicine platforms and tooling",
    },
    {
      label: "currently",
      body: "Prev SWE @ {{North P&D}}, {{Nvestiv}} and Research @ {{U of T Shoichet Lab}}",
    },
    {
      label: "building",
      body: "Building {{SignalM}}, a market regime forecasting platform using PCA, HMM, and ML models",
    },
    {
      label: "interested in",
      body: "Researching LLM applications in quantitative finance, algorithmic trading, and risk modeling",
    },
  ],
  email: "akishais18@gmail.com",
  links: {
    github: "https://github.com/Akishai18",
    linkedin: "https://www.linkedin.com/in/akishai",
    twitter: "https://x.com/Akishai_S",
    instagram: "https://www.instagram.com/akishai_18/",
    resume: "https://drive.google.com/file/d/1SkLsjJyz75VDf6Gdsh36H25bgn9dUPlB/view?usp=sharing",
    email: "mailto:akishais18@gmail.com",
  },
  photo: "/img/me.jpg",
} as const;

export type Profile = typeof profile;
