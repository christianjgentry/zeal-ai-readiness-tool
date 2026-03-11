---
tags:
  - deployment
---

# Deployment

## Build Commands

```bash
npm run dev      # Vite dev server with HMR (http://localhost:5173)
npm run build    # Production build → /dist
npm run lint     # ESLint check
npm run preview  # Preview production build locally
```

## Vite Configuration

`vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/zeal-ai-readiness-tool/',  // GitHub Pages subdirectory
})
```

The `base` path is critical — all asset URLs are prefixed with this path for GitHub Pages.

## GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`
**Trigger**: Push to `main` branch

### Build Job
1. Checkout code
2. Setup Node.js v22
3. `npm ci` (clean install)
4. `npm run build` — with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` injected from GitHub secrets
5. Upload `dist/` as artifact

### Deploy Job
1. Download artifact
2. Deploy to GitHub Pages
3. Set environment: `github-pages`

**Permissions**: `contents: read`, `pages: write`, `id-token: write`
**Concurrency**: Single deployment at a time, cancels in-progress deploys.

**GitHub Secrets Required**:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon/public API key

## Requirements

- **Node.js**: v22 (specified in workflow)
- **Dependencies**: React 19, Vite 7, @supabase/supabase-js, jspdf (see `package.json`)
- **Backend**: Supabase (hosted Postgres + Auth). App degrades gracefully if Supabase env vars are missing.

## Environment Variables

| Variable | Purpose | Where |
|----------|---------|-------|
| `VITE_SUPABASE_URL` | Supabase project URL | `.env.local` (local), GitHub secret (CI) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key | `.env.local` (local), GitHub secret (CI) |

See `.env.example` for template. `.env.local` is gitignored via `*.local`.

## Supabase

**Project**: `zeal-ai-readiness-tool` (ref: `pawundluxrjvjjiwbcha`)
**Local config**: `supabase/` directory (initialized with `supabase init`, linked with `supabase link`)
**Migrations**: `supabase/migrations/` — push with `supabase db push`
**Admin user**: Created via Supabase Auth Admin API

## Testing Locally

```bash
npm install       # Install dependencies
npm run dev       # Start dev server
# Visit http://localhost:5173/zeal-ai-readiness-tool/
```

Note: The base path means the local dev URL includes the subdirectory.

## GitHub Pages URL

The app is served at: `https://<username>.github.io/zeal-ai-readiness-tool/`
