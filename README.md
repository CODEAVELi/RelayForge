# RelayForge (Relay Next)

Reliability-first browser relay infrastructure for AI/browser automation.

## Core Promise
**Never lose context. Never silently fail.**

## Quick Start
```bash
cd RelayForge
make setup
make deploy-local
```

Then:
- Chrome: `chrome://extensions` → Load unpacked → `deploy/chrome`
- Firefox: `about:debugging` → Load Temporary Add-on → `deploy/firefox/manifest.json`

## Repository Structure
```text
RelayForge/
├── src/                     # Extension runtime source
│   ├── background/          # ws, queue orchestration, audit, telemetry
│   ├── content/             # in-tab action executor
│   ├── core/                # queue + retry primitives
│   ├── shared/              # constants + policy matching
│   ├── diagnostics.html     # operator diagnostics UI
│   └── diagnostics.js
├── manifests/               # browser manifests
├── tools/                   # build/package tooling
├── scripts/                 # setup, local deploy, release tag helpers
├── dist/                    # built artifacts (generated)
├── deploy/                  # local unpacked deploy targets (generated)
├── release/                 # zip release artifacts (generated)
├── docs/
│   ├── brand/               # logo/visual guidance
│   ├── go-to-market/        # launch plan, copy, beta intake
│   ├── product/             # quickstart script
│   ├── qa/                  # test matrix, benchmark template
│   └── release/             # install + safari packaging docs
└── .github/workflows/       # CI packaging workflow
```

## Build & Release Commands
- `npm run build:chrome`
- `npm run build:firefox`
- `npm run package` (creates release zips)
- `make deploy-local` (build + unzip into deploy folders)
- `./scripts/release-tag.sh vX.Y.Z` (tag and trigger CI packaging)

## Implemented (Sprints 1–4)
- reconnect with backoff + jitter
- persistent queue + in-flight replay
- explicit tab bind + lock lease
- idempotent action dedupe
- telemetry + diagnostics export
- allowlist enforcement + audit log
- crash webhook support
- packaging workflow + GTM docs

## Key Docs
- Install: `docs/release/INSTALL.md`
- Safari: `docs/release/SAFARI_PACKAGING_CHECKLIST.md`
- Brand: `docs/brand/BRAND_GUIDE.md`
- GTM Plan: `docs/go-to-market/GTM_PLAN.md`
- Launch Copy: `docs/go-to-market/LAUNCH_COPY.md`
- QA Matrix: `docs/qa/TEST_MATRIX.md`

## Current Browser Status
- Chrome MV3: ready
- Firefox MV3: ready/scaffolded (validate on target channel)
- Safari: packaging checklist complete, conversion/signing pending
