# Relay Next — Go-To-Market Plan (Beta)

## Positioning
**Category:** Reliable browser relay infrastructure for AI/browser automation.

**Core promise:**
"Never lose context. Never silently fail."

**Target users (initial):**
1. Power users running AI browser agents daily
2. Automation builders (OpenClaw, Playwright-adjacent users)
3. Teams blocked by flaky relay behavior and tab drift

## Messaging
### One-liner
Relay Next is a reliability-first browser relay that keeps automation actions deterministic across disconnects, tab changes, and browser restarts.

### Differentiators
- Persistent queue + in-flight replay
- Idempotent action dedupe
- Explicit tab binding + lock lease
- Allowlist safety + audit trail
- Diagnostics-first operation

## Packaging
- Free public beta (Chrome + Firefox)
- Early-access Discord channel for issue triage
- Weekly release cadence (stability + telemetry improvements)

## Launch sequence (14 days)
### Day 1–2: Brand + proof
- Finalize product name + icon
- Publish benchmark results template + first comparison run
- Record 90-second quickstart video

### Day 3–5: Public assets
- Launch docs page (Install, Quickstart, Troubleshooting)
- Publish release notes for v0.1-beta
- Post comparison chart vs incumbent relay

### Day 6–8: Distribution
- Announce on LinkedIn/X + relevant automation communities
- Reach out to 20 known power users for beta onboarding
- Collect first 10 structured bug reports

### Day 9–11: Conversion loop
- Ship fixes from top 3 reliability issues
- Publish "What we fixed this week"
- Add compatibility matrix updates

### Day 12–14: Beta hardening
- Freeze MVP API surface
- Prepare v0.2-beta package
- Create "public release readiness" checklist

## Pricing hypothesis (post-beta)
- Free tier: single session + limited diagnostics retention
- Pro: full diagnostics, export, advanced policy controls
- Team: centralized policy + shared telemetry dashboard

## KPI dashboard (beta)
1. Weekly active installs
2. Action success rate
3. Median reconnect recovery time
4. Duplicate execution incidents
5. Lost action incidents
6. 7-day retention
7. Time-to-first-successful-action

## Risks + mitigations
- **Risk:** Browser policy changes (MV3 limits)
  - Mitigation: keep core protocol browser-agnostic; maintain Firefox path.
- **Risk:** User trust/security concerns
  - Mitigation: allowlist by default + transparent audit logs.
- **Risk:** Support load from early adopters
  - Mitigation: structured issue template + triage SLA.

## Immediate next actions (this week)
1. Run benchmark pass and publish first numbers
2. Record quickstart video using prepared script
3. Set up beta feedback channel + issue template
4. Ship v0.1-beta release post with install links
