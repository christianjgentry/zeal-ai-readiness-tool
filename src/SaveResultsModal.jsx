import { useState } from "react";
import { supabase } from "./supabaseClient";
import { generateResultsPdf } from "./pdfExport";

export default function SaveResultsModal({ answers, results, onSaved, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | saved | error
  const [errorMsg, setErrorMsg] = useState("");

  const canSave = name.trim() && email.trim() && company.trim();

  const handleSave = async () => {
    if (!canSave) return;
    setStatus("saving");
    setErrorMsg("");

    if (!supabase) {
      setErrorMsg("Supabase is not configured. Results cannot be saved to the server.");
      setStatus("error");
      return;
    }

    const { error } = await supabase.from("submissions").insert({
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      answers,
      results,
      phase: results.phase,
      average: results.average,
      weakest_category: results.weakest?.categoryName || null,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      setErrorMsg(`Failed to save: ${error.message || error.code || "Unknown error"}`);
      setStatus("error");
      return;
    }

    setStatus("saved");
    onSaved();
  };

  const handleDownloadPdf = () => {
    generateResultsPdf({
      name: name.trim() || "Assessment User",
      email: email.trim(),
      company: company.trim() || "Organization",
      results,
    });
  };

  return (
    <div className="save-modal-overlay" onClick={onClose}>
      <div className="save-modal" onClick={(e) => e.stopPropagation()}>
        <button className="save-modal-close" onClick={onClose}>&times;</button>

        <div className="save-modal-header">
          <div className="save-modal-title">Save or Download Results</div>
          <p className="save-modal-subtitle">
            Enter your details to save results to Zeal or download a PDF report.
          </p>
        </div>

        <div className="save-modal-form">
          <label className="save-modal-label">
            Name *
            <input
              type="text"
              className="save-modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </label>
          <label className="save-modal-label">
            Email *
            <input
              type="email"
              className="save-modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </label>
          <label className="save-modal-label">
            Company *
            <input
              type="text"
              className="save-modal-input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your organization"
            />
          </label>
        </div>

        {status === "error" && (
          <div className="save-modal-error">{errorMsg}</div>
        )}

        {status === "saved" ? (
          <div className="save-modal-success">
            Results saved successfully.
            <button className="save-modal-btn save-modal-btn-secondary" onClick={handleDownloadPdf}>
              Download PDF
            </button>
          </div>
        ) : (
          <div className="save-modal-actions">
            <button
              className="save-modal-btn save-modal-btn-primary"
              onClick={handleSave}
              disabled={!canSave || status === "saving"}
            >
              {status === "saving" ? "Saving..." : "Save Results"}
            </button>
            <button
              className="save-modal-btn save-modal-btn-secondary"
              onClick={handleDownloadPdf}
              disabled={!name.trim() && !company.trim()}
            >
              Download PDF Only
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
