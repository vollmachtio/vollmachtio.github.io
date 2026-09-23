---
layout: ../layouts/Docs.astro
title: Try what exists today
description: Preview the website locally and understand the experiment boundaries.
---

## Website preview

Repository access is required while development remains private. Use the Node version in .node-version and Python 3.12 or later.

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

There is no released Vollmacht installation or live GitHub authorization quickstart yet. Authorized contributors should consult the core repository's README and experiment instructions.

The Rust WebAuthn probe tests a browser ceremony. The SimpleWebAuthn experiment assesses operation-derived challenges. Neither is a production mandate service or GitHub enforcement integration. Synthetic test success is not evidence that a physical Touch ID ceremony was tested.

Do not supply production GitHub credentials or use these experiments as the sole control for production-critical operations.

## What comes next

Finish browser and key-storage feasibility gates, freeze the mandate profile through review, build issuer/verifier and durable replay state, then add a disposable-repository GitHub demo. Website examples describe that direction, not shipped features.
