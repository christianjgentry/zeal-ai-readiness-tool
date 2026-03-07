import { useState, useEffect, Fragment } from "react";
import "./App.css";
import ParticleHeader from "./ParticleHeader";
import Survey from "./Survey";
import SurveyResults from "./SurveyResults";
import { computeCategoryScores, computeOverallPhase } from "./scoring";

const phases = [
  {
    id: 1, tag: "Phase 1", name: "Unstructured Exploration", subtitle: "AI as novelty",
    isStripe: false,
    summary: "Teams experiment with AI tools individually. No shared standards, no system integration. IT has minimal involvement but absent governance creates real risk.",
    requirements: [
      {
        area: "Identity & Access Management",
        level: "Basic SSO",
        detail: "SSO and MFA must be in place before employees adopt cloud AI tools. Without it, tool access is ungoverned and unrevocable.",
        zealService: "SSO & Identity Implementation",
        zealDesc: "Zeal implements SSO and MFA to gate AI tool access centrally \u2014 the access control foundation every subsequent phase depends on.",
        zealTags: ["Okta", "Azure AD", "Auth0"]
      },
      {
        area: "CI/CD",
        level: "None required yet",
        detail: "Automated pipelines are not a dependency at this phase \u2014 but their absence will become a hard blocker at Phase 2.",
        zealService: "CI/CD Readiness Assessment",
        zealDesc: "Zeal assesses your current pipeline maturity and produces a prioritized roadmap for CI/CD implementation before it becomes an urgent gap.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jenkins"]
      },
      {
        area: "Cloud Infrastructure",
        level: "Any",
        detail: "No AI-specific cloud infrastructure needed yet. Existing cloud or on-prem environments can support this phase.",
        zealService: "Cloud Migration Planning",
        zealDesc: "If cloud presence is limited, Zeal can begin a migration assessment now \u2014 avoiding a rushed cloud onboarding when AI integration demands it at Phase 3.",
        zealTags: ["AWS", "Azure", "GCP"]
      },
      {
        area: "Platform Modernity",
        level: "Any",
        detail: "Legacy or modern stacks alike can support this phase. However, older languages and frameworks will limit AI tool value starting at Phase 2.",
        zealService: "Legacy Modernization Assessment",
        zealDesc: "Zeal performs an IT assessment identifying legacy stacks (EOL frameworks, COBOL, Xamarin, .NET Framework) that will limit AI adoption \u2014 producing a roadmap ranked by impact.",
        zealTags: ["C# .NET Core", "Java Spring Boot", "TypeScript", "Python"]
      }
    ],
    blockers: [
      "No AI tool policy \u2014 employees adopt unapproved tools, creating data leakage risk",
      "No SSO \u2014 AI tool access is ungoverned and can\u2019t be revoked centrally",
      "Security team blocks all AI tools without a framework for evaluation"
    ],
    nextStep: "Implement SSO. Establish an AI acceptable use policy. Begin a CI/CD and legacy stack assessment so Phase 2 gaps are known in advance."
  },
  {
    id: 2, tag: "Phase 2", name: "Assisted Workflows", subtitle: "AI accelerates individual work",
    isStripe: false,
    summary: "Teams use AI daily inside individual tools. IT must establish the quality gates and security baseline that all future integration depends on.",
    requirements: [
      {
        area: "CI/CD Pipelines",
        level: "Emerging \u2014 build + lint gates",
        detail: "Automated build and lint checks on every PR. AI-generated code needs at minimum a build gate before merge \u2014 even a basic pipeline catches regressions that manual review misses.",
        zealService: "CI/CD Foundation Build",
        zealDesc: "Zeal stands up GitHub Actions or Azure DevOps pipelines with automated build validation, linting, and basic test gates \u2014 the minimum floor for safe AI-assisted code adoption.",
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
        zealDesc: "Zeal establishes repo standards, branch protection rules, PR templates, and org-wide AI coding tool configuration \u2014 the governance layer for AI-generated code.",
        zealTags: ["GitHub", "GitLab", "Claude Code", "GitHub Copilot"]
      },
      {
        area: "Platform Modernity",
        level: "Modern languages preferred",
        detail: "AI coding assistants work best with Python, TypeScript, C#, Java, Go. Legacy COBOL, VB6, or EOL framework stacks see limited AI coding benefit at this phase.",
        zealService: "Legacy Replatforming \u2014 Initial Track",
        zealDesc: "Zeal identifies and begins targeted replatforming of the highest-value legacy codebases \u2014 modernizing to languages and frameworks where AI coding assistance delivers measurable acceleration.",
        zealTags: ["C# .NET Core/8/9", "Java Spring Boot", "TypeScript", "Python"]
      }
    ],
    blockers: [
      "No CI pipeline \u2014 AI-generated code goes to production without any quality gate",
      "Secrets embedded in code or shared via Slack \u2014 no centralized management",
      "No branch protection \u2014 AI-generated code can be pushed directly without review",
      "Legacy proprietary language stacks limit AI coding tool value"
    ],
    nextStep: "Stand up a CI pipeline with build and lint gates. Implement secrets management. Begin replatforming the highest-value legacy codebases. Document internal APIs in preparation for Phase 3."
  },
  {
    id: 3, tag: "Phase 3", name: "Integrated Automation", subtitle: "AI embedded in systems",
    isStripe: false,
    summary: "AI connects to internal tools via APIs and runs pipelines with minimal human intervention. IT must have containerized infrastructure, internal API endpoints, and automated test coverage in place.",
    requirements: [
      {
        area: "Automated Testing Frameworks",
        level: "Functional \u2014 unit + integration tests",
        detail: "Automated unit and integration tests must run on every PR. AI-generated code merging without test gates creates compounding technical debt that becomes very expensive to unwind.",
        zealService: "Automated Testing Framework Buildout",
        zealDesc: "Zeal writes the foundational unit and integration test suites your codebase is missing \u2014 the quality gate that makes AI-generated code safe to merge without manual review of every line.",
        zealTags: ["xUnit", "Jest", "Pytest", "GitHub Actions", "C#", "TypeScript", "Python"]
      },
      {
        area: "Internal API Endpoints",
        level: "Core systems must expose APIs",
        detail: "If internal systems don\u2019t expose APIs, AI pipelines have nothing to call. REST or GraphQL endpoints for ticketing, CRM, and docs are the minimum integration surface.",
        zealService: "API Endpoint Development",
        zealDesc: "Zeal builds clean, documented REST and GraphQL API endpoints over internal systems \u2014 and where legacy systems can\u2019t be modified, builds lightweight API facades and integration middleware.",
        zealTags: ["Node.js", "Express.js", "AWS Lambda", "Azure Functions", "REST", "GraphQL"]
      },
      {
        area: "Cloud Infrastructure & Containerization",
        level: "Cloud-native or hybrid",
        detail: "Containerized workloads (Docker/Kubernetes) are required. AI automation pipelines need reliable, isolated compute \u2014 shared dev servers are not sufficient.",
        zealService: "Cloud Migration & Containerization",
        zealDesc: "Zeal migrates key workloads to cloud and containerizes them with Docker and Kubernetes \u2014 enabling the isolated, scalable, repeatable execution environments AI pipelines require.",
        zealTags: ["Docker", "Kubernetes (AKS)", "AWS ECS Fargate", "Terraform", "Ansible"]
      },
      {
        area: "CI/CD \u2014 Enforced Gates",
        level: "Required checks before merge",
        detail: "Branch protection must require CI to pass before merge. Automated tests and build checks can\u2019t be optional bypasses \u2014 every AI-generated PR must clear the gate.",
        zealService: "CI/CD Pipeline Hardening",
        zealDesc: "Zeal hardens existing pipelines with enforced branch protection, required status checks, coverage thresholds, and automated deployment gates \u2014 ensuring AI-generated code meets standards before merge.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jenkins", "Docker", "Terraform"]
      },
      {
        area: "Legacy Modernization",
        level: "API-accessible systems required",
        detail: "Legacy monoliths without API layers are a hard blocker. Closed internal systems need API wrappers or middleware before AI can integrate with them.",
        zealService: "Legacy Modernization \u2014 API Enablement",
        zealDesc: "Zeal leads targeted modernization of legacy systems blocking AI integration \u2014 decomposing monoliths, building API facades, and upgrading EOL frameworks \u2014 scoped to clear AI integration paths first.",
        zealTags: ["C# .NET Core", "Java Spring Boot", "TypeScript", "Microservices", "Docker"]
      }
    ],
    blockers: [
      "Core internal systems expose no APIs \u2014 AI pipelines have nothing to call",
      "No automated test suite \u2014 AI-generated changes can\u2019t be validated safely",
      "No container infrastructure \u2014 AI pipelines can\u2019t be isolated or scaled",
      "Monolithic deploy process prevents scoped, safe automation",
      "CI gates are optional \u2014 engineers bypass them, defeating the quality harness"
    ],
    nextStep: "Build automated test coverage. Develop API endpoints for core internal systems. Containerize key workloads. Harden CI gates as required checks. Begin Phase 4 data infrastructure planning."
  },
  {
    id: 4, tag: "Phase 4", name: "Contextual Intelligence", subtitle: "AI that knows your business",
    isStripe: false,
    summary: "AI connects to internal knowledge \u2014 docs, tickets, codebases, data. Outputs become company-specific. IT must own the retrieval infrastructure, MCP layer, and observability stack.",
    requirements: [
      {
        area: "MCP Server \u2014 Prototype",
        level: "Initial MCP tool surface",
        detail: "A Model Context Protocol server exposes internal tools to AI agents in a governed, access-controlled way. Even 5\u201310 tools (ticket search, doc retrieval, code search) transforms output quality.",
        zealService: "MCP Server Development",
        zealDesc: "Zeal builds your first internal MCP server \u2014 exposing core internal tools to AI agents with access controls, audit logging, and tool definitions detailed enough for agents to self-select correctly.",
        zealTags: ["MCP Protocol", "Node.js", "Python", "REST APIs", "Claude Code"]
      },
      {
        area: "Agentic Workflow Development",
        level: "Initial retrieval workflows",
        detail: "Retrieval-augmented workflows where AI pulls internal context before generating output. Agents need structured pipelines, not ad-hoc prompts, to produce consistent company-specific results.",
        zealService: "Agentic Workflow Development",
        zealDesc: "Zeal designs and builds your first agentic workflows \u2014 retrieval pipelines, context enrichment, tool-calling chains, and human-in-the-loop approval gates \u2014 turning ad-hoc AI use into governed, repeatable processes.",
        zealTags: ["Claude Code", "OpenAI GPT-4o", "Python", "Node.js", "Pinecone", "pgvector"]
      },
      {
        area: "Cloud Data Infrastructure",
        level: "Cloud-accessible, structured data",
        detail: "Internal data must be in cloud-accessible, queryable form. On-premise databases locked behind firewalls can\u2019t feed AI retrieval pipelines. Vector database infrastructure required for semantic search.",
        zealService: "Cloud Data Migration & Vector DB Setup",
        zealDesc: "Zeal migrates on-premise databases to cloud and stands up vector database infrastructure \u2014 enabling AI pipelines to retrieve semantically relevant internal context at query time.",
        zealTags: ["Snowflake", "AWS Redshift", "Pinecone", "pgvector", "PostgreSQL", "Azure Data Factory"]
      },
      {
        area: "CI/CD \u2014 Coverage Thresholds",
        level: "Enforced coverage minimums",
        detail: "Test coverage thresholds must be enforced at the pipeline level. AI-generated code cannot merge without meeting minimums. Flaky tests must be eliminated \u2014 they erode trust in the gate.",
        zealService: "CI/CD Coverage Enforcement",
        zealDesc: "Zeal configures coverage threshold gates in CI pipelines and leads a flaky test elimination sprint \u2014 so the test suite is a trustworthy signal, not a noise source.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jest", "xUnit", "Pytest", "Coverlet"]
      },
      {
        area: "Observability",
        level: "Logging, tracing, metrics",
        detail: "Without observability, you can\u2019t see what context AI is retrieving, why outputs vary, or where pipelines fail. Structured logs and distributed tracing are required before scaling agentic workflows.",
        zealService: "Observability Stack Implementation",
        zealDesc: "Zeal implements end-to-end observability \u2014 structured logging, distributed tracing, and metrics dashboards \u2014 giving you visibility into AI pipeline behavior, retrieval quality, and output anomalies.",
        zealTags: ["OpenTelemetry", "AWS CloudWatch", "Azure Monitor", "Datadog"]
      }
    ],
    blockers: [
      "No MCP server \u2014 AI agents have no governed access to internal tools or data",
      "Internal data is on-premise and inaccessible to cloud AI pipelines",
      "No vector database \u2014 semantic retrieval over internal docs is not possible",
      "No observability \u2014 can\u2019t debug why AI output quality varies",
      "Flaky or absent test coverage \u2014 AI code changes can\u2019t be validated at scale"
    ],
    nextStep: "Build your first MCP server. Deploy vector DB infrastructure. Migrate key data to cloud. Implement observability. Enforce test coverage thresholds in CI."
  },
  {
    id: 5, tag: "Phase 5", name: "Supervised Agentic Tasks", subtitle: "AI acts, humans approve",
    isStripe: false,
    summary: "AI agents execute multi-step tasks end-to-end inside isolated environments. IT owns the execution infrastructure, MCP tool surface, CI self-healing, and safety harness.",
    requirements: [
      {
        area: "Agent Execution Infrastructure",
        level: "Ephemeral isolated environments",
        detail: "Per-task sandboxed containers or devboxes that spin up and tear down per agent run. Agents must never share state or access production systems directly.",
        zealService: "Agent Execution Infrastructure Build",
        zealDesc: "Zeal builds your isolated container-per-task execution model \u2014 ephemeral, pre-warmed, network-restricted, and audit-logged. Each agent run gets its own environment and leaves no shared state.",
        zealTags: ["Docker", "Kubernetes (AKS)", "AWS ECS Fargate", "Terraform", "GitHub Actions"]
      },
      {
        area: "MCP Server \u2014 Production",
        level: "Curated tool surface per task type",
        detail: "MCP server must be production-grade with deliberate per-task tool subsets, versioning, and usage telemetry. Agents should not have access to all tools for all tasks \u2014 scope matters.",
        zealService: "MCP Server \u2014 Production Hardening",
        zealDesc: "Zeal expands your MCP server from prototype to production \u2014 adding tool versioning, per-task subsets, usage telemetry, access controls, and the operational rigor of a maintained internal product.",
        zealTags: ["MCP Protocol", "Node.js", "Python", "REST APIs", "Claude Code"]
      },
      {
        area: "Agentic Workflow Development",
        level: "Multi-step end-to-end agent tasks",
        detail: "Agents must execute write + test + propose or research + summarize + draft workflows without back-and-forth. Workflow definitions, retry logic, and human approval gates must be explicitly designed.",
        zealService: "Agentic Workflow Development \u2014 Advanced",
        zealDesc: "Zeal designs and builds multi-step agentic workflows with retry logic, circuit breakers, human-in-the-loop approval gates, and structured output contracts \u2014 turning agent execution into reliable, repeatable delivery.",
        zealTags: ["Claude Code", "OpenAI GPT-4o", "Python", "Node.js", "GitHub Actions"]
      },
      {
        area: "CI/CD \u2014 Machine-Readable Output",
        level: "Self-healing capable pipelines",
        detail: "Agents must be able to read CI failures and self-correct. Pipelines need structured, machine-parseable output \u2014 typed exit codes, annotated failure summaries \u2014 not only human-readable error messages.",
        zealService: "CI/CD Machine-Readability Upgrade",
        zealDesc: "Zeal refactors CI pipelines to emit structured JSON logs, typed exit codes, and annotated failure summaries \u2014 enabling agents to parse failures, identify root causes, and retry within guardrails autonomously.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jenkins", "Docker"]
      },
      {
        area: "Legacy Modernization \u2014 Agent Paths",
        level: "Fully modern in agent execution paths",
        detail: "Legacy monoliths, undocumented APIs, and manual deploy processes are hard blockers for agent operation. Anything an agent touches must have APIs, automated tests, and observable deployments.",
        zealService: "Targeted Legacy Modernization for Agent Enablement",
        zealDesc: "Zeal leads surgical modernization of the specific legacy systems in agent execution paths \u2014 API wrappers, strangler-fig migrations, EOL framework upgrades \u2014 scoped to unblock agent operation, not boil the ocean.",
        zealTags: ["C# .NET Core/8/9", "Java Spring Boot", "TypeScript", "Microservices", "Docker"]
      },
      {
        area: "Automated Testing \u2014 Agent-Generated Code",
        level: "High coverage, near-zero flakiness",
        detail: "Agents produce code at high volume. Test suites must be comprehensive enough to catch regressions automatically \u2014 human review of every agent PR is not scalable.",
        zealService: "Automated Testing Framework Expansion",
        zealDesc: "Zeal expands test coverage to handle high-volume agent-generated PRs \u2014 adding end-to-end tests, contract tests, and automated regression detection so human reviewers focus on logic, not correctness.",
        zealTags: ["Jest", "xUnit", "Pytest", "Playwright", "GitHub Actions"]
      }
    ],
    blockers: [
      "No isolated execution environments \u2014 agents run against shared or production infrastructure",
      "CI output is human-readable only \u2014 agents can\u2019t parse failures to self-correct",
      "MCP server is prototype quality \u2014 agents make poor tool selections, output degrades",
      "Legacy systems in agent execution paths \u2014 no APIs, no observability, no automation hooks",
      "Insufficient test coverage \u2014 agent-generated code volume overwhelms manual review capacity",
      "No circuit breakers \u2014 runaway agents consume unbounded resources or make destructive changes"
    ],
    nextStep: "Stand up ephemeral isolated agent environments. Harden MCP server to production. Upgrade CI for machine-readable output. Expand test coverage for agent PR volume. Clear legacy blockers in agent execution paths."
  },
  {
    id: 6, tag: "Phase 6", name: "Autonomous at Scale", subtitle: "The Stripe Minions model",
    isStripe: true,
    summary: "Agent fleets run in parallel and continuously. Engineers invoke agents like coworkers. IT operates a mature agent platform as a product \u2014 the infrastructure is the competitive moat.",
    requirements: [
      {
        area: "Fleet-Scale Agent Infrastructure",
        level: "Pre-warmed, auto-scaling devbox pools",
        detail: "Hundreds of parallel isolated environments spinning up in seconds. Auto-scaling, auto-teardown, per-run audit logging. Agent fleet throughput is only as high as infrastructure can support.",
        zealService: "Agent Fleet Infrastructure Architecture",
        zealDesc: "Zeal architects and builds pre-warmed devbox pools with auto-scaling, auto-teardown, and per-run audit logging \u2014 the compute layer that makes parallel agent fleet operation possible.",
        zealTags: ["Docker", "Kubernetes (AKS)", "AWS ECS Fargate", "Terraform", "GitHub Actions"]
      },
      {
        area: "MCP Toolshed \u2014 Full Scale",
        level: "400+ curated internal tools",
        detail: "A central MCP Toolshed exposing all internal tools with per-task curated subsets. Tool definitions maintained as a product \u2014 versioned, documented, tested. Quality of tools directly determines quality of agent output.",
        zealService: "MCP Toolshed \u2014 Full Build-Out & Ownership",
        zealDesc: "Zeal builds and maintains your internal Toolshed as a living product \u2014 full tool surface exposure, per-task subsets, version management, usage metering, and continuous quality improvement cadence.",
        zealTags: ["MCP Protocol", "Node.js", "Python", "REST APIs", "Claude Code", "Pinecone", "Snowflake"]
      },
      {
        area: "Agentic Workflow Development \u2014 Fleet Scale",
        level: "Parallel fleet workflows",
        detail: "Engineers invoke multiple agents simultaneously as standard practice. Workflows must handle parallelism, resource contention, and conflicting changes gracefully.",
        zealService: "Fleet-Scale Agentic Workflow Development",
        zealDesc: "Zeal designs and builds fleet-scale agentic workflows \u2014 parallel execution patterns, conflict resolution, resource quotas, and coordinated multi-agent task assignment.",
        zealTags: ["Claude Code", "OpenAI GPT-4o", "Python", "Node.js", "Kafka", "GitHub Actions"]
      },
      {
        area: "CI/CD \u2014 High-Throughput & Self-Healing",
        level: "Hundreds of concurrent agent PRs",
        detail: "CI must handle the concurrent load generated by parallel agent fleets. Self-healing on common failure patterns. Flaky test rate near zero \u2014 each flaky test multiplies across hundreds of agent PRs.",
        zealService: "CI/CD Fleet-Scale Architecture",
        zealDesc: "Zeal re-architects CI/CD for high-concurrency agent workloads \u2014 distributed runners, intelligent test selection, parallel execution sharding, and fleet-aware queue management that scales with agent volume.",
        zealTags: ["GitHub Actions", "GitLab CI", "Jenkins", "Kubernetes (AKS)", "Docker", "Terraform"]
      },
      {
        area: "Legacy Modernization \u2014 Complete",
        level: "Zero legacy debt in agent paths",
        detail: "Any legacy system in the agent execution path becomes a fleet-wide blocker. Everything agents touch must have APIs, observability, automated tests, and modern deployment pipelines.",
        zealService: "Full Legacy Modernization Program",
        zealDesc: "Zeal leads end-to-end modernization of all remaining legacy systems in agent paths \u2014 comprehensive replatforming, monolith decomposition, mobile platform modernization (.NET MAUI), and agent-ready handoff.",
        zealTags: ["C# .NET Core/8/9", "Java Spring Boot", "TypeScript", "React", ".NET MAUI", "Microservices", "Docker", "Kubernetes"]
      },
      {
        area: "Automated Testing \u2014 Fleet Volume",
        level: "Near-zero flakiness, full coverage",
        detail: "Test suite must handle hundreds of concurrent agent PRs reliably. Intelligent test selection, parallelization, and near-zero flakiness are not optional \u2014 they directly gate fleet throughput.",
        zealService: "Testing Infrastructure at Fleet Scale",
        zealDesc: "Zeal implements intelligent test selection, parallelized execution, and automated flaky test detection \u2014 making the test suite a high-throughput, trustworthy gate for fleet-volume agent PRs.",
        zealTags: ["Jest", "xUnit", "Pytest", "Playwright", "GitHub Actions", "Kubernetes"]
      }
    ],
    blockers: [
      "Any legacy system in agent execution path becomes a full fleet blocker",
      "CI cannot handle concurrent load from parallel agent PRs \u2014 throughput collapses",
      "MCP tooling not maintained as a product \u2014 tool quality degrades, agent output degrades",
      "No dedicated DevEx/Leverage team \u2014 platform drifts without active ownership",
      "Flaky tests multiply across agent PR volume \u2014 CI signal becomes noise",
      "Observability gaps mean fleet failures are invisible until they\u2019re catastrophic"
    ],
    nextStep: "Maintain the platform as a product with dedicated ownership. Continuously expand MCP tool surface. Eliminate every remaining legacy system in agent paths. Zeal can embed a team to own this ongoing."
  }
];


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

export default function App() {
  const [active, setActive] = useState(null);

  const [view, setView] = useState("framework"); // "framework" | "survey" | "results"
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const sel = active !== null ? phases[active] : null;

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (stored) {
        if (stored.answers) setAnswers(stored.answers);
        if (stored.results) setResults(stored.results);
      }
    } catch {}
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
    setView("results");
  };

  const handleRetake = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAnswers({});
    setResults(null);
    setView("survey");
  };

  const handleViewResults = () => {
    setView("results");
  };

  const handleExplorePhase = (idx) => {
    handlePhase(idx);
  };

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
        ) : view === "results" && results ? (
          <SurveyResults
            results={results}
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
