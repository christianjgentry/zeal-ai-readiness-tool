---
tags:
  - changelog
---

# Changelog

Running log of significant changes to the project.

## 2026

### Gate results behind contact form (lead capture)
Results are now gated behind a required contact form (name/email/company). New `ContactGate.jsx` component renders as a full-page card between survey completion and results. Supabase submission happens at the gate (non-blocking on failure). Return visitors with `saved=true` skip the gate. `SaveResultsModal.jsx` deleted — PDF download moved to a direct button on the results page. localStorage shape updated to include `contactInfo`.

### Add Supabase persistence, admin dashboard, and PDF export
Survey results can now be saved to Supabase (Postgres). New features:
- **Save Results Modal** (`SaveResultsModal.jsx`) — collects name/email/company after results, inserts to Supabase `submissions` table
- **PDF Export** (`pdfExport.js`) — client-side branded PDF generation with jsPDF
- **Admin Dashboard** (`AdminDashboard.jsx`) — password-protected at `#/admin`, shows submissions table with search/filter/pagination and detail view
- **Admin Login** (`AdminLogin.jsx`) — Supabase email/password auth
- **Phase data extracted** (`phaseData.js`) — moved `phases` array out of App.jsx for reuse
- **Supabase client** (`supabaseClient.js`) — singleton using `VITE_SUPABASE_*` env vars
- **Deploy workflow** updated to inject Supabase secrets
- **localStorage hydration** refactored to use `useState` initializers (fixes React 19 lint rule)

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
