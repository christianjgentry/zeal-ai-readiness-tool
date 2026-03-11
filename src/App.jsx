import { useState, useEffect, Fragment } from "react";
import "./App.css";
import ParticleHeader from "./ParticleHeader";
import Survey from "./Survey";
import SurveyResults from "./SurveyResults";
import ContactGate from "./ContactGate";
import { computeCategoryScores, computeOverallPhase } from "./scoring";
import { phases } from "./phaseData";
import { supabase } from "./supabaseClient";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

function getLevelTier(level) {
  const gray = ["None required yet", "None required", "Any"];
  const gold = [
    "Pre-warmed, auto-scaling devbox pools", "400+ curated internal tools",
    "Parallel fleet workflows", "Hundreds of concurrent agent PRs",
    "Zero legacy debt in agent paths", "Near-zero flakiness, full coverage",
    "Ephemeral isolated environments", "Curated tool surface per task type",
    "Multi-step end-to-end agent tasks", "Self-healing capable pipelines",
    "Fully modern in agent execution paths", "High coverage, near-zero flakiness"
  ];
  if (gray.includes(level)) return { bg: "#F0F2F5", color: "#718096", border: "#D1D9E6" };
  if (gold.includes(level)) return { bg: "#FDF6E3", color: "#8B6914", border: "#ECD9A0" };
  return { bg: "#E3F0F7", color: "#1B6B93", border: "#B3D7EA" };
}

const STORAGE_KEY = "zeal-readiness-assessment";

function getHash() {
  return window.location.hash || "";
}

export default function App() {
  // Hydrate from localStorage (via initializers to avoid effect setState)
  const storedData = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  })[0];

  const [active, setActive] = useState(null);
  const [view, setView] = useState("framework"); // "framework" | "survey" | "contact" | "results"
  const [answers, setAnswers] = useState(() => storedData.answers || {});
  const [results, setResults] = useState(() => storedData.results || null);
  const [saved, setSaved] = useState(() => !!storedData.saved);
  const [contactInfo, setContactInfo] = useState(() => storedData.contactInfo || null);
  const sel = active !== null ? phases[active] : null;

  // Admin routing
  const [isAdmin, setIsAdmin] = useState(() => getHash().startsWith("#/admin"));
  const [adminSession, setAdminSession] = useState(null);
  const [adminSessionLoading, setAdminSessionLoading] = useState(!supabase);

  // Listen for hash changes
  useEffect(() => {
    const onHashChange = () => {
      setIsAdmin(getHash().startsWith("#/admin"));
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Supabase auth listener
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminSession(session);
      setAdminSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist answers on change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, answers }));
    }
  }, [answers]);

  const handlePhase = (i) => {
    setActive(i);
    setView("framework");
  };

  const handleStartSurvey = () => {
    setView("survey");
    setActive(null);
  };

  const handleSurveyComplete = () => {
    const catScores = computeCategoryScores(answers);
    const overall = computeOverallPhase(catScores);
    const res = { ...overall, categoryScores: catScores };
    setResults(res);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      answers,
      results: res,
      completedAt: Date.now(),
    }));
    setView("contact");
  };

  const handleContactSubmit = (info) => {
    setContactInfo(info);
    setSaved(true);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, saved: true, contactInfo: info }));
    setView("results");
  };

  const handleRetake = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setResults(null);
    setSaved(false);
    setContactInfo(null);
    setView("survey");
  };

  const handleViewResults = () => {
    if (results && saved) {
      setView("results");
    } else if (results) {
      setView("contact");
    }
  };

  const handleExplorePhase = (idx) => {
    handlePhase(idx);
  };

  const handleAdminLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setAdminSession(null);
  };

  // --- Admin view ---
  if (isAdmin) {
    if (!supabase) {
      return (
        <div className="admin-login">
          <div className="admin-login-card">
            <p>Supabase is not configured. Admin dashboard is unavailable.</p>
            <a href="#/" style={{ color: "var(--accent)", marginTop: 16, display: "inline-block" }}>&larr; Back to site</a>
          </div>
        </div>
      );
    }

    if (adminSessionLoading) {
      return (
        <div className="admin-login">
          <div className="admin-login-card">Loading...</div>
        </div>
      );
    }

    if (!adminSession) {
      return <AdminLogin onLogin={() => {}} />;
    }

    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // --- Normal app ---
  return (
    <div className="app">
      {/* Header */}
      <ParticleHeader activePhase={active} />

      <div className="app-inner">
        {/* Assessment CTA */}
        <div className="assessment-cta">
          {results ? (
            <>
              <button className="assessment-cta-btn" onClick={handleViewResults}>
                View Your Results — Phase {results.phase}
              </button>
              <button className="assessment-cta-link" onClick={handleRetake}>
                Retake Assessment
              </button>
            </>
          ) : (
            <button className="assessment-cta-btn" onClick={handleStartSurvey}>
              Take the Readiness Assessment
            </button>
          )}
        </div>

        {/* Survey / Results / Framework views */}
        {view === "survey" ? (
          <Survey
            answers={answers}
            onUpdateAnswers={setAnswers}
            onComplete={handleSurveyComplete}
            onCancel={() => setView("framework")}
          />
        ) : view === "contact" && results ? (
          <ContactGate
            answers={answers}
            results={results}
            onSubmit={handleContactSubmit}
          />
        ) : view === "results" && results ? (
          <SurveyResults
            results={results}
            contactInfo={contactInfo}
            onExplorePhase={handleExplorePhase}
            onRetake={handleRetake}
          />
        ) : null}

        {/* Phase Stepper */}
        {view === "framework" && <div className="phase-stepper">
          {phases.map((p, i) => (
            <Fragment key={p.id}>
              <button
                className={`phase-step${active === i ? " active" : ""}${active !== null && active > i ? " completed" : ""}`}
                onClick={() => handlePhase(i)}
              >
                <div className="phase-step-circle">{p.id}</div>
                <div className="phase-step-tag">{p.tag}</div>
                <div className="phase-step-name">{p.name}</div>
                {p.isStripe && <div className="phase-step-badge">Benchmark Reference</div>}
              </button>
              {i < phases.length - 1 && (
                <div
                  className={`phase-step-connector${active !== null && active > i ? " completed" : ""}`}
                />
              )}
            </Fragment>
          ))}
        </div>}

        {/* Phase Detail */}
        {view === "framework" && (sel ? (
          <div className="phase-detail" key={sel.id}>
            {/* Phase Header */}
            <div className="phase-header">
              <div className="phase-header-watermark">{sel.id}</div>
              <div className="phase-header-top">
                <div className="phase-header-left">
                  <div className="phase-header-tag">{sel.tag}</div>
                  <h2 className="phase-header-name">{sel.name}</h2>
                  <div className="phase-header-subtitle">{sel.subtitle}</div>
                </div>
                {sel.isStripe && (
                  <div className="phase-stripe-badge">Benchmark Reference</div>
                )}
              </div>
              <p className="phase-summary">{sel.summary}</p>
            </div>

            {/* Requirements Section */}
            <div className="section">
              <div className="section-label" style={{ color: "var(--accent)" }}>
                <span className="section-label-dot" style={{ background: "var(--accent)" }} />
                IT Requirements
              </div>
              <div className="req-list">
                {sel.requirements.map((req, i) => {
                  const tier = getLevelTier(req.level);
                  return (
                    <div key={i} className="req-card">
                      <div className="req-card-top">
                        <div className="req-card-meta">
                          <div className="req-area-name">{req.area}</div>
                          <span
                            className="req-level-badge"
                            style={{
                              color: tier.color,
                              background: tier.bg,
                              border: `1px solid ${tier.border}`,
                            }}
                          >
                            {req.level}
                          </span>
                        </div>
                        <div className="req-detail">{req.detail}</div>
                      </div>
                      <div className="zeal-panel">
                        <div className="zeal-service-name">{req.zealService}</div>
                        <p className="zeal-service-desc">{req.zealDesc}</p>
                        <div className="zeal-tags">
                          {req.zealTags.map((t, j) => (
                            <span key={j} className="zeal-tag">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Blockers Section */}
            <div className="section">
              <div className="section-label" style={{ color: "var(--red)" }}>
                <span className="section-label-dot" style={{ background: "var(--red)" }} />
                IT Gaps That Block This Phase
              </div>
              <div className="blockers-list">
                {sel.blockers.map((b, i) => (
                  <div key={i} className="blocker-item">
                    <span className="blocker-x">{"\u2717"}</span>
                    <span className="blocker-text">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps Section */}
            <div className="section">
              <div className="section-label" style={{ color: "var(--navy)" }}>
                <span className="section-label-dot" style={{ background: "var(--navy)" }} />
                {sel.isStripe ? "Sustaining Excellence" : "IT Priorities to Advance"}
              </div>
              <div className="next-step-box">
                <p className="next-step-text">{sel.nextStep}</p>
              </div>
              {!sel.isStripe && active < phases.length - 1 && (
                <button
                  className="next-phase-btn"
                  onClick={() => handlePhase(active + 1)}
                >
                  Explore {phases[active + 1].tag}: {phases[active + 1].name}
                  <span className="next-phase-btn-arrow">{"\u2192"}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-arrow" />
            <p className="empty-state-text">
              Select a phase to see the IT maturity it requires, what blocks it, and exactly how Zeal helps you advance.
            </p>
          </div>
        ))}


        <div className="footer">
          Inspired by Stripe Minions &mdash; 1,000+ AI-written PRs/week (Feb 2026) &bull; Zeal IT Consultants Agentic Readiness Framework
        </div>
      </div>
    </div>
  );
}
