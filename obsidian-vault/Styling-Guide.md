---
tags:
  - styling
---

# Styling Guide

All styles live in two files:
- `src/index.css` — CSS variables (design tokens), global resets
- `src/App.css` — All component styles, responsive rules

## Design Tokens (CSS Variables)

### Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--navy` | `#0B2545` | Primary: buttons, active states, hero circles |
| `--navy-medium` | `#13315C` | Button hover states |
| `--accent` | `#1B6B93` | Teal: section labels, highlights, selected chips |
| `--accent-light` | `#E3F0F7` | Light teal backgrounds |
| `--red` | `#C0392B` | Error/danger: blockers, callout borders |
| `--red-soft` | `#E74C3C` | Softer red variant |

### Text Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--text-primary` | `#1A1A2E` | Headings, main content |
| `--text-secondary` | `#4A5568` | Descriptions, body text |
| `--text-tertiary` | `#718096` | Labels, metadata |
| `--text-muted` | `#A0AEC0` | Disabled, footer text |

### Backgrounds

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-deep` | `#F7F8FA` | Page background |
| `--bg-base` | `#FFFFFF` | Card background |
| `--bg-surface` | `#FFFFFF` | Modal/surface background |
| `--bg-elevated` | `#F0F2F5` | Elevated surface (Zeal panels) |
| `--bg-hover` | `#E8ECF2` | Hover state backgrounds |

### Borders

| Variable | Value | Usage |
|----------|-------|-------|
| `--border-subtle` | `#EDF0F4` | Light dividers |
| `--border-default` | `#D1D9E6` | Standard borders |
| `--border-emphasis` | `#B0BDD0` | Emphasized borders |

### Typography

| Variable | Value | Usage |
|----------|-------|-------|
| `--font-display` | `'Plus Jakarta Sans', sans-serif` | Headings, labels, buttons |
| `--font-body` | `'Inter', sans-serif` | Body text |

### Spacing & Radius

| Variable | Value |
|----------|-------|
| `--radius-sm` | `4px` |
| `--radius-md` | `6px` |
| `--radius-lg` | `8px` |
| `--radius-xl` | `10px` |

## Spectrum Colors

Used in [[Components#SurveyResults.jsx]] for the phase spectrum bar:

```
Phase 1: #B0BDD0 (light gray-blue)
Phase 2: #8FA0BA
Phase 3: #6E83A3
Phase 4: #4D668C
Phase 5: #2C4975
Phase 6: #0B2545 (navy)
```

Inactive phases get `opacity: 0.12`.

## Level Tier Badge Colors

Used by `getLevelTier()` in [[Components#App.jsx]]:

| Tier | Background | Text | Matches |
|------|-----------|------|---------|
| Gray | `#F0F2F5` | `#718096` | "None required yet", "None required", "Any" |
| Gold | `#FDF6E3` | `#8B6914` | Advanced keywords (Phase 5-6 levels) |
| Blue | `#E3F0F7` | `#1B6B93` | All other requirement levels |

## CSS Class Naming

Component-prefixed kebab-case:
- `.phase-*` — Phase stepper and detail cards
- `.survey-*` — Survey wizard elements
- `.results-*` — Results display
- `.req-*` — Requirement cards
- `.zeal-*` — Zeal service panels
- `.assessment-*` — CTA buttons and assessment section
- `.save-modal-*` — Save results modal (form, inputs, buttons, states)
- `.admin-*` — Admin dashboard (login, stats, table, filters, detail, pagination)
- `.admin-login-*` — Admin login page
- `.admin-detail-*` — Admin submission detail view

## Key Layout Values

- **Max width**: 1,080px (`.app-inner`), 1,200px (`.admin`)
- **Admin max width**: 1,200px (wider for table layout)
- **Section padding**: 28px 40px
- **Card border-radius**: `var(--radius-xl)` (10px)
- **Card shadow**: `0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)`

## Responsive Breakpoints

| Breakpoint | Target | Key Changes |
|-----------|--------|-------------|
| Default | Desktop | Max-width 1080px centered |
| `900px` | Tablet | Phase stepper → 3-col grid, requirement cards → single column |
| `640px` | Mobile | 2-col grid, reduced padding, stacked layouts |

## Animation

- **fadeIn**: 0.25s ease, `translateY(6px)` → `translateY(0)`
- **Transitions**: 0.15s for colors/borders, 0.6s for bar widths
- **Particle animation**: See [[Components#ParticleHeader.jsx]]
