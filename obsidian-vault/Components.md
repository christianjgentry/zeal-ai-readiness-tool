---
tags:
  - component
---

# Components

## App.jsx

**Purpose**: Root component. Owns all state, hash-based admin routing, Supabase auth listener, renders phase detail UI.

**State**:
- `active` (number | null) — selected phase index
- `view` ("framework" | "survey" | "results") — current view
- `answers` (object) — survey responses
- `results` (object | null) — computed scores
- `saved` (boolean) — whether results have been saved to Supabase
- `isAdmin` (boolean) — whether URL hash starts with `#/admin`
- `adminSession` (object | null) — Supabase auth session
- `adminSessionLoading` (boolean) — auth loading state

**Key Functions**:
| Function | Purpose |
|----------|---------|
| `handlePhase(i)` | Select a phase, show framework view |
| `handleStartSurvey()` | Switch to survey view |
| `handleSurveyComplete()` | Compute scores via [[Scoring-Logic]], save to localStorage, show results |
| `handleRetake()` | Clear localStorage, reset state + `saved`, show survey |
| `handleViewResults()` | Show results view (no recompute) |
| `handleExplorePhase(idx)` | From results, navigate to phase detail |
| `handleSaved()` | Set `saved=true`, persist to localStorage |
| `handleAdminLogout()` | Sign out of Supabase, clear session |
| `getLevelTier(level)` | Returns `{ bg, color }` for requirement badge styling |

**Level Tier Coloring** (getLevelTier):
- **Gray** (`#F0F2F5` / `#718096`): "None required yet", "None required", "Any"
- **Gold** (`#FDF6E3` / `#8B6914`): Advanced requirements (Phase 5-6 keywords)
- **Blue** (`#E3F0F7` / `#1B6B93`): All other levels

**Phase Data**: Imported from `src/phaseData.js`. See [[Phase-Framework]] and [[Data-Schema]] for structure.

**Admin Routing**: Listens to `hashchange` events. When `#/admin`, renders `AdminLogin` (no session) or `AdminDashboard` (authenticated). Normal app chrome (ParticleHeader, stepper) is skipped.

---

## Survey.jsx (138 lines)

**Purpose**: Multi-step questionnaire wizard with progress bar and per-step validation.

**Props**:
| Prop | Type | Purpose |
|------|------|---------|
| `answers` | object | Current answers |
| `onUpdateAnswers` | function | Update answers in parent |
| `onComplete` | function | Called when survey finishes |
| `onCancel` | function | Called on back from step 0 |

**State**: `step` (number) — current category index (0-6)

**Handlers**:
- `handleRadio(qId, score)` — set single-select answer
- `handleCheckbox(qId, value)` — toggle multi-select option
- `handleSlider(qId, value)` — set numeric range value
- `handleNext()` — advance step or complete
- `handleBack()` — previous step or cancel

**Validation**: All radio/slider questions in current step must be answered. Checkbox questions are optional. See [[Survey-System]].

---

## SurveyResults.jsx

**Purpose**: Displays results — phase placement hero, category score bars, weakest dimension callout. Integrates save/download modal.

**Props**:
| Prop | Type | Purpose |
|------|------|---------|
| `results` | object | `{ phase, average, weakest, categoryScores }` |
| `answers` | object | Raw survey answers (passed to save modal) |
| `saved` | boolean | Whether results have been saved to Supabase |
| `onSaved` | function | Callback when save completes |
| `onExplorePhase` | function | Navigate to phase detail |
| `onRetake` | function | Restart survey |

**Local State**: `showSaveModal` (boolean) — toggles `SaveResultsModal`

**Key Data**:
- `spectrumColors`: `["#B0BDD0", "#8FA0BA", "#6E83A3", "#4D668C", "#2C4975", "#0B2545"]`
- `phaseNames`: Names for phases 1-6

**UI Sections**:
1. Hero card — phase circle, name, subtitle, overall score, spectrum bar with arrow
2. Category breakdown — horizontal bars per category
3. Constraining dimension — red-bordered callout for weakest score
4. Next steps recommendation
5. Actions — Explore Phase + **Save or Download Results** + Retake buttons

---

## SaveResultsModal.jsx

**Purpose**: Modal overlay for saving results to Supabase and/or downloading a branded PDF.

**Props**:
| Prop | Type | Purpose |
|------|------|---------|
| `answers` | object | Raw survey answers |
| `results` | object | Computed results |
| `onSaved` | function | Callback after successful save |
| `onClose` | function | Close modal |

**Local State**: `name`, `email`, `company` (form fields), `status` (idle | saving | saved | error), `errorMsg`

**Behavior**:
- All three fields required for save
- If Supabase is not configured (`supabase === null`), shows error message
- After save succeeds, shows success state with PDF download option
- "Download PDF Only" available without saving (requires at least name or company)
- Calls `generateResultsPdf()` from `pdfExport.js`

---

## AdminLogin.jsx

**Purpose**: Email/password login form for admin access via Supabase Auth.

**Props**:
| Prop | Type | Purpose |
|------|------|---------|
| `onLogin` | function | Callback after successful login (session handled via auth listener) |

**Behavior**: Calls `supabase.auth.signInWithPassword()`. Shows error on bad credentials.

---

## AdminDashboard.jsx

**Purpose**: Admin dashboard showing all submissions with stats, filtering, and detail view.

**Props**:
| Prop | Type | Purpose |
|------|------|---------|
| `onLogout` | function | Sign out and clear session |

**Local State**: `submissions`, `total`, `page`, `loading`, `search`, `phaseFilter`, `selected` (detail view), `stats`

**UI Sections**:
1. **Header** — "Zeal Admin" eyebrow, title, logout button
2. **Stats bar** — Total submissions, average phase, this week count
3. **Filters** — Text search (name/email/company) + phase dropdown
4. **Submissions table** — Sortable, paginated (20 per page), clickable rows
5. **Detail view** — Phase box, category scores, raw answers (JSON)

**Data Fetching**: Two `useEffect` hooks with inline async functions:
- `loadStats()` — runs once on mount, fetches total count, average phase (with RPC fallback), weekly count
- `loadSubmissions()` — runs on `[page, search, phaseFilter]` changes, uses Supabase `.range()` for pagination

---

## pdfExport.js

**Purpose**: Generates a branded PDF report using jsPDF (programmatic layout, no html2canvas).

**Exported Function**: `generateResultsPdf({ name, email, company, results })`

**PDF Content**:
1. Navy header band — "ZEAL IT CONSULTANTS", title, user info
2. Phase result box — phase number, name, average score
3. Category breakdown — horizontal bars with spectrum colors
4. Weakest dimension callout
5. Assessment details (name, company, email, date)
6. Next steps box
7. Footer

**Output**: Downloads `zeal-readiness-{company-slug}.pdf`

---

## phaseData.js

**Purpose**: Exports the `phases` array (6 phase definitions) — extracted from App.jsx for reuse by multiple modules.

**Export**: `export const phases = [...]`

See [[Phase-Framework]] and [[Data-Schema]] for structure.

---

## supabaseClient.js

**Purpose**: Supabase client singleton. Returns `null` if env vars are missing (graceful degradation).

**Export**: `export const supabase = createClient(url, key) | null`

**Env vars**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## ParticleHeader.jsx (157 lines)

**Purpose**: Canvas-based animated particle background. Particles flow left-to-right with sine wave motion. Visual intensity scales with active phase.

**Props**:
| Prop | Type | Purpose |
|------|------|---------|
| `activePhase` | number \| null | Controls particle config (count, speed, color) |

**Phase Configs** (7 entries — null + phases 1-6):
- Particle count: 30 → 135
- Speed: 0.6 → 1.75
- Hue: 215 → 182
- Saturation: 62 → 78%
- Lightness: 47 → 60%

**Animation**: Dual sine wave motion, lerp-smoothed config transitions (rate 0.04). Mobile scales particle count to 60%.

See [[Styling-Guide]] for color details.
