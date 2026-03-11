import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function ContactGate({ answers, results, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | error
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit = name.trim() && email.trim() && company.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("saving");
    setErrorMsg("");

    const contactInfo = {
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
    };

    // Save to Supabase (non-blocking — if it fails, still let user through)
    if (supabase) {
      const { error } = await supabase.from("submissions").insert({
        name: contactInfo.name,
        email: contactInfo.email,
        company: contactInfo.company,
        answers,
        results,
        phase: results.phase,
        average: results.average,
        weakest_category: results.weakest?.categoryName || null,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        // Don't block — still let user through
      }
    }

    onSubmit(contactInfo);
  };

  return (
    <div className="contact-gate">
      <div className="contact-gate-header">
        <div className="contact-gate-icon">&#10003;</div>
        <h2 className="contact-gate-title">Your assessment is ready!</h2>
        <p className="contact-gate-subtitle">
          Enter your details below to view your personalized AI readiness results.
        </p>
      </div>

      <form className="contact-gate-form" onSubmit={handleSubmit}>
        <label className="save-modal-label">
          Name *
          <input
            type="text"
            className="save-modal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
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
            required
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
            required
          />
        </label>

        {status === "error" && (
          <div className="save-modal-error">{errorMsg}</div>
        )}

        <button
          type="submit"
          className="survey-btn survey-btn-next contact-gate-btn"
          disabled={!canSubmit || status === "saving"}
        >
          {status === "saving" ? "Loading..." : "View Your Results"}
        </button>
      </form>
    </div>
  );
}
