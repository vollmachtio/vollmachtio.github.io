---
layout: ../layouts/Docs.astro
title: Build with us
description: Explore the source, challenge the design, and follow the work.
---

## Start with the project

The [Vollmacht repository](https://github.com/vollmachtio/vollmacht) is public. Start with its README for the current implementation status and development instructions. This website describes the direction; the repository records what is implemented and tested.

There is no production-ready installation or live merchant integration to offer yet. You can help now by reviewing the architecture, testing documented experiments, and proposing concrete improvements.

Read the [contribution guide](https://github.com/vollmachtio/vollmacht/blob/main/CONTRIBUTING.md) before opening a change. Follow the [security policy](https://github.com/vollmachtio/vollmacht/blob/main/SECURITY.md) for vulnerability reports rather than posting sensitive evidence in a public issue.

## Website contributor preview

The website repository is being prepared for publication separately. Until then, its clone requires access. Use the Node version in .node-version and Python 3.12 or later.

```sh
git clone git@github.com:vollmachtio/vollmachtio.github.io.git
cd vollmachtio.github.io
npm ci
npm run build
npm run preview
```

Open `http://127.0.0.1:4173`. Stop with Ctrl+C. The preview serves only generated website assets, not source files or Git metadata.

## Checks

```sh
npm test
npx playwright install chromium
npm run test:browser
npm run check:external
```

Browser tests inspect desktop and mobile widths, keyboard navigation, local links and automated accessibility rules. The external-link check accesses only explicitly permitted documentation hosts and uses no GitHub credentials. Automated accessibility checks do not replace manual testing.

## Protocol experiments

Consult the core repository's README and experiment instructions for current commands, prerequisites and known limitations. This page deliberately avoids duplicating an evolving implementation guide.

The Rust WebAuthn probe tests a browser ceremony. The SimpleWebAuthn experiment assesses operation-derived challenges. Neither is a production mandate service or GitHub enforcement integration. Synthetic test success is not evidence that a physical Touch ID ceremony was tested.

Do not supply production GitHub credentials or use these experiments as the sole control for production-critical operations.

## What comes next

Finish browser and key-storage feasibility gates, freeze the mandate profile through review, build issuer/verifier and durable replay state, then add a disposable-repository GitHub demo. Website examples describe that direction, not shipped features.
