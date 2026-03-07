const spectrumColors = ["#B0BDD0", "#8FA0BA", "#6E83A3", "#4D668C", "#2C4975", "#0B2545"];

const phaseNames = [
  "Unstructured Exploration",
  "Assisted Workflows",
  "Integrated Automation",
  "Contextual Intelligence",
  "Supervised Agentic Tasks",
  "Autonomous at Scale",
];

export default function SurveyResults({ results, onExplorePhase, onRetake }) {
  const { phase, average, weakest, categoryScores } = results;
  const maxScore = 6;

  return (
    <div className="results">
      {/* Hero */}
      <div className="results-hero">
        <div className="results-hero-phase">{phase}</div>
        <div className="results-hero-text">
          <div className="results-hero-label">Your Organization Is At</div>
          <h2 className="results-hero-title">Phase {phase}: {phaseNames[phase - 1]}</h2>
          <div className="results-hero-avg">
            Overall trajectory score: <strong>{average}</strong> / 6
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="results-section">
        <div className="results-section-title">Category Breakdown</div>
        <div className="results-bars">
          {categoryScores.map((cat, i) => {
            const pct = (cat.score / maxScore) * 100;
            const colorIdx = Math.min(Math.floor(cat.score) - 1, 5);
            const color = spectrumColors[Math.max(0, colorIdx)];
            return (
              <div key={cat.categoryId} className="results-bar-row">
                <div className="results-bar-label">{cat.categoryName}</div>
                <div className="results-bar-track">
                  <div
                    className="results-bar-fill"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <div className="results-bar-score">{cat.score}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weakest Link */}
      {weakest && (
        <div className="results-callout">
          <div className="results-callout-eyebrow">Constraining Dimension</div>
          <div className="results-callout-name">{weakest.categoryName}</div>
          <p className="results-callout-text">
            Your overall phase placement is determined by your weakest dimension.
            Advancing <strong>{weakest.categoryName}</strong> (currently scoring {weakest.score}/6)
            will unlock the next phase for your organization.
          </p>
        </div>
      )}

      {/* Next Steps */}
      <div className="results-section">
        <div className="results-section-title">Recommended Next Steps</div>
        <div className="results-next-box">
          <p className="results-next-text">
            Explore Phase {phase} to see the specific IT requirements, gaps, and Zeal services
            that will advance your organization to the next level of agentic readiness.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="results-actions">
        <button className="survey-btn survey-btn-next" onClick={() => onExplorePhase(phase - 1)}>
          Explore Phase {phase} Details
        </button>
        <button className="survey-btn survey-btn-back" onClick={onRetake}>
          Retake Assessment
        </button>
      </div>
    </div>
  );
}
