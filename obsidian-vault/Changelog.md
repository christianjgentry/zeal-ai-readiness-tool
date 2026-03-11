---
tags:
  - changelog
---

# Changelog

Running log of significant changes to the project.

## 2025

### Move IT readiness spectrum into results hero card
`8be691b` — Relocated the phase spectrum visualization into the results hero card with a phase indicator arrow for clearer visual hierarchy.

### Flatten IT requirement accordions and fix layout spacing
`77f5cd2` — Removed accordion expand/collapse from requirement cards, showing all content flat. Fixed various layout spacing issues.

### Add animated particle header
`3ec4766` — Added canvas-based animated particle header (ParticleHeader.jsx) that responds to active phase selection. Removed Industry Benchmark callout section.

### Add interactive readiness assessment survey wizard
`795c23a` — Implemented the full survey system: 7-category questionnaire (Survey.jsx), scoring engine (scoring.js), results display (SurveyResults.jsx), and localStorage persistence.

### Redesign to Big 4 consulting aesthetic
`7aeed84` — Complete visual overhaul to light corporate theme. Plus Jakarta Sans + Inter fonts, navy/teal/gray palette, CSS variable design system.

### Initial commit
`55f47bd` — Initial Zeal Agentic Readiness Framework with 6-phase model and requirement cards.
