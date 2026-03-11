---
tags:
  - data
---

# Data Schema

All data shapes used in the application.

## Phase Object

Defined inline in `src/App.jsx` (6 objects in `phases` array):

```javascript
{
  id: number,          // 1-6
  tag: string,         // "Phase 1" through "Phase 6"
  name: string,        // e.g. "Unstructured Exploration"
  subtitle: string,    // e.g. "AI as novelty"
  isStripe: boolean,   // true only for Phase 6
  summary: string,     // 1-2 sentence description
  requirements: [RequirementObject],
  blockers: [string],  // Array of blocker descriptions
  nextStep: string     // Recommended next action
}
```

### Requirement Object

```javascript
{
  area: string,        // IT capability area
  level: string,       // Required maturity level
  detail: string,      // Detailed explanation
  zealService: string, // Zeal service name
  zealDesc: string,    // How Zeal helps
  zealTags: [string]   // Technology tags
}
```

## Survey Category Object

Exported from `src/surveyData.js`:

```javascript
{
  id: string,          // e.g. "identity-access"
  name: string,        // e.g. "Identity, Access & Security Governance"
  questions: [QuestionObject]
}
```

## Question Object

Three variants based on `type`:

### Radio Question
```javascript
{
  id: string,
  type: "radio",
  question: string,
  options: [{ label: string, score: number }]
}
```

### Checkbox Question
```javascript
{
  id: string,
  type: "checkbox",
  question: string,
  options: [{ label: string, value: string }]
}
```

### Slider Question
```javascript
{
  id: string,
  type: "slider",
  question: string,
  min: number,
  max: number,
  step: number,
  unit: string,        // "%" or ""
  thresholds: [{ max: number, score: number }]
}
```

## Answer Object

Stored in App.jsx state and localStorage. Keyed by question ID:

```javascript
{
  "iam-sso": 4.5,                   // radio → score (number)
  "cloud-tools": ["docker", "k8s"], // checkbox → selected values (string[])
  "platform-legacy-pct": 45,        // slider → raw value (number)
  // ... one entry per answered question
}
```

## Results Object

Computed by [[Scoring-Logic]] functions:

```javascript
{
  phase: number,       // 1-6, determined by bottleneck principle
  average: number,     // Mean of category scores (1 decimal)
  weakest: {
    categoryId: string,
    categoryName: string,
    score: number
  },
  categoryScores: [{
    categoryId: string,
    categoryName: string,
    score: number      // 0-6, rounded to 1 decimal
  }]                   // 7 entries, one per category
}
```

## localStorage Schema

**Key**: `"zeal-readiness-assessment"`

```javascript
{
  answers: AnswerObject,     // See above
  results: ResultsObject,   // See above (null until survey completed)
  completedAt: number        // Date.now() timestamp
}
```

**Lifecycle**:
- Created incrementally as user answers questions
- Fully populated on survey completion
- Removed entirely on retake (`localStorage.removeItem()`)

## Category IDs → Names

| ID | Name |
|----|------|
| `identity-access` | Identity, Access & Security Governance |
| `cicd` | CI/CD Pipeline Maturity |
| `cloud-infra` | Cloud Infrastructure & Containerization |
| `platform-modernity` | Platform Modernity & Legacy Debt |
| `testing-qa` | Testing & Quality Assurance |
| `api-integration` | API Surface & Integration Readiness |
| `observability-agentic` | Observability & Agentic Workflows |
