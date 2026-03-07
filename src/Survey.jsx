import { useState } from "react";
import { surveyCategories } from "./surveyData";

export default function Survey({ answers, onUpdateAnswers, onComplete, onCancel }) {
  const [step, setStep] = useState(0);
  const cat = surveyCategories[step];
  const total = surveyCategories.length;

  const handleRadio = (questionId, score) => {
    onUpdateAnswers({ ...answers, [questionId]: score });
  };

  const handleCheckbox = (questionId, value) => {
    const current = answers[questionId] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onUpdateAnswers({ ...answers, [questionId]: next });
  };

  const handleSlider = (questionId, value) => {
    onUpdateAnswers({ ...answers, [questionId]: Number(value) });
  };

  const allAnswered = cat.questions.every((q) => {
    const a = answers[q.id];
    if (q.type === "checkbox") return true; // checkboxes are optional (0 is valid)
    if (q.type === "slider") return a !== undefined && a !== null;
    return a !== undefined && a !== null;
  });

  const handleNext = () => {
    if (step < total - 1) setStep(step + 1);
    else onComplete();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else onCancel();
  };

  return (
    <div className="survey" key={step}>
      {/* Progress Bar */}
      <div className="survey-progress">
        {surveyCategories.map((c, i) => (
          <button
            key={c.id}
            className={`survey-progress-step${i === step ? " active" : ""}${i < step ? " completed" : ""}`}
            onClick={() => i <= step && setStep(i)}
            disabled={i > step}
          >
            <span className="survey-progress-num">{i + 1}</span>
          </button>
        ))}
      </div>

      <div className="survey-header">
        <div className="survey-step-label">Step {step + 1} of {total}</div>
        <h2 className="survey-cat-name">{cat.name}</h2>
      </div>

      <div className="survey-questions">
        {cat.questions.map((q) => (
          <div key={q.id} className="survey-question">
            <div className="survey-question-text">{q.question}</div>

            {q.type === "radio" && (
              <div className="survey-radio-group">
                {q.options.map((opt, j) => (
                  <button
                    key={j}
                    className={`survey-radio-card${answers[q.id] === opt.score ? " selected" : ""}`}
                    onClick={() => handleRadio(q.id, opt.score)}
                  >
                    <span className="survey-radio-indicator" />
                    <span className="survey-radio-label">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {q.type === "checkbox" && (
              <div className="survey-chip-group">
                {q.options.map((opt) => {
                  const checked = (answers[q.id] || []).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      className={`survey-chip${checked ? " selected" : ""}`}
                      onClick={() => handleCheckbox(q.id, opt.value)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "slider" && (
              <div className="survey-slider-wrap">
                <input
                  type="range"
                  className="survey-slider"
                  min={q.min}
                  max={q.max}
                  step={q.step}
                  value={answers[q.id] ?? q.min}
                  onChange={(e) => handleSlider(q.id, e.target.value)}
                />
                <div className="survey-slider-value">
                  {answers[q.id] ?? q.min}{q.unit}
                </div>
                <div className="survey-slider-labels">
                  <span>{q.min}{q.unit}</span>
                  <span>{q.max}{q.unit}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="survey-nav">
        <button className="survey-btn survey-btn-back" onClick={handleBack}>
          {step === 0 ? "Cancel" : "Back"}
        </button>
        <button
          className="survey-btn survey-btn-next"
          onClick={handleNext}
          disabled={!allAnswered}
        >
          {step === total - 1 ? "View Results" : "Next"}
        </button>
      </div>
    </div>
  );
}
