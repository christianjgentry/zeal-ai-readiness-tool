---
tags:
  - phase
---

# Phase Framework

The 6-phase maturity model is defined inline in `src/App.jsx` as the `phases` array. Each phase represents a stage of organizational readiness for agentic AI.

## Phase Overview

| Phase | Name | Subtitle |
|-------|------|----------|
| 1 | Unstructured Exploration | AI as novelty |
| 2 | Assisted Workflows | AI accelerates individual work |
| 3 | Integrated Automation | AI embedded in systems |
| 4 | Contextual Intelligence | AI that knows your business |
| 5 | Supervised Agentic Tasks | AI acts, humans approve |
| 6 | Autonomous at Scale | The Stripe Minions model |

Phase 6 has `isStripe: true` — a flag used for special styling/labeling.

## Phase Details

### Phase 1 — Unstructured Exploration
**Summary**: Teams experiment with AI tools individually. No governance, no integration.
**Focus**: Establish foundational security (SSO/MFA), create AI usage policy.
**Blockers**: No AI tool policy, unapproved tool adoption, no secrets management.

### Phase 2 — Assisted Workflows
**Summary**: AI accelerates individual productivity. Basic CI/CD and cloud in place.
**Focus**: Standardize CI/CD pipelines, implement basic cloud infrastructure.
**Blockers**: Manual deployments, no branching strategy, unmanaged cloud resources.

### Phase 3 — Integrated Automation
**Summary**: AI tools embedded into systems. Automated testing and deployment.
**Focus**: Container orchestration, automated testing, API standardization.
**Blockers**: Monolithic architecture, low test coverage, inconsistent APIs.

### Phase 4 — Contextual Intelligence
**Summary**: AI understands business context. Rich data platform, modern architecture.
**Focus**: Platform modernization, comprehensive observability, event-driven architecture.
**Blockers**: Legacy debt, poor observability, tightly coupled systems.

### Phase 5 — Supervised Agentic Tasks
**Summary**: AI agents perform tasks with human oversight and approval.
**Focus**: Advanced security policies, agentic workflow tooling, human-in-the-loop.
**Blockers**: Insufficient access controls, no audit trails, no approval workflows.

### Phase 6 — Autonomous at Scale
**Summary**: AI agents operate independently at scale (the Stripe Minions model).
**Focus**: Full autonomy with comprehensive safeguards, self-healing systems.
**Blockers**: Missing end-to-end observability, no agent orchestration, no rollback.

## Requirement Areas

Each phase has 5-7 requirements. Each requirement contains:

| Field | Purpose |
|-------|---------|
| `area` | IT capability area (e.g., "Identity & Access Management") |
| `level` | Maturity level needed (e.g., "Basic SSO", "Zero-trust policies") |
| `detail` | Detailed explanation of what's required |
| `zealService` | Zeal's corresponding service offering |
| `zealDesc` | Description of how Zeal helps |
| `zealTags` | Technology tags (e.g., ["Okta", "Azure AD"]) |

See [[Data-Schema#Phase Object]] for the exact object structure.

## Scoring Connection

The [[Scoring-Logic]] computes which phase an organization belongs to based on the **bottleneck principle** — your weakest survey category determines your phase. This maps directly to the phase framework: you must meet ALL requirements of a phase before advancing.

## Related

- [[Survey-System]] — The 7 survey categories that map to these phases
- [[Scoring-Logic]] — How survey answers determine phase placement
- [[Components#App.jsx]] — Where phase data is defined
