---
tags:
  - survey
---

# Survey System

The survey is a 7-step wizard. Each step corresponds to one assessment category. Data lives in `src/surveyData.js` (300 lines).

## Categories & Questions

### 1. Identity, Access & Security Governance (`identity-access`)
| Question ID | Type | Options |
|------------|------|---------|
| `iam-sso` | radio | 5 options (scores: 1, 2, 3.5, 4.5, 6) |
| `iam-policy` | radio | 5 options (scores: 1, 2, 3, 4.5, 6) |
| `iam-secrets` | radio | 4 options (scores: 1, 2, 4, 5.5) |

### 2. CI/CD Pipeline Maturity (`cicd`)
| Question ID | Type | Options |
|------------|------|---------|
| `cicd-pipeline` | radio | 5 options (scores: 1, 2, 3, 4.5, 6) |
| `cicd-branch` | radio | 4 options (scores: 1, 2.5, 4, 5.5) |
| `cicd-deploy` | radio | 5 options (scores: 1, 2, 3.5, 5, 6) |

### 3. Cloud Infrastructure & Containerization (`cloud-infra`)
| Question ID | Type | Options |
|------------|------|---------|
| `cloud-state` | radio | 4 options (scores: 1, 2.5, 4, 5.5) |
| `cloud-tools` | checkbox | docker, k8s, iac, serverless, registry |
| `cloud-isolation` | radio | 4 options (scores: 1, 2, 4, 6) |

### 4. Platform Modernity & Legacy Debt (`platform-modernity`)
| Question ID | Type | Options |
|------------|------|---------|
| `platform-stack` | radio | 4 options (scores: 1, 2, 4, 5.5) |
| `platform-monolith` | radio | 4 options (scores: 1, 2.5, 4, 5.5) |
| `platform-legacy-pct` | slider | 0-100%, thresholds: 20→1, 40→2, 60→3, 80→4.5, 100→6 |

### 5. Testing & Quality Assurance (`testing-qa`)
| Question ID | Type | Options |
|------------|------|---------|
| `testing-coverage` | radio | 5 options (scores: 1, 2, 3.5, 5, 6) |
| `testing-coverage-pct` | slider | 0-100%, thresholds: 10→1, 30→2, 50→3, 75→4.5, 100→6 |
| `testing-flaky` | radio | 5 options (scores: 1, 2, 3.5, 5, 6) |

### 6. API Surface & Integration Readiness (`api-integration`)
| Question ID | Type | Options |
|------------|------|---------|
| `api-surface` | radio | 4 options (scores: 1, 2, 4, 5.5) |
| `api-patterns` | checkbox | rest, graphql, events, webhooks, grpc |
| `api-docs` | radio | 4 options (scores: 1, 2, 4, 6) |

### 7. Observability & Agentic Workflows (`observability-agentic`)
| Question ID | Type | Options |
|------------|------|---------|
| `obs-state` | radio | 5 options (scores: 1, 2, 3, 5, 6) |
| `obs-agentic` | checkbox | mcp, rag, workflows, hitl, vectordb |
| `obs-maturity` | slider | 0-10, thresholds: 1→1, 3→2, 5→3, 7→4.5, 10→6 |

## Question Types

### Radio
Single-select. Each option has a `label` and a `score` (numeric). The score is used directly. All radio questions are **required**.

### Checkbox
Multi-select. Options have `label` and `value` (string). Scored by count of selections (see [[Scoring-Logic]]). Checkbox questions are **optional** — 0 selections is valid.

### Slider
Numeric range with `min`, `max`, `step`, `unit`. Has `thresholds` array — each threshold maps a max value to a score. All slider questions are **required**.

## Validation

Per-step validation in [[Components#Survey.jsx]]:
- All radio and slider questions in the current step must be answered
- Checkbox questions do not block progression
- The "Next" / "View Results" button is disabled until validation passes

## Data Source

`src/surveyData.js` exports `surveyCategories` — an array of 7 category objects. See [[Data-Schema]] for exact shapes.
