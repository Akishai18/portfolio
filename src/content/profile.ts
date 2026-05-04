/**
 * Single source of truth for personal info shown across the site.
 * Update here, propagates everywhere.
 */

export const profile = {
  name: "Akishai",
  fullName: "Akishai Suthakaran",
  role: "Software Engineer",
  school: "University of Waterloo",
  program: "B.Eng. Software Engineering",
  tagline:
    "Engineer and builder on a mission to push the boundaries of what's possible through technology",
  shortBio:
    "I'm a Software Engineering student at the University of Waterloo with a passion for programming, engineering, and finance. I build things at the intersection of machine learning, full-stack systems, and quantitative finance.",
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
      body: "SWE intern @ {{Nvestiv}}, {{North P&D}} · research @ U of T Shoichet Lab",
    },
    {
      label: "currently",
      body: "SWE intern @ {{Quantified Health}} building telemedicine platforms and tooling",
    },
    {
      label: "building",
      body: "SignalM, a market regime forecasting platform using PCA, HMM, and ML models",
    },
    {
      label: "interested in",
      body: "Quantitative finance, algorithmics trading, and risk modeling",
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
