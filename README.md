# Vollmacht website

The vision and documentation website for [Vollmacht](https://github.com/vollmachtio/vollmacht): verifiable human authority for AI agents.

This repository is public. The deployment workflow publishes the static site to GitHub Pages after checks pass on main. Custom-domain setup is separate. The site presents the target design, not shipped integrations or a production-ready authorization service.

Astro generates static HTML from shared layouts and Markdown. No client JavaScript, analytics, external fonts, authentication or live approvals. Decorative stars support pause and reduced-motion preferences.

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

The repository became public on 2026-10-05 with owner approval. Pages uses GitHub Actions, not direct source-branch publishing. A source license still needs to be selected; public visibility alone does not grant an open-source license.

Keep PRs focused and obtain independent adversarial review. Copilot is supplementary, not a replacement.

## Public launch gate

Both repositories are public. The website leads with the target architecture; current implementation instructions live in the core repository.

Before enabling hosting:

- Review all Git history, PR discussions, Actions logs and artifacts for credentials and unapproved personal information. A core-repository audit does not cover this repository.
- Confirm the website source license and the intended publication of author metadata.
- Refresh the dated standards snapshot before announcing standards-related claims.
- Require passing exact-head CI and an independent adversarial review.
- Confirm the initial hostname. The organization Pages default is vollmachtio.github.io; a custom domain needs a separate ownership and DNS decision.
- Review deployment changes: only dist is uploaded, never the source checkout. PR builds cannot deploy; deployment requires both checks to pass on main.
- After explicit launch approval, enable Pages, verify HTTPS, exercise every route and set available main-branch protections.

Launch preparation adds no hiring pages, corporate biography, pricing, waitlist, tracking, customer logos or claims of shipped integrations. Do not mistake public source for production readiness.

## Deployment

In repository Settings → Pages, select GitHub Actions as the source. Merging to main runs all checks and publishes only the generated dist artifact. A manual run of Website checks on main can retry a deployment. Runs on other branches and pull requests cannot upload or deploy a Pages artifact.

The deploy job has Pages and OIDC permissions only; build jobs keep read-only repository access. External-link failures block publication as well as build, audit and browser-test failures. No AWS credentials are needed by this workflow.

For a custom domain, first verify ownership in the organization Pages settings. Add the exact domain in repository Pages settings before pointing Route 53 traffic at GitHub. Retain the verification TXT record. Configure apex A/AAAA records and a www CNAME using [GitHub's current guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), then enable Enforce HTTPS after certificate provisioning. Do not add wildcard records or overwrite unrelated mail records.

For rollback, revert the faulty change through a reviewed PR. The resulting main build passes the same gates before deployment.
