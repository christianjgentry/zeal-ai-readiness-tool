import { useState } from "react";

const phases = [
  {
    id: 1, tag: "Phase 1", name: "Unstructured Exploration", subtitle: "AI as novelty",
    color: "#94A3B8", icon: "🔍", isStripe: false,
    summary: "Teams experiment with AI tools individually. No shared standards, no system integration. IT has minimal involvement but absent governance creates real risk.",
    requirements: [
      {
        area: "Identity & Access Management",
        level: "Basic SSO",
        detail: "SSO and MFA must be in place before employees adopt cloud AI tools. Without it, tool access is ungoverned and unrevocable.",
        zealService: "SSO & Identity Implementation",
        zealDesc: "Zeal implements SSO and MFA to gate AI tool access centrally — the access control foundation every subsequent phase depends on.",
        zealTags: ["Okta", "Azure AD", "Auth0"]
      },
      {
        area: "CI/CD",
        level: "None required yet",
        detail: "Automated pipelines are not a dependency at this phase — but their absence will become a hard blocker at Phase 2.",
        zealService: "CI/CD Readiness Assessment",
        zealDesc: "Zeal assesses your current pipeline maturity and produces a prioritized roadmap for CI/CD implementation before it becomes an urgent gap.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jenkins"]
      },
      {
        area: "Cloud Infrastructure",
        level: "Any",
        detail: "No AI-specific cloud infrastructure needed yet. Existing cloud or on-prem environments can support this phase.",
        zealService: "Cloud Migration Planning",
        zealDesc: "If cloud presence is limited, Zeal can begin a migration assessment now — avoiding a rushed cloud onboarding when AI integration demands it at Phase 3.",
        zealTags: ["AWS", "Azure", "GCP"]
      },
      {
        area: "Platform Modernity",
        level: "Any",
        detail: "Legacy or modern stacks alike can support this phase. However, older languages and frameworks will limit AI tool value starting at Phase 2.",
        zealService: "Legacy Modernization Assessment",
        zealDesc: "Zeal performs an IT assessment identifying legacy stacks (EOL frameworks, COBOL, Xamarin, .NET Framework) that will limit AI adoption — producing a roadmap ranked by impact.",
        zealTags: ["C# .NET Core", "Java Spring Boot", "TypeScript", "Python"]
      }
    ],
    blockers: [
      "No AI tool policy — employees adopt unapproved tools, creating data leakage risk",
      "No SSO — AI tool access is ungoverned and can't be revoked centrally",
      "Security team blocks all AI tools without a framework for evaluation"
    ],
    nextStep: "Implement SSO. Establish an AI acceptable use policy. Begin a CI/CD and legacy stack assessment so Phase 2 gaps are known in advance."
  },
  {
    id: 2, tag: "Phase 2", name: "Assisted Workflows", subtitle: "AI accelerates individual work",
    color: "#60A5FA", icon: "⚡", isStripe: false,
    summary: "Teams use AI daily inside individual tools. IT must establish the quality gates and security baseline that all future integration depends on.",
    requirements: [
      {
        area: "CI/CD Pipelines",
        level: "Emerging — build + lint gates",
        detail: "Automated build and lint checks on every PR. AI-generated code needs at minimum a build gate before merge — even a basic pipeline catches regressions that manual review misses.",
        zealService: "CI/CD Foundation Build",
        zealDesc: "Zeal stands up GitHub Actions or Azure DevOps pipelines with automated build validation, linting, and basic test gates — the minimum floor for safe AI-assisted code adoption.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jenkins", "Docker"]
      },
      {
        area: "Secrets & API Key Management",
        level: "Managed",
        detail: "API keys and service credentials must be centrally managed and rotated. Keys embedded in code or shared via Slack are a critical vulnerability once AI tools are in use.",
        zealService: "Secrets Management Implementation",
        zealDesc: "Zeal implements centralized secrets management so AI tool credentials, API keys, and service tokens are governed, rotated, and auditable.",
        zealTags: ["HashiCorp Vault", "AWS Secrets Manager", "Azure Key Vault"]
      },
      {
        area: "Dev Tooling Standardization",
        level: "Standardized",
        detail: "GitHub or GitLab org with access controls, branch protection, and org-wide AI coding tool licensing. Shared standards are required before AI output quality can be governed.",
        zealService: "DevOps Standards & Tooling Setup",
        zealDesc: "Zeal establishes repo standards, branch protection rules, PR templates, and org-wide AI coding tool configuration — the governance layer for AI-generated code.",
        zealTags: ["GitHub", "GitLab", "Claude Code", "GitHub Copilot"]
      },
      {
        area: "Platform Modernity",
        level: "Modern languages preferred",
        detail: "AI coding assistants work best with Python, TypeScript, C#, Java, Go. Legacy COBOL, VB6, or EOL framework stacks see limited AI coding benefit at this phase.",
        zealService: "Legacy Replatforming — Initial Track",
        zealDesc: "Zeal identifies and begins targeted replatforming of the highest-value legacy codebases — modernizing to languages and frameworks where AI coding assistance delivers measurable acceleration.",
        zealTags: ["C# .NET Core/8/9", "Java Spring Boot", "TypeScript", "Python"]
      }
    ],
    blockers: [
      "No CI pipeline — AI-generated code goes to production without any quality gate",
      "Secrets embedded in code or shared via Slack — no centralized management",
      "No branch protection — AI-generated code can be pushed directly without review",
      "Legacy proprietary language stacks limit AI coding tool value"
    ],
    nextStep: "Stand up a CI pipeline with build and lint gates. Implement secrets management. Begin replatforming the highest-value legacy codebases. Document internal APIs in preparation for Phase 3."
  },
  {
    id: 3, tag: "Phase 3", name: "Integrated Automation", subtitle: "AI embedded in systems",
    color: "#34D399", icon: "🔗", isStripe: false,
    summary: "AI connects to internal tools via APIs and runs pipelines with minimal human intervention. IT must have containerized infrastructure, internal API endpoints, and automated test coverage in place.",
    requirements: [
      {
        area: "Automated Testing Frameworks",
        level: "Functional — unit + integration tests",
        detail: "Automated unit and integration tests must run on every PR. AI-generated code merging without test gates creates compounding technical debt that becomes very expensive to unwind.",
        zealService: "Automated Testing Framework Buildout",
        zealDesc: "Zeal writes the foundational unit and integration test suites your codebase is missing — the quality gate that makes AI-generated code safe to merge without manual review of every line.",
        zealTags: ["xUnit", "Jest", "Pytest", "GitHub Actions", "C#", "TypeScript", "Python"]
      },
      {
        area: "Internal API Endpoints",
        level: "Core systems must expose APIs",
        detail: "If internal systems don't expose APIs, AI pipelines have nothing to call. REST or GraphQL endpoints for ticketing, CRM, and docs are the minimum integration surface.",
        zealService: "API Endpoint Development",
        zealDesc: "Zeal builds clean, documented REST and GraphQL API endpoints over internal systems — and where legacy systems can't be modified, builds lightweight API facades and integration middleware.",
        zealTags: ["Node.js", "Express.js", "AWS Lambda", "Azure Functions", "REST", "GraphQL"]
      },
      {
        area: "Cloud Infrastructure & Containerization",
        level: "Cloud-native or hybrid",
        detail: "Containerized workloads (Docker/Kubernetes) are required. AI automation pipelines need reliable, isolated compute — shared dev servers are not sufficient.",
        zealService: "Cloud Migration & Containerization",
        zealDesc: "Zeal migrates key workloads to cloud and containerizes them with Docker and Kubernetes — enabling the isolated, scalable, repeatable execution environments AI pipelines require.",
        zealTags: ["Docker", "Kubernetes (AKS)", "AWS ECS Fargate", "Terraform", "Ansible"]
      },
      {
        area: "CI/CD — Enforced Gates",
        level: "Required checks before merge",
        detail: "Branch protection must require CI to pass before merge. Automated tests and build checks can't be optional bypasses — every AI-generated PR must clear the gate.",
        zealService: "CI/CD Pipeline Hardening",
        zealDesc: "Zeal hardens existing pipelines with enforced branch protection, required status checks, coverage thresholds, and automated deployment gates — ensuring AI-generated code meets standards before merge.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jenkins", "Docker", "Terraform"]
      },
      {
        area: "Legacy Modernization",
        level: "API-accessible systems required",
        detail: "Legacy monoliths without API layers are a hard blocker. Closed internal systems need API wrappers or middleware before AI can integrate with them.",
        zealService: "Legacy Modernization — API Enablement",
        zealDesc: "Zeal leads targeted modernization of legacy systems blocking AI integration — decomposing monoliths, building API facades, and upgrading EOL frameworks — scoped to clear AI integration paths first.",
        zealTags: ["C# .NET Core", "Java Spring Boot", "TypeScript", "Microservices", "Docker"]
      }
    ],
    blockers: [
      "Core internal systems expose no APIs — AI pipelines have nothing to call",
      "No automated test suite — AI-generated changes can't be validated safely",
      "No container infrastructure — AI pipelines can't be isolated or scaled",
      "Monolithic deploy process prevents scoped, safe automation",
      "CI gates are optional — engineers bypass them, defeating the quality harness"
    ],
    nextStep: "Build automated test coverage. Develop API endpoints for core internal systems. Containerize key workloads. Harden CI gates as required checks. Begin Phase 4 data infrastructure planning."
  },
  {
    id: 4, tag: "Phase 4", name: "Contextual Intelligence", subtitle: "AI that knows your business",
    color: "#F59E0B", icon: "🧠", isStripe: false,
    summary: "AI connects to internal knowledge — docs, tickets, codebases, data. Outputs become company-specific. IT must own the retrieval infrastructure, MCP layer, and observability stack.",
    requirements: [
      {
        area: "MCP Server — Prototype",
        level: "Initial MCP tool surface",
        detail: "A Model Context Protocol server exposes internal tools to AI agents in a governed, access-controlled way. Even 5\u201310 tools (ticket search, doc retrieval, code search) transforms output quality.",
        zealService: "MCP Server Development",
        zealDesc: "Zeal builds your first internal MCP server — exposing core internal tools to AI agents with access controls, audit logging, and tool definitions detailed enough for agents to self-select correctly.",
        zealTags: ["MCP Protocol", "Node.js", "Python", "REST APIs", "Claude Code"]
      },
      {
        area: "Agentic Workflow Development",
        level: "Initial retrieval workflows",
        detail: "Retrieval-augmented workflows where AI pulls internal context before generating output. Agents need structured pipelines, not ad-hoc prompts, to produce consistent company-specific results.",
        zealService: "Agentic Workflow Development",
        zealDesc: "Zeal designs and builds your first agentic workflows — retrieval pipelines, context enrichment, tool-calling chains, and human-in-the-loop approval gates — turning ad-hoc AI use into governed, repeatable processes.",
        zealTags: ["Claude Code", "OpenAI GPT-4o", "Python", "Node.js", "Pinecone", "pgvector"]
      },
      {
        area: "Cloud Data Infrastructure",
        level: "Cloud-accessible, structured data",
        detail: "Internal data must be in cloud-accessible, queryable form. On-premise databases locked behind firewalls can't feed AI retrieval pipelines. Vector database infrastructure required for semantic search.",
        zealService: "Cloud Data Migration & Vector DB Setup",
        zealDesc: "Zeal migrates on-premise databases to cloud and stands up vector database infrastructure — enabling AI pipelines to retrieve semantically relevant internal context at query time.",
        zealTags: ["Snowflake", "AWS Redshift", "Pinecone", "pgvector", "PostgreSQL", "Azure Data Factory"]
      },
      {
        area: "CI/CD — Coverage Thresholds",
        level: "Enforced coverage minimums",
        detail: "Test coverage thresholds must be enforced at the pipeline level. AI-generated code cannot merge without meeting minimums. Flaky tests must be eliminated — they erode trust in the gate.",
        zealService: "CI/CD Coverage Enforcement",
        zealDesc: "Zeal configures coverage threshold gates in CI pipelines and leads a flaky test elimination sprint — so the test suite is a trustworthy signal, not a noise source.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jest", "xUnit", "Pytest", "Coverlet"]
      },
      {
        area: "Observability",
        level: "Logging, tracing, metrics",
        detail: "Without observability, you can't see what context AI is retrieving, why outputs vary, or where pipelines fail. Structured logs and distributed tracing are required before scaling agentic workflows.",
        zealService: "Observability Stack Implementation",
        zealDesc: "Zeal implements end-to-end observability — structured logging, distributed tracing, and metrics dashboards — giving you visibility into AI pipeline behavior, retrieval quality, and output anomalies.",
        zealTags: ["OpenTelemetry", "AWS CloudWatch", "Azure Monitor", "Datadog"]
      }
    ],
    blockers: [
      "No MCP server — AI agents have no governed access to internal tools or data",
      "Internal data is on-premise and inaccessible to cloud AI pipelines",
      "No vector database — semantic retrieval over internal docs is not possible",
      "No observability — can't debug why AI output quality varies",
      "Flaky or absent test coverage — AI code changes can't be validated at scale"
    ],
    nextStep: "Build your first MCP server. Deploy vector DB infrastructure. Migrate key data to cloud. Implement observability. Enforce test coverage thresholds in CI."
  },
  {
    id: 5, tag: "Phase 5", name: "Supervised Agentic Tasks", subtitle: "AI acts, humans approve",
    color: "#A78BFA", icon: "🤖", isStripe: false,
    summary: "AI agents execute multi-step tasks end-to-end inside isolated environments. IT owns the execution infrastructure, MCP tool surface, CI self-healing, and safety harness.",
    requirements: [
      {
        area: "Agent Execution Infrastructure",
        level: "Ephemeral isolated environments",
        detail: "Per-task sandboxed containers or devboxes that spin up and tear down per agent run. Agents must never share state or access production systems directly.",
        zealService: "Agent Execution Infrastructure Build",
        zealDesc: "Zeal builds your isolated container-per-task execution model — ephemeral, pre-warmed, network-restricted, and audit-logged. Each agent run gets its own environment and leaves no shared state.",
        zealTags: ["Docker", "Kubernetes (AKS)", "AWS ECS Fargate", "Terraform", "GitHub Actions"]
      },
      {
        area: "MCP Server — Production",
        level: "Curated tool surface per task type",
        detail: "MCP server must be production-grade with deliberate per-task tool subsets, versioning, and usage telemetry. Agents should not have access to all tools for all tasks — scope matters.",
        zealService: "MCP Server — Production Hardening",
        zealDesc: "Zeal expands your MCP server from prototype to production — adding tool versioning, per-task subsets, usage telemetry, access controls, and the operational rigor of a maintained internal product.",
        zealTags: ["MCP Protocol", "Node.js", "Python", "REST APIs", "Claude Code"]
      },
      {
        area: "Agentic Workflow Development",
        level: "Multi-step end-to-end agent tasks",
        detail: "Agents must execute write + test + propose or research + summarize + draft workflows without back-and-forth. Workflow definitions, retry logic, and human approval gates must be explicitly designed.",
        zealService: "Agentic Workflow Development — Advanced",
        zealDesc: "Zeal designs and builds multi-step agentic workflows with retry logic, circuit breakers, human-in-the-loop approval gates, and structured output contracts — turning agent execution into reliable, repeatable delivery.",
        zealTags: ["Claude Code", "OpenAI GPT-4o", "Python", "Node.js", "GitHub Actions"]
      },
      {
        area: "CI/CD — Machine-Readable Output",
        level: "Self-healing capable pipelines",
        detail: "Agents must be able to read CI failures and self-correct. Pipelines need structured, machine-parseable output — typed exit codes, annotated failure summaries — not only human-readable error messages.",
        zealService: "CI/CD Machine-Readability Upgrade",
        zealDesc: "Zeal refactors CI pipelines to emit structured JSON logs, typed exit codes, and annotated failure summaries — enabling agents to parse failures, identify root causes, and retry within guardrails autonomously.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jenkins", "Docker"]
      },
      {
        area: "Legacy Modernization — Agent Paths",
        level: "Fully modern in agent execution paths",
        detail: "Legacy monoliths, undocumented APIs, and manual deploy processes are hard blockers for agent operation. Anything an agent touches must have APIs, automated tests, and observable deployments.",
        zealService: "Targeted Legacy Modernization for Agent Enablement",
        zealDesc: "Zeal leads surgical modernization of the specific legacy systems in agent execution paths — API wrappers, strangler-fig migrations, EOL framework upgrades — scoped to unblock agent operation, not boil the ocean.",
        zealTags: ["C# .NET Core/8/9", "Java Spring Boot", "TypeScript", "Microservices", "Docker"]
      },
      {
        area: "Automated Testing — Agent-Generated Code",
        level: "High coverage, near-zero flakiness",
        detail: "Agents produce code at high volume. Test suites must be comprehensive enough to catch regressions automatically — human review of every agent PR is not scalable.",
        zealService: "Automated Testing Framework Expansion",
        zealDesc: "Zeal expands test coverage to handle high-volume agent-generated PRs — adding end-to-end tests, contract tests, and automated regression detection so human reviewers focus on logic, not correctness.",
        zealTags: ["Jest", "xUnit", "Pytest", "Playwright", "GitHub Actions"]
      }
    ],
    blockers: [
      "No isolated execution environments — agents run against shared or production infrastructure",
      "CI output is human-readable only — agents can't parse failures to self-correct",
      "MCP server is prototype quality — agents make poor tool selections, output degrades",
      "Legacy systems in agent execution paths — no APIs, no observability, no automation hooks",
      "Insufficient test coverage — agent-generated code volume overwhelms manual review capacity",
      "No circuit breakers — runaway agents consume unbounded resources or make destructive changes"
    ],
    nextStep: "Stand up ephemeral isolated agent environments. Harden MCP server to production. Upgrade CI for machine-readable output. Expand test coverage for agent PR volume. Clear legacy blockers in agent execution paths."
  },
  {
    id: 6, tag: "Phase 6", name: "Autonomous at Scale", subtitle: "The Stripe Minions model",
    color: "#EF4444", icon: "🚀", isStripe: true,
    summary: "Agent fleets run in parallel and continuously. Engineers invoke agents like coworkers. IT operates a mature agent platform as a product — the infrastructure is the competitive moat.",
    requirements: [
      {
        area: "Fleet-Scale Agent Infrastructure",
        level: "Pre-warmed, auto-scaling devbox pools",
        detail: "Hundreds of parallel isolated environments spinning up in seconds. Auto-scaling, auto-teardown, per-run audit logging. Agent fleet throughput is only as high as infrastructure can support.",
        zealService: "Agent Fleet Infrastructure Architecture",
        zealDesc: "Zeal architects and builds pre-warmed devbox pools with auto-scaling, auto-teardown, and per-run audit logging — the compute layer that makes parallel agent fleet operation possible.",
        zealTags: ["Docker", "Kubernetes (AKS)", "AWS ECS Fargate", "Terraform", "GitHub Actions"]
      },
      {
        area: "MCP Toolshed — Full Scale",
        level: "400+ curated internal tools",
        detail: "A central MCP Toolshed exposing all internal tools with per-task curated subsets. Tool definitions maintained as a product — versioned, documented, tested. Quality of tools directly determines quality of agent output.",
        zealService: "MCP Toolshed — Full Build-Out & Ownership",
        zealDesc: "Zeal builds and maintains your internal Toolshed as a living product — full tool surface exposure, per-task subsets, version management, usage metering, and continuous quality improvement cadence.",
        zealTags: ["MCP Protocol", "Node.js", "Python", "REST APIs", "Claude Code", "Pinecone", "Snowflake"]
      },
      {
        area: "Agentic Workflow Development — Fleet Scale",
        level: "Parallel fleet workflows",
        detail: "Engineers invoke multiple agents simultaneously as standard practice. Workflows must handle parallelism, resource contention, and conflicting changes gracefully.",
        zealService: "Fleet-Scale Agentic Workflow Development",
        zealDesc: "Zeal designs and builds fleet-scale agentic workflows — parallel execution patterns, conflict resolution, resource quotas, and coordinated multi-agent task assignment.",
        zealTags: ["Claude Code", "OpenAI GPT-4o", "Python", "Node.js", "Kafka", "GitHub Actions"]
      },
      {
        area: "CI/CD — High-Throughput & Self-Healing",
        level: "Hundreds of concurrent agent PRs",
        detail: "CI must handle the concurrent load generated by parallel agent fleets. Self-healing on common failure patterns. Flaky test rate near zero — each flaky test multiplies across hundreds of agent PRs.",
        zealService: "CI/CD Fleet-Scale Architecture",
        zealDesc: "Zeal re-architects CI/CD for high-concurrency agent workloads — distributed runners, intelligent test selection, parallel execution sharding, and fleet-aware queue management that scales with agent volume.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jenkins", "Kubernetes (AKS)", "Docker", "Terraform"]
      },
      {
        area: "Legacy Modernization — Complete",
        level: "Zero legacy debt in agent paths",
        detail: "Any legacy system in the agent execution path becomes a fleet-wide blocker. Everything agents touch must have APIs, observability, automated tests, and modern deployment pipelines.",
        zealService: "Full Legacy Modernization Program",
        zealDesc: "Zeal leads end-to-end modernization of all remaining legacy systems in agent paths — comprehensive replatforming, monolith decomposition, mobile platform modernization (.NET MAUI), and agent-ready handoff.",
        zealTags: ["C# .NET Core/8/9", "Java Spring Boot", "TypeScript", "React", ".NET MAUI", "Microservices", "Docker", "Kubernetes"]
      },
      {
        area: "Automated Testing — Fleet Volume",
        level: "Near-zero flakiness, full coverage",
        detail: "Test suite must handle hundreds of concurrent agent PRs reliably. Intelligent test selection, parallelization, and near-zero flakiness are not optional — they directly gate fleet throughput.",
        zealService: "Testing Infrastructure at Fleet Scale",
        zealDesc: "Zeal implements intelligent test selection, parallelized execution, and automated flaky test detection — making the test suite a high-throughput, trustworthy gate for fleet-volume agent PRs.",
        zealTags: ["Jest", "xUnit", "Pytest", "Playwright", "GitHub Actions", "Kubernetes"]
      }
    ],
    blockers: [
      "Any legacy system in agent execution path becomes a full fleet blocker",
      "CI cannot handle concurrent load from parallel agent PRs — throughput collapses",
      "MCP tooling not maintained as a product — tool quality degrades, agent output degrades",
      "No dedicated DevEx/Leverage team — platform drifts without active ownership",
      "Flaky tests multiply across agent PR volume — CI signal becomes noise",
      "Observability gaps mean fleet failures are invisible until they're catastrophic"
    ],
    nextStep: "Maintain the platform as a product with dedicated ownership. Continuously expand MCP tool surface. Eliminate every remaining legacy system in agent paths. Zeal can embed a team to own this ongoing."
  }
];

const TABS = [
  { id: "requirements", label: "\uD83D\uDDA5\uFE0F IT Requirements & Zeal's Role" },
  { id: "next", label: "\u2192 Next Steps" }
];

const levelColors = {
  "None required yet": "#334155",
  "None required": "#334155",
  "Any": "#475569",
  "Basic SSO": "#0EA5E9",
  "Basic cloud presence": "#0EA5E9",
  "Emerging — build + lint gates": "#0EA5E9",
  "Managed": "#0EA5E9",
  "Standardized": "#10B981",
  "Modern languages preferred": "#10B981",
  "Functional — unit + integration tests": "#10B981",
  "Core systems must expose APIs": "#10B981",
  "Cloud-native or hybrid": "#10B981",
  "Required checks before merge": "#10B981",
  "API-accessible systems required": "#10B981",
  "Initial MCP tool surface": "#F59E0B",
  "Initial retrieval workflows": "#F59E0B",
  "Cloud-accessible, structured data": "#F59E0B",
  "Enforced coverage minimums": "#F59E0B",
  "Logging, tracing, metrics": "#F59E0B",
  "Ephemeral isolated environments": "#A78BFA",
  "Curated tool surface per task type": "#A78BFA",
  "Multi-step end-to-end agent tasks": "#A78BFA",
  "Self-healing capable pipelines": "#A78BFA",
  "Fully modern in agent execution paths": "#A78BFA",
  "High coverage, near-zero flakiness": "#A78BFA",
  "Pre-warmed, auto-scaling devbox pools": "#EF4444",
  "400+ curated internal tools": "#EF4444",
  "Parallel fleet workflows": "#EF4444",
  "Hundreds of concurrent agent PRs": "#EF4444",
  "Zero legacy debt in agent paths": "#EF4444",
  "Near-zero flakiness, full coverage": "#EF4444"
};

export default function App() {
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("requirements");
  const [expanded, setExpanded] = useState(null);
  const sel = active !== null ? phases[active] : null;

  const handlePhase = (i) => { setActive(i); setTab("requirements"); setExpanded(null); };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#0F172A", minHeight: "100vh", color: "#F1F5F9" }}>
      <div style={{ background: "linear-gradient(160deg,#1E293B,#0F172A)", borderBottom: "1px solid #1E293B", padding: "28px 32px 20px" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: "#475569", textTransform: "uppercase", marginBottom: 5 }}>Zeal IT Consultants</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 5px", color: "#F1F5F9" }}>Agentic Readiness Framework</h1>
          <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>The IT maturity required at each phase — and how Zeal moves you to the next one.</p>
        </div>
      </div>

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "24px 32px" }}>
        {/* Stripe callout */}
        <div style={{ background: "linear-gradient(135deg,#1C0A0A,#2C1010)", border: "1px solid #7F1D1D", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <span style={{ fontSize: 26, flexShrink: 0 }}>🚀</span>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#FCA5A5", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>The Benchmark: Stripe Minions (Feb 2026)</div>
            <p style={{ margin: 0, color: "#FECACA", fontSize: 12, lineHeight: 1.7 }}>
              Stripe merges <strong>1,000+ AI-written PRs weekly</strong>. What made it possible: 400+ MCP tools, ephemeral devboxes in 10s, self-healing CI, agent rule files across every repo, and a dedicated Leverage team owning the platform full-time. <strong>The model is a commodity. The IT infrastructure is the moat.</strong>
            </p>
          </div>
        </div>

        {/* Phase selector */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 6, marginBottom: 20 }}>
          {phases.map((p, i) => (
            <button key={p.id} onClick={() => handlePhase(i)}
              style={{ background: active === i ? p.color : "#1E293B", border: active === i ? `2px solid ${p.color}` : "2px solid #2D3748", borderRadius: 10, padding: "14px 6px", cursor: "pointer", textAlign: "center", transition: "all 0.2s", transform: active === i ? "translateY(-3px)" : "none", boxShadow: active === i ? `0 8px 20px ${p.color}30` : "none" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{p.icon}</div>
              <div style={{ fontSize: 8, fontWeight: 700, color: active === i ? "rgba(255,255,255,0.6)" : "#475569", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{p.tag}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: active === i ? "#FFF" : "#94A3B8", lineHeight: 1.3 }}>{p.name}</div>
              {p.isStripe && <div style={{ fontSize: 7, background: "rgba(239,68,68,0.25)", color: "#FCA5A5", borderRadius: 3, padding: "1px 4px", marginTop: 4, fontWeight: 800 }}>STRIPE</div>}
            </button>
          ))}
        </div>

        {sel ? (
          <div style={{ background: "#1E293B", borderRadius: 14, border: `1px solid ${sel.color}25`, overflow: "hidden" }}>
            {/* Phase header */}
            <div style={{ background: `linear-gradient(135deg,${sel.color}12,transparent)`, borderBottom: `1px solid ${sel.color}15`, padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 30 }}>{sel.icon}</span>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: sel.color, letterSpacing: 2, textTransform: "uppercase" }}>{sel.tag}</div>
                    <h2 style={{ margin: "2px 0 1px", fontSize: 21, fontWeight: 800, color: "#F1F5F9" }}>{sel.name}</h2>
                    <p style={{ margin: 0, color: "#64748B", fontSize: 12 }}>{sel.subtitle}</p>
                  </div>
                </div>
                {sel.isStripe && <div style={{ background: "#EF4444", borderRadius: 6, padding: "5px 12px", fontSize: 10, fontWeight: 800, color: "#FFF" }}>🎯 STRIPE IS HERE</div>}
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#94A3B8" }}>{sel.summary}</p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #283444", padding: "0 24px" }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "11px 14px", fontSize: 12, fontWeight: 600, color: tab === t.id ? sel.color : "#475569", borderBottom: tab === t.id ? `2px solid ${sel.color}` : "2px solid transparent", transition: "all 0.2s", marginBottom: -1, whiteSpace: "nowrap" }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div style={{ padding: "20px 24px" }}>
              {tab === "requirements" && (
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: sel.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>IT Requirements — click any area to see how Zeal helps</div>
                  <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
                    {sel.requirements.map((req, i) => {
                      const isOpen = expanded === i;
                      const lc = levelColors[req.level] || "#64748B";
                      return (
                        <div key={i} style={{ background: "#0F172A", borderRadius: 10, overflow: "hidden", border: isOpen ? `1px solid ${sel.color}40` : "1px solid #1E293B", transition: "all 0.2s" }}>
                          <button onClick={() => setExpanded(isOpen ? null : i)}
                            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "13px 16px", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                            <div style={{ flexShrink: 0, width: 170 }}>
                              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#CBD5E1", marginBottom: 5 }}>{req.area}</div>
                              <div style={{ fontSize: 9, fontWeight: 700, color: lc, background: `${lc}18`, border: `1px solid ${lc}30`, borderRadius: 4, padding: "2px 7px", display: "inline-block" }}>{req.level}</div>
                            </div>
                            <div style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.5, flex: 1 }}>{req.detail}</div>
                            <div style={{ flexShrink: 0, fontSize: 16, color: isOpen ? sel.color : "#475569", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none" }}>{"›"}</div>
                          </button>
                          {isOpen && (
                            <div style={{ borderTop: `1px solid ${sel.color}20`, padding: "14px 16px 14px 200px", background: `${sel.color}06` }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: sel.color, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>⚡ {req.zealService}</div>
                              <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "#CBD5E1", lineHeight: 1.7 }}>{req.zealDesc}</p>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                {req.zealTags.map((t, j) => (
                                  <span key={j} style={{ fontSize: 9.5, background: "#1E293B", color: "#64748B", borderRadius: 4, padding: "2px 8px", border: "1px solid #334155" }}>{t}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Blockers */}
                  <div style={{ borderTop: "1px solid #283444", paddingTop: 20 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#EF4444", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>🚧 IT Gaps That Block This Phase</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      {sel.blockers.map((b, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 14px", background: "#0F172A", borderRadius: 8, borderLeft: "3px solid #EF4444" }}>
                          <span style={{ color: "#EF4444", fontSize: 13, flexShrink: 0, fontWeight: 700, lineHeight: 1.4 }}>{"✗"}</span>
                          <span style={{ fontSize: 12.5, color: "#CBD5E1", lineHeight: 1.6 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === "next" && (
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: sel.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                    {sel.isStripe ? "Sustaining Excellence" : "IT Priorities to Advance to the Next Phase"}
                  </div>
                  <div style={{ background: `linear-gradient(135deg,${sel.color}10,${sel.color}03)`, border: `1px solid ${sel.color}18`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: "#E2E8F0" }}>{sel.nextStep}</p>
                  </div>
                  {!sel.isStripe && active < phases.length - 1 && (
                    <button onClick={() => handlePhase(active + 1)}
                      style={{ background: phases[active + 1].color, border: "none", borderRadius: 8, padding: "9px 18px", color: "#FFF", fontWeight: 700, cursor: "pointer", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 7 }}>
                      Explore {phases[active + 1].tag}: {phases[active + 1].name} {phases[active + 1].icon}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>☝️</div>
            <p style={{ fontSize: 13.5, color: "#475569" }}>Select a phase to see the IT maturity it requires, what blocks it, and exactly how Zeal helps you advance.</p>
          </div>
        )}

        {/* Spectrum */}
        <div style={{ marginTop: 20, background: "#1E293B", borderRadius: 11, padding: "16px 20px", border: "1px solid #283444" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", letterSpacing: 2, textTransform: "uppercase", marginBottom: 9 }}>IT Readiness Spectrum</div>
          <div style={{ display: "flex", height: 6, borderRadius: 6, overflow: "hidden", gap: 2 }}>
            {phases.map((p, i) => (
              <div key={p.id} style={{ flex: 1, background: p.color, borderRadius: 6, opacity: active !== null && active >= i ? 1 : 0.1, transition: "opacity 0.4s" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 9.5, color: "#334155" }}>No IT Integration Required</span>
            <span style={{ fontSize: 9.5, color: "#EF4444", fontWeight: 700 }}>Fleet-Scale Agent Infrastructure 🚀</span>
          </div>
        </div>

        <div style={{ marginTop: 12, textAlign: "center", fontSize: 10, color: "#293444" }}>
          Inspired by Stripe Minions — 1,000+ AI-written PRs/week (Feb 2026) • Zeal IT Consultants Agentic Readiness Framework
        </div>
      </div>
    </div>
  );
}
