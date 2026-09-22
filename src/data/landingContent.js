export const PIPELINE_STAGES = [
  "Uploading Resume",
  "Extracting Document",
  "Structuring Candidate Profile",
  "Understanding Job Requirements",
  "Normalizing Skills",
  "Collecting Evidence",
  "Enriching Public Profiles",
  "Matching Requirements",
  "Evaluating Evidence",
  "Calculating Scores",
  "Generating Report"
];

export const SAMPLE_REPORT = {
  candidateName: "Subrato Kundu",
  candidateRole: "Full Stack Developer",
  candidateEmail: "subrato@example.com",
  github: "github.com/subrato-kundu",
  overallScore: 75,
  verdictLabel: "STRONG MATCH",
  evidenceCoverage: 75,
  scores: {
    jobMatch: 70,
    evidenceStrength: 64,
    resumeQuality: 67,
    atsCompatibility: 70
  },
  recruiterVerdict:
    "The candidate demonstrates a moderate alignment with the role, scoring 70% on job match and an overall evaluation of 75%. However, the evidence supporting claimed skills is relatively weak, with an evidence strength score of only 64%. To be competitive, the candidate should strengthen their resume with quantifiable achievements and specific examples that directly relate to the position's requirements.",
  candidateSummary:
    "Full Stack Developer specializing in Spring Boot, Next.js, PostgreSQL, and AI-powered application development. Experienced in building production-grade microservices and verified open-source contributions.",
  verifiedStrengths: [
    "Demonstrated backend proficiency in Spring Boot & PostgreSQL with verified public code repositories.",
    "Clear architectural structure with modular component hierarchy.",
    "Strong semantic alignment with full-stack job specifications."
  ],
  actionableRevisions: [
    "Add metrics to accomplishments (e.g., increased efficiency by X%).",
    "Detail specific projects with measurable outcomes.",
    "Obtain and list relevant cloud certifications (AWS/GCP).",
    "Use keywords from the job description when describing work experience.",
    "Include a concise summary section highlighting key technical strengths."
  ]
};

export const PROBLEM_CARDS = [
  {
    id: "blind-spots",
    title: "You can't see what's actually wrong",
    desc: "Rejection emails don't come with notes. You are left guessing whether it was lack of experience, missing keywords, or structural layout."
  },
  {
    id: "claimed-vs-demonstrated",
    title: "Listed skills aren't the same as demonstrated skills",
    desc: "Listing 'AWS' in a skills bullet carries little weight without corresponding bullet points proving production usage."
  },
  {
    id: "ats-filters",
    title: "You're guessing how ATS software reads your file",
    desc: "Unparsed headers, unsupported styling, or missing skill synonyms quietly prevent qualified resumes from reaching human recruiters."
  },
  {
    id: "role-emphasis",
    title: "Every job needs a different emphasis",
    desc: "One static resume fails to emphasize the exact high-priority competencies requested in varying job descriptions."
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Upload Resume",
    desc: "Drop in your PDF or DOCX file (up to 5MB). Text is parsed cleanly in-session."
  },
  {
    step: "02",
    title: "Paste Job Description",
    desc: "Provide the target job posting to extract role-specific required and preferred skills."
  },
  {
    step: "03",
    title: "Evidence Audit",
    desc: "Resurox checks claimed skills against real work history and public GitHub repos."
  },
  {
    step: "04",
    title: "Read Marked-Up Report",
    desc: "Review deterministic match scores, recruiter verdict, and margin notes."
  }
];

export const AUDIENCE_PERSONAS = [
  {
    role: "STUDENTS",
    tagline: "Turn Coursework into Verified Evidence",
    desc: "Learn how to frame class projects, hackathons, and lab assignments as concrete technical evidence recruiters value."
  },
  {
    role: "DEVELOPERS",
    tagline: "Connect Buzzwords to Real Code",
    desc: "Bridge the gap between a laundry list of languages and verified GitHub repositories with measurable system impact."
  },
  {
    role: "FRESH GRADUATES",
    tagline: "Pass Automated Screening Flawlessly",
    desc: "Standardize sections, skill normalization, and formatting to guarantee machine parseability across all major ATS systems."
  },
  {
    role: "PROFESSIONALS",
    tagline: "Condense Years into High-Signal Value",
    desc: "Eliminate passive bullet points and highlight leadership outcomes, efficiency gains, and quantifiable impact."
  }
];

export const PRIVACY_BULLETS = [
  {
    title: "In-Memory Document Processing",
    desc: "Resume files are processed in-memory during active sessions to extract structured requirement models.",
    policyTag: "EPHEMERAL / IN-MEMORY ONLY"
  },
  {
    title: "Zero Permanent Storage",
    desc: "Original uploaded documents are never retained or indexed into persistent databases without explicit user action.",
    policyTag: "ZERO DISK RETENTION"
  },
  {
    title: "Bring Your Own AI Provider",
    desc: "Connect your own OpenRouter, Google Gemini, or OpenAI API key directly. Keys are stored locally in your browser.",
    policyTag: "STORED LOCALLY IN BROWSER"
  },
  {
    title: "No Foundation Model Training",
    desc: "Your candidate profile data is strictly evaluated against job descriptions and never used to train third-party LLMs.",
    policyTag: "NO THIRD-PARTY LLM TRAINING"
  }
];

export const FAQ_ITEMS = [
  {
    question: "What is Resurox?",
    answer:
      "Resurox is an evidence-backed candidate evaluation platform. It separates structured parsing from mathematical scoring to deliver 100% deterministic, unbiased resume audits with actionable recruiter marginalia."
  },
  {
    question: "Is Resurox free to use?",
    answer:
      "Yes. Resurox is open-source and supports zero-cost open models via OpenRouter (e.g. Nemotron, Llama) as well as direct Google Gemini and OpenAI developer API keys."
  },
  {
    question: "Which file formats and sizes are supported?",
    answer:
      "Resurox supports PDF (.pdf) and Microsoft Word (.docx) documents up to a maximum file size of 5MB."
  },
  {
    question: "Which AI providers can I configure?",
    answer:
      "You can configure OpenRouter (with default free-tier models), Google Gemini (Gemini 2.5 Flash), or OpenAI (GPT-4o Mini) directly from the in-app settings."
  },
  {
    question: "Does it replace a professional human recruiter?",
    answer:
      "No. Resurox is designed as an automated structural and evidence audit tool. While it catches evidence gaps, ATS blockers, and keyword discrepancies, human mentors provide qualitative career context."
  },
  {
    question: "Does Resurox guarantee interviews?",
    answer:
      "No. Resurox helps you strengthen your resume. It cannot guarantee interviews, jobs, or recruiter responses, as hiring decisions depend on recruiter discretion, market demand, and overall competition."
  }
];
