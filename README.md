# Vollmacht website

Private, unpublished website development. Astro generates static HTML from shared layouts and Markdown. No client JavaScript, analytics, external fonts, authentication or live approvals.

## Run locally

Use Node 26.5.1 (see .node-version), npm and Python 3.12 or later.

1. Run `npm ci` to install locked dependencies with lifecycle scripts disabled.
2. Run `npm run build` to generate dist. Build telemetry is disabled.
3. Run `npm run preview` and open http://127.0.0.1:4173.
4. Stop with Ctrl+C.

The loopback-only preview serves an explicit allowlist of generated assets. Repository metadata and source files are not served. Rebuild after editing. Package scripts target macOS and Linux.

## Checks

- `npm test`: static build and Python structural/server regressions.
- `npx playwright install chromium`: one-time test browser installation.
- `npm run test:browser`: all six pages at 320, 390, 768 and 1440 pixels, axe accessibility rules, keyboard skip link and internal links/fragments.
- `npm run check:external`: bounded external requests with a source-host allowlist, no credentials and per-hop redirect validation. Network failures fail this separate CI job. External fragments are not checked.
- `npm audit`: current known dependency advisories, not a security certification.

Browser checks require a built dist and a free port 4174. They start their own server and never reuse an existing service. Tests do not trigger Touch ID or contact GitHub APIs. Accessibility automation does not replace manual keyboard and screen-reader review.

## Structure

- src/pages/index.astro: approved editorial homepage.
- src/pages/*.md: concepts, architecture, security, standards and an honest quickstart.
- src/layouts: shared HTML shell and documentation layout.
- public: original brand PNG and shared CSS.
- scripts/preview.py: narrow generated-site preview.
- tests: structural, server, responsive, accessibility and link checks.

Add routes to the preview allowlist and browser route list together. CI checks generated routes match the allowlist. Never place secrets or source material in public.

## Content and privacy

The protocol is experimental. Docs distinguish intended guarantees from feasibility results and label integrations illustrative. Standards metadata was checked against primary sources on 2026-09-22; this is a selected-source overview, not a conformance claim.

The repository remains private and Pages disabled. No deployment workflow, custom domain or public license is added. Publishing or changing visibility requires owner approval.

Keep PRs focused and obtain independent adversarial review. Copilot is supplementary, not a replacement.
