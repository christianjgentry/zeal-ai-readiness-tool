import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    onLogin();
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-eyebrow">Zeal Admin</div>
          <h2 className="admin-login-title">Sign In</h2>
        </div>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label className="save-modal-label">
            Email
            <input
              type="email"
              className="save-modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@zeal.com"
              autoComplete="email"
            />
          </label>
          <label className="save-modal-label">
            Password
            <input
              type="password"
              className="save-modal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
            />
          </label>
          {error && <div className="save-modal-error">{error}</div>}
          <button
            type="submit"
            className="save-modal-btn save-modal-btn-primary"
            disabled={loading || !email || !password}
            style={{ width: "100%" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
