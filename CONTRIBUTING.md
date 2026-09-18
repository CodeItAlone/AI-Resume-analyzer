# Contributing to EMUSER

Thank you for your interest in contributing to **EMUSER (AI Resume & Job Fit Analyzer)**! We welcome contributions to our deterministic evaluation engine, structured parsing layers, and editorial manuscript UI.

---

## 🛠️ Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/CodeItAlone/AI-Resume-analyzer.git
   cd AI-Resume-analyzer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up local environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Add your testing API key for OpenRouter, Google Gemini, or OpenAI.

4. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 🌿 Branching Strategy

Always create a new dedicated branch for your changes:
- `feat/feature-name` for new features and UI improvements
- `fix/bug-fix-name` for bug fixes and parser enhancements
- `chore/task-name` for dependencies, documentation, and tooling
- `refactor/refactor-name` for non-breaking code structural improvements

```bash
git checkout -b feat/your-feature-name
```

---

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat(scope): add new feature`
- `fix(scope): resolve bug or parser edge-case`
- `docs(scope): update documentation or guides`
- `test(scope): add or update unit tests`
- `chore(scope): update configuration or dependencies`

---

## 🛡️ Pre-Push Quality Checklist

Before submitting a Pull Request, verify that all 4 pre-push validation checks pass:

```bash
# 1. Typecheck
npm run typecheck

# 2. Linting
npm run lint

# 3. Unit and Regression Tests
npm test

# 4. Next.js Production Build
npm run build
```

Husky pre-push hooks will run these checks automatically prior to pushing to remote.

---

## 🚀 Submitting a Pull Request

1. Push your branch to GitHub:
   ```bash
   git push -u origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Provide a clear summary of your changes, what tests were performed, and any visual proof (screenshots or diffs) if applicable.
