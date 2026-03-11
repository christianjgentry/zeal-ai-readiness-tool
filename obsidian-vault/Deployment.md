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
4. `npm run build`
5. Upload `dist/` as artifact

### Deploy Job
1. Download artifact
2. Deploy to GitHub Pages
3. Set environment: `github-pages`

**Permissions**: `contents: read`, `pages: write`, `id-token: write`
**Concurrency**: Single deployment at a time, cancels in-progress deploys.

## Requirements

- **Node.js**: v22 (specified in workflow)
- **Dependencies**: React 19, Vite 7 (see `package.json`)
- **No backend**: Fully static SPA, no API calls

## Testing Locally

```bash
npm install       # Install dependencies
npm run dev       # Start dev server
# Visit http://localhost:5173/zeal-ai-readiness-tool/
```

Note: The base path means the local dev URL includes the subdirectory.

## GitHub Pages URL

The app is served at: `https://<username>.github.io/zeal-ai-readiness-tool/`
