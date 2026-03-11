import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const PAGE_SIZE = 20;

const phaseNames = [
  "Unstructured Exploration",
  "Assisted Workflows",
  "Integrated Automation",
  "Contextual Intelligence",
  "Supervised Agentic Tasks",
  "Autonomous at Scale",
];

export default function AdminDashboard({ onLogout }) {
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [selected, setSelected] = useState(null);

  // Stats
  const [stats, setStats] = useState({ total: 0, avgPhase: 0, thisWeek: 0 });

  useEffect(() => {
    async function loadStats() {
      const { data: allRows } = await supabase
        .from("submissions")
        .select("phase, completed_at")
        .limit(10000);

      const rows = allRows || [];
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const thisWeek = rows.filter((r) => new Date(r.completed_at).getTime() > weekAgo).length;
      const avgPhase = rows.length > 0
        ? rows.reduce((s, r) => s + r.phase, 0) / rows.length
        : 0;

      setStats({
        total: rows.length,
        avgPhase: Math.round(avgPhase * 10) / 10,
        thisWeek,
      });
    }
    loadStats();
  }, []);

  useEffect(() => {
    async function loadSubmissions() {
      setLoading(true);
      let query = supabase
        .from("submissions")
        .select("*", { count: "exact" })
        .order("completed_at", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (search.trim()) {
        query = query.or(`company.ilike.%${search.trim()}%,name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`);
      }
      if (phaseFilter) {
        query = query.eq("phase", parseInt(phaseFilter));
      }

      const { data, count } = await query;
      setSubmissions(data || []);
      setTotal(count || 0);
      setLoading(false);
    }
    loadSubmissions();
  }, [page, search, phaseFilter]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  if (selected) {
    return (
      <div className="admin">
        <div className="admin-header">
          <button className="admin-back-btn" onClick={() => setSelected(null)}>&larr; Back</button>
          <button className="admin-logout-btn" onClick={onLogout}>Logout</button>
        </div>
        <div className="admin-detail">
          <div className="admin-detail-header">
            <h2 className="admin-detail-name">{selected.name}</h2>
            <div className="admin-detail-meta">
              {selected.email} &bull; {selected.company} &bull; {formatDate(selected.completed_at)}
            </div>
          </div>

          <div className="admin-detail-phase-box">
            <div className="admin-detail-phase-num">{selected.phase}</div>
            <div>
              <div className="admin-detail-phase-label">Phase {selected.phase}: {phaseNames[selected.phase - 1]}</div>
              <div className="admin-detail-avg">Average: {selected.average} / 6</div>
              {selected.weakest_category && (
                <div className="admin-detail-weakest">Weakest: {selected.weakest_category}</div>
              )}
            </div>
          </div>

          <div className="admin-detail-section">
            <div className="admin-detail-section-title">Category Scores</div>
            {selected.results?.categoryScores?.map((cat) => (
              <div key={cat.categoryId} className="admin-detail-score-row">
                <span className="admin-detail-score-label">{cat.categoryName}</span>
                <span className="admin-detail-score-value">{cat.score} / 6</span>
              </div>
            ))}
          </div>

          <div className="admin-detail-section">
            <div className="admin-detail-section-title">Individual Answers</div>
            <pre className="admin-detail-answers">{JSON.stringify(selected.answers, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-header">
        <div>
          <div className="admin-header-eyebrow">Zeal Admin</div>
          <h1 className="admin-header-title">Submissions Dashboard</h1>
        </div>
        <button className="admin-logout-btn" onClick={onLogout}>Logout</button>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.total}</div>
          <div className="admin-stat-label">Total Submissions</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.avgPhase}</div>
          <div className="admin-stat-label">Average Phase</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.thisWeek}</div>
          <div className="admin-stat-label">This Week</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <input
          type="text"
          className="save-modal-input admin-search-input"
          placeholder="Search by name, email, or company..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
        <select
          className="admin-phase-select"
          value={phaseFilter}
          onChange={(e) => { setPhaseFilter(e.target.value); setPage(0); }}
        >
          <option value="">All Phases</option>
          {[1, 2, 3, 4, 5, 6].map((p) => (
            <option key={p} value={p}>Phase {p}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="admin-loading">Loading submissions...</div>
      ) : submissions.length === 0 ? (
        <div className="admin-empty">No submissions found.</div>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Phase</th>
                  <th>Average</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} onClick={() => setSelected(sub)} className="admin-table-row">
                    <td>{sub.name}</td>
                    <td>{sub.email}</td>
                    <td>{sub.company}</td>
                    <td>
                      <span className="admin-phase-badge">Phase {sub.phase}</span>
                    </td>
                    <td>{sub.average}</td>
                    <td>{formatDate(sub.completed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="admin-pagination">
              <button
                className="admin-page-btn"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className="admin-page-info">
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="admin-page-btn"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
