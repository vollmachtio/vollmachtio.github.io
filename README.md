# Vollmacht website

Private, unpublished website development for Vollmacht: verifiable human authority for AI agents.

## Local preview

Run `python3 scripts/preview.py` and visit http://127.0.0.1:4173. The server binds only to loopback and serves the three public site assets, not repository metadata. Stop with Ctrl+C.

Run `python3 -m unittest discover -s tests -v` for structural and preview-server checks. Python 3.12 or later is recommended. No third-party dependencies are needed.

## Scope

This first PR is a static HTML/CSS design implementation. It has no JavaScript, analytics, external fonts, forms, authentication, or deployment workflow. Approval cards and workflows are illustrations, not functional integrations. The logo is copied unchanged from the Vollmacht project's approved brand assets.

The page explicitly labels the project experimental and explains selective approval, local biometric verification, and enforcement limitations. It is not a production authorization product.

## Review and publishing

Keep changes in small PRs. Require independent adversarial review, focusing on consequential bugs, misleading security claims, data exposure and broken workflows. Automated checks do not replace browser or accessibility review.

The repository is private. GitHub Pages is disabled. Do not enable Pages, publish a preview, change visibility or configure DNS without owner approval. No public license is selected in this PR.

## Next PRs

1. Establish shared layouts and Markdown docs in Astro when adding multiple pages.
2. Add architecture, threat model and standards pages based on reviewed protocol work.
3. Add automated browser, accessibility and external-link checks.
4. After launch approval, add reviewed Pages deployment and domain configuration.

Current tests cover selected structural invariants and local serving, not full HTML validity, WCAG conformance or every responsive breakpoint.
