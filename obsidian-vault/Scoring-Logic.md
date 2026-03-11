---
tags:
  - scoring
---

# Scoring Logic

All scoring functions live in `src/scoring.js` (55 lines).

## Pipeline

```
Individual Answers
      ↓ scoreQuestion()
Per-Question Scores
      ↓ computeCategoryScores()
Category Averages (7 scores)
      ↓ computeOverallPhase()
{ phase, average, weakest }
```

## scoreQuestion(question, answer) → number | null

Scores a single question based on type:

### Radio
Returns the answer directly — it's already a numeric score stored when the user selected an option.

### Checkbox
Scores based on **count** of selected items:

| Selected | Score |
|----------|-------|
| 0 | 1 |
| 1 | 2 |
| 2 | 3 |
| 3 | 4.5 |
| ≥ total - 1 (nearly all) | 6 |
| Otherwise | 5 |

### Slider
Walks the `thresholds` array. Returns the score of the **first** threshold where `value ≤ threshold.max`. Falls back to the last threshold score.

## computeCategoryScores(answers) → CategoryScore[]

For each of the 7 categories:
1. Score every question in the category via `scoreQuestion()`
2. Filter out null scores (unanswered questions)
3. Average the remaining scores
4. Round to 1 decimal place: `Math.round(avg * 10) / 10`

Returns: `[{ categoryId, categoryName, score }]`

## computeOverallPhase(categoryScores) → Result

```javascript
phase   = Math.max(1, Math.floor(minScore))  // Bottleneck principle
average = mean of all category scores (1 decimal)
weakest = category with the lowest score
```

**Bottleneck principle**: Your phase is determined by your **weakest** category, not your average. This models real-world constraints — one severely lacking area holds back the entire organization.

## Example Calculation

Given category scores: `[4.0, 3.5, 5.0, 2.0, 4.5, 3.8, 3.2]`

- **Min score**: 2.0 (API Surface & Integration Readiness)
- **Phase**: `Math.max(1, Math.floor(2.0))` = **Phase 2**
- **Average**: `(4.0 + 3.5 + 5.0 + 2.0 + 4.5 + 3.8 + 3.2) / 7` = **3.7**
- **Weakest**: `{ categoryId: "api-integration", score: 2.0 }`

## Edge Cases

- **All scores equal**: Phase = floor of that score. Weakest is first category.
- **Score exactly N.0**: Phase = N (floor of integer is itself).
- **Score between 0-1**: Phase = max(1, 0) = **Phase 1** (minimum).
- **Unanswered questions**: Excluded from average (not counted as 0).
- **All checkboxes unselected**: Score = 1 (valid, not null).

## Related

- [[Survey-System]] — Question definitions and types
- [[Data-Schema]] — Answer and result object shapes
