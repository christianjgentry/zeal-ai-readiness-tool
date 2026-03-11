---
tags:
  - component
---

# Components

## App.jsx (598 lines)

**Purpose**: Root component. Owns all state, routes views, defines phase data, renders phase detail UI.

**State**:
- `active` (number | null) — selected phase index
- `view` ("framework" | "survey" | "results") — current view
- `answers` (object) — survey responses
- `results` (object | null) — computed scores

**Key Functions**:
| Function | Purpose |
|----------|---------|
| `handlePhase(i)` | Select a phase, show framework view |
| `handleStartSurvey()` | Switch to survey view |
| `handleSurveyComplete()` | Compute scores via [[Scoring-Logic]], save to localStorage, show results |
| `handleRetake()` | Clear localStorage, reset state, show survey |
| `handleViewResults()` | Show results view (no recompute) |
| `handleExplorePhase(idx)` | From results, navigate to phase detail |
| `getLevelTier(level)` | Returns `{ bg, color }` for requirement badge styling |

**Level Tier Coloring** (getLevelTier):
- **Gray** (`#F0F2F5` / `#718096`): "None required yet", "None required", "Any"
- **Gold** (`#FDF6E3` / `#8B6914`): Advanced requirements (Phase 5-6 keywords)
- **Blue** (`#E3F0F7` / `#1B6B93`): All other levels

**Inline Data**: The `phases` array (6 phase objects) is defined directly in App.jsx. See [[Phase-Framework]] and [[Data-Schema]] for structure.

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

## SurveyResults.jsx (116 lines)

**Purpose**: Displays results — phase placement hero, category score bars, weakest dimension callout.

**Props**:
| Prop | Type | Purpose |
|------|------|---------|
| `results` | object | `{ phase, average, weakest, categoryScores }` |
| `onExplorePhase` | function | Navigate to phase detail |
| `onRetake` | function | Restart survey |

**Key Data**:
- `spectrumColors`: `["#B0BDD0", "#8FA0BA", "#6E83A3", "#4D668C", "#2C4975", "#0B2545"]`
- `phaseNames`: Names for phases 1-6

**UI Sections**:
1. Hero card — phase circle, name, subtitle, overall score, spectrum bar with arrow
2. Category breakdown — horizontal bars per category
3. Constraining dimension — red-bordered callout for weakest score
4. Next steps recommendation
5. Actions — Explore Phase + Retake buttons

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
