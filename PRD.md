# AI Resume Analyzer — One-Night Build Scope

This is the trimmed, buildable-in-one-night version of the full "AI Career
Copilot" vision. Everything here is in scope for tonight. Everything in
**Out of Scope** is deliberately cut and should not be built unless time
remains at the end.

---

## 1. Goal

A single web app where a user:
1. Uploads a resume (PDF or DOCX)
2. Pastes a job description
3. Gets a transparent match score + AI-generated analysis

No login. No history. No microservices. One app, one session.

---

## 2. Tech Stack (locked — do not deviate)

- **Frontend + Backend:** Next.js + TypeScript (App Router, API routes)
- **Styling:** Tailwind CSS
- **Storage:** SQLite (or just in-memory for the session — no Postgres, no S3)
- **AI:** One LLM API (OpenAI or Gemini) for parsing, embeddings, and
  explanation generation
- **Semantic similarity:** Single embeddings call + cosine similarity in
  code — no vector database, no pgvector

No Spring Boot, no separate FastAPI service, no Docker required to run
locally.

---

## 3. Core User Flow

```
Landing Page
   ↓
Upload Resume (PDF/DOCX)
   ↓
Paste Job Description
   ↓
Analyze (processing screen)
   ↓
Dashboard (results)
```

---

## 4. What To Build (in order)

### Step 1 — Upload + Text Extraction
- Drag-and-drop or file picker, PDF/DOCX only
- Validate file type, size, and non-empty content
- Extract raw text server-side (independent of the AI layer)
- Show a clear error if no extractable text is found

### Step 2 — Resume Parsing (text → structured JSON)
Use the LLM to convert raw resume text into structured JSON. See
`SCHEMA.md` for the exact fields. Must cover:
- Personal info (name, email, phone, links)
- Summary / current title / total experience
- Skills (flat list is fine tonight — skip sub-categorization if short on time)
- Education
- Experience (company, title, dates, responsibilities, achievements)
- Projects
- Certifications (optional if short on time)

### Step 3 — Job Description Parsing
Paste box → LLM extracts structured JSON: job title, required skills,
preferred skills, experience required, education required, keywords.
See `SCHEMA.md`.

### Step 4 — Deterministic Scoring Engine
**Pure functions. No LLM involved in producing numbers.**
- Skills Match (required skills found/partial/missing, with basic
  synonym normalization e.g. "React.js" = "React")
- Experience Match (years required vs. years found)
- Education Match (degree level required vs. found)
- Semantic Match (embedding cosine similarity between resume text
  and JD text, or per-section if time allows)
- Overall Score = weighted sum (see `SCORING.md` for exact weights
  and worked example — implement this literally, do not let the
  agent "adjust" it)

Skip tonight: full ATS formatting analysis (tables, headers/footers
detection), resume-quality grammar scoring — do a simplified version
or stub it with a fixed placeholder if time is short.

### Step 5 — LLM Explanation Layer
Fed the **already-computed** structured scores + matched/missing
skills lists (never raw scoring authority). Generates:
- Strengths (only things actually found in the resume — no invention)
- Areas to improve (missing / partial / weakly described)
- 3–5 actionable recommendations (never suggest fabricating experience)

### Step 6 — Dashboard
- Overall score + label (e.g. "Good Match")
- Sub-scores (Skills / Experience / Education / Semantic)
- Skills table: Matched / Partial / Missing
- Strengths list
- Areas to improve list
- AI recommendations list

---

## 5. Out of Scope Tonight

Do not build unless everything above is done and working:

- User authentication / accounts
- Analysis history page
- Postgres + pgvector / vector database
- Separate Spring Boot backend + separate FastAPI AI service
- S3 / cloud storage for uploaded files
- Full ATS formatting analysis (table/header detection, layout complexity)
- Bullet-point rewriting feature
- Resume builder / cover letter generator / job scraping (future vision only)

---

## 6. Non-Negotiable AI Rules

- The LLM never invents skills, experience, companies, education,
  achievements, or metrics.
- The LLM never changes or influences the numerical score — that's
  pure code.
- If something isn't in the resume, the output says "Not found in
  the resume" — not a guess.
- Recommendations must never suggest lying on the resume.

---

## 7. Definition of Done for Tonight

- [ ] Upload a real PDF and DOCX resume successfully
- [ ] Paste a real JD and get structured JSON back
- [ ] Overall score is computed by code, matches the weighting formula
- [ ] Dashboard shows sub-scores, matched/missing skills, strengths,
      areas to improve, and recommendations
- [ ] No fabricated content appears anywhere in the output