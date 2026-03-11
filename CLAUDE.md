# Zeal AI Readiness Tool

A React SPA that assesses organizational IT readiness for agentic AI adoption across 6 maturity phases. Built for Zeal — an IT consultancy that guides enterprises through AI transformation.

## Tech Stack

- **Framework**: React 19 (no TypeScript — plain JSX)
- **Build**: Vite 7
- **Styling**: Vanilla CSS with CSS custom properties (no Tailwind, no CSS-in-JS)
- **State**: React hooks with lifted state in App.jsx (no Redux/Zustand)
- **Persistence**: localStorage
- **Deployment**: GitHub Pages via GitHub Actions

## Commands

```bash
npm run dev      # Local dev server with HMR
npm run build    # Production build to /dist
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## File Structure

```
src/
├── App.jsx           # Root component — state management, view routing, phase data
├── App.css           # All component styles, design tokens, responsive rules
├── Survey.jsx        # Multi-step questionnaire wizard
├── SurveyResults.jsx # Results display with spectrum visualization
├── ParticleHeader.jsx# Animated canvas particle background
├── surveyData.js     # 7 survey categories, 22 questions
├── scoring.js        # Scoring algorithm and phase calculation
├── main.jsx          # Entry point
└── index.css         # CSS variables (design tokens)
```

## Obsidian Vault — Project Knowledge Base

The `obsidian-vault/` directory is the canonical project knowledge base. **Start `00-Index.md` for navigation.**

### Before starting work:
1. Read `obsidian-vault/00-Index.md` for an overview
2. Read vault notes relevant to your task (Architecture, Components, Scoring-Logic, etc.)

### After completing work:
1. Update any vault notes affected by your changes
2. If you add new components or change data schemas, update the corresponding notes
3. Add significant changes to `obsidian-vault/Changelog.md`

## Coding Conventions

- **Components**: Functional components with hooks. No class components.
- **State**: All app state lives in App.jsx and is passed down via props.
- **Styling**: Use CSS variables from `index.css`. Follow existing class naming patterns (kebab-case, component-prefixed like `.survey-*`, `.phase-*`, `.results-*`).
- **Data**: Survey questions in `surveyData.js`, scoring in `scoring.js`, phase definitions inline in `App.jsx`.
- **localStorage**: Key is `"zeal-readiness-assessment"`. Shape: `{ answers, results, completedAt }`.
- **No TypeScript**: Props are documented in vault notes, not in type annotations.

## Deployment

- **Platform**: GitHub Pages at `/zeal-ai-readiness-tool/`
- **CI**: `.github/workflows/deploy.yml` — triggers on push to `main`
- **Node**: Requires v22
- **Base path**: Set in `vite.config.js` as `base: '/zeal-ai-readiness-tool/'`
