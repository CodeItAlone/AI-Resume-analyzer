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
