---
tags:
  - architecture
---

# Architecture

## Component Hierarchy

```
App.jsx (state owner — 598 lines)
├── ParticleHeader.jsx (157 lines) — Animated canvas background
├── Survey.jsx (138 lines) — Multi-step questionnaire
├── SurveyResults.jsx (116 lines) — Results display
└── Phase Detail (inline in App.jsx) — Phase stepper + detail cards
```

## State Management

All state is lifted into `App.jsx`. No external state library.

| State | Type | Purpose |
|-------|------|---------|
| `view` | `"framework" \| "survey" \| "results"` | Controls which view renders |
| `active` | `number \| null` | Selected phase index (0-5), null = overview |
| `answers` | `object` | Survey responses keyed by question ID |
| `results` | `object \| null` | Computed scores and phase placement |

## View Routing

There is no router library. The `view` state variable acts as a simple router:

```
"framework" → Phase stepper + phase detail cards
"survey"    → Survey wizard (7 steps)
"results"   → Results hero + category breakdown
```

### Transition Paths

1. **Landing**: `view="framework"`, `active=null` — shows overview + CTA
2. **Take Survey**: `view="survey"` — wizard with progress bar
3. **Complete**: Compute scores → `view="results"` — hero card + bars
4. **Explore Phase**: `view="framework"`, `active=N` — jump to specific phase
5. **Retake**: Clear localStorage → `view="survey"` — fresh start

## Data Flow

```
surveyData.js (questions)
      ↓
Survey.jsx (collects answers)
      ↓
App.jsx (stores answers in state + localStorage)
      ↓
scoring.js (scoreQuestion → computeCategoryScores → computeOverallPhase)
      ↓
SurveyResults.jsx (displays results)
```

See [[Scoring-Logic]] for algorithm details.

## localStorage Persistence

**Key**: `"zeal-readiness-assessment"`

**Strategy**:
- **On mount**: Hydrate `answers` and `results` from localStorage (silent fail on parse error)
- **On answer change**: Auto-save answers (useEffect dependency)
- **On complete**: Save `{ answers, results, completedAt }` as single object
- **On retake**: `localStorage.removeItem()`

See [[Data-Schema]] for stored data shapes.

## Props Threading

```
App.jsx
├── ParticleHeader ← activePhase (read-only)
├── Survey ← answers, onUpdateAnswers, onComplete, onCancel
├── SurveyResults ← results, onExplorePhase, onRetake
└── Phase Detail ← inline rendering using active + phases array
```

Phase data (the 6-phase definitions) is defined inline in `App.jsx` as a `phases` array — not in a separate data file.
