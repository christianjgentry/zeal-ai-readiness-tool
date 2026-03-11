---
tags:
  - architecture
---

# Architecture

## Component Hierarchy

```
App.jsx (state owner)
├── ParticleHeader.jsx — Animated canvas background
├── Survey.jsx — Multi-step questionnaire
├── SurveyResults.jsx — Results display
│   └── SaveResultsModal.jsx — Save to Supabase + PDF download
├── AdminLogin.jsx — Admin authentication (Supabase email/password)
├── AdminDashboard.jsx — Submissions dashboard (stats, table, detail)
└── Phase Detail (inline in App.jsx) — Phase stepper + detail cards
```

**Shared modules**:
- `phaseData.js` — Phase definitions (extracted from App.jsx)
- `supabaseClient.js` — Supabase client singleton
- `pdfExport.js` — PDF generation utility (jsPDF)

## State Management

All state is lifted into `App.jsx`. No external state library.

| State | Type | Purpose |
|-------|------|---------|
| `view` | `"framework" \| "survey" \| "results"` | Controls which view renders |
| `active` | `number \| null` | Selected phase index (0-5), null = overview |
| `answers` | `object` | Survey responses keyed by question ID |
| `results` | `object \| null` | Computed scores and phase placement |
| `saved` | `boolean` | Whether results have been saved to Supabase |
| `isAdmin` | `boolean` | Whether URL hash is `#/admin` |
| `adminSession` | `object \| null` | Supabase auth session for admin |
| `adminSessionLoading` | `boolean` | Auth session check in progress |

## View Routing

Hash-based routing for admin (`#/admin`). The `view` state variable routes the main app:

```
"framework" → Phase stepper + phase detail cards
"survey"    → Survey wizard (7 steps)
"results"   → Results hero + category breakdown
"#/admin"   → AdminLogin (no session) or AdminDashboard (authenticated)
```

### Transition Paths

1. **Landing**: `view="framework"`, `active=null` — shows overview + CTA
2. **Take Survey**: `view="survey"` — wizard with progress bar
3. **Complete**: Compute scores → `view="results"` — hero card + bars
4. **Save Results**: Modal overlay → submit to Supabase or download PDF
5. **Explore Phase**: `view="framework"`, `active=N` — jump to specific phase
6. **Retake**: Clear localStorage, reset `saved` → `view="survey"` — fresh start
7. **Admin**: Navigate to `#/admin` → login → dashboard with submissions

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
      ↓
SaveResultsModal.jsx → supabaseClient.js (persist to Supabase)
                      → pdfExport.js (generate PDF download)
```

See [[Scoring-Logic]] for algorithm details.

## localStorage Persistence

**Key**: `"zeal-readiness-assessment"`

**Strategy**:
- **On mount**: Hydrate `answers`, `results`, and `saved` from localStorage via `useState` initializers (no useEffect)
- **On answer change**: Auto-save answers (useEffect dependency)
- **On complete**: Save `{ answers, results, completedAt }` as single object
- **On save to Supabase**: Add `saved: true` to localStorage object
- **On retake**: `localStorage.removeItem()`, reset `saved` to false

See [[Data-Schema]] for stored data shapes.

## Supabase Integration

**Backend**: Supabase (hosted Postgres + auth + RLS). Client configured in `src/supabaseClient.js`.

**Env vars**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (via `.env.local` locally, GitHub secrets for CI).

**Graceful degradation**: If env vars are missing, `supabase` is `null` — save button shows an error, admin page shows "not configured". The main survey/results flow works without Supabase.

**Table**: `submissions` — stores name, email, company, answers (JSONB), results (JSONB), phase, average, weakest_category, completed_at.

**RLS**: anon can INSERT (public submissions), authenticated can SELECT (admin reads).

**Auth**: One admin user created in Supabase Auth. `#/admin` renders `AdminLogin` → `AdminDashboard`.

## Props Threading

```
App.jsx
├── ParticleHeader ← activePhase (read-only)
├── Survey ← answers, onUpdateAnswers, onComplete, onCancel
├── SurveyResults ← results, answers, saved, onSaved, onExplorePhase, onRetake
│   └── SaveResultsModal ← answers, results, onSaved, onClose
├── AdminLogin ← onLogin
├── AdminDashboard ← onLogout
└── Phase Detail ← inline rendering using active + phases array
```

Phase data is defined in `src/phaseData.js` and imported by App.jsx.
