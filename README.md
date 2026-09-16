# AI Resume Analyzer

A Next.js & TypeScript application that provides transparent, factual resume-to-job match scoring and AI-driven analysis.

## Features
- **Server-Side Text Extraction**: Parses PDF (`pdf2json`) and DOCX (`mammoth`) files cleanly.
- **LLM Structured Parser**: Extracts structured JSON from resumes and job descriptions using Google Gemini API (`@google/genai`).
- **Deterministic Pure Scoring Engine**: Calculates objective scores across 4 dimensions:
  - **Skills Match (40%)**: Required vs preferred skills overlap with basic synonym normalization (e.g. `React.js` == `React`).
  - **Experience Match (30%)**: Numerical calculation comparing candidate years vs required years.
  - **Semantic Similarity (20%)**: Vector embeddings cosine similarity.
  - **Education Match (10%)**: Structured degree level tier comparison.
- **Factual AI Feedback**: Generates verified strengths, areas for improvement, and non-hallucinated actionable recommendations based strictly on pre-computed scores.
- **Interactive UI**: Drag-and-drop resume upload, job description input, radial progress indicators, skill breakdown matrix, and feedback cards.

## Setup Instructions

1. **Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Local Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

---

## Pre-deployment checklist

Before any commit is pushed or a PR is merged into `main`, the following 4 automated checks must be run locally and pass with zero errors:

1. **Type Checking**:
   ```bash
   npx tsc --noEmit
   # or
   npm run typecheck
   ```
   *Must exit with code 0 and zero TypeScript compilation errors.*

2. **Linting**:
   ```bash
   npm run lint
   ```
   *All ESLint errors must be resolved (warnings are acceptable but should be noted in PR descriptions).*

3. **Automated Tests**:
   ```bash
   npm test
   ```
   *Executes regression tests and scoring logic unit tests.*

4. **Production Build**:
   ```bash
   npm run build
   ```
   *Validates Next.js compilation, route data collection, and static page generation.*

> 💡 **Note**: A Husky pre-push git hook (`.husky/pre-push`) and GitHub Actions CI workflow (`.github/workflows/ci.yml`) automatically execute these checks on every push and pull request against `main`.

