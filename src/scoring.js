import { surveyCategories } from "./surveyData";

function scoreQuestion(question, answer) {
  if (answer === undefined || answer === null) return null;

  if (question.type === "radio") {
    return answer;
  }

  if (question.type === "checkbox") {
    const count = Array.isArray(answer) ? answer.length : 0;
    const total = question.options.length;
    if (count === 0) return 1;
    if (count <= 1) return 2;
    if (count <= 2) return 3;
    if (count <= 3) return 4.5;
    if (count >= total - 1) return 6;
    return 5;
  }

  if (question.type === "slider") {
    const val = typeof answer === "number" ? answer : 0;
    for (const t of question.thresholds) {
      if (val <= t.max) return t.score;
    }
    return question.thresholds[question.thresholds.length - 1].score;
  }

  return null;
}

export function computeCategoryScores(answers) {
  return surveyCategories.map((cat) => {
    const scores = cat.questions
      .map((q) => scoreQuestion(q, answers[q.id]))
      .filter((s) => s !== null);
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      score: Math.round(avg * 10) / 10,
    };
  });
}

export function computeOverallPhase(categoryScores) {
  if (categoryScores.length === 0) return { phase: 1, average: 0 };
  const min = Math.min(...categoryScores.map((c) => c.score));
  const avg = categoryScores.reduce((a, c) => a + c.score, 0) / categoryScores.length;
  return {
    phase: Math.max(1, Math.floor(min)),
    average: Math.round(avg * 10) / 10,
    weakest: categoryScores.reduce((w, c) => (c.score < w.score ? c : w), categoryScores[0]),
  };
}
