---
layout: ../layouts/Docs.astro
title: Security boundaries
description: What the design is intended to constrain, and what it cannot prove.
---

## Experimental, not a sole production control

These controls are requirements under development, not implemented guarantees. No production certification or completed end-to-end enforcement is claimed.

## Threat model

| Threat | Intended control | Remaining limitation |
| :--- | :--- | :--- |
| Compromised agent or prompt injection | Narrow policy and isolated write credentials | An approved harmful action can still cause harm |
| Confused deputy or stolen mandate | Bind principal, agent key, audience and operation | Same-user malware may steal keys or bypass isolation |
| Tampering or widened authority | Strict schema, canonical bytes, domain separation, verified signatures | Trusted enrollment and correct verifier logic are prerequisites |
| Replay or concurrency | Atomic durable reservation before dispatch | Independent verifiers do not automatically share consumption |
| Expiry and revocation | Check current state in the reservation decision | Revocation cannot recall a dispatched operation |
| Resource changes after approval | Exact revision and supported API preconditions | Preflight reads alone do not eliminate races |
| Malicious approval UI or tool | Small trusted components and bound display data | Cryptography does not prove what the person saw |
| Local malware | OS protections and least privilege | v0 is not a sandbox against a compromised user account |

## Passkeys are not biometric identity

WebAuthn verification can use Touch ID, a PIN or another supported method. The relying party receives cryptographic evidence, not a fingerprint. User verification is not proof of humanity, unique identity or understanding.

Synced passkeys may exist on several devices. Signature counters do not provide universal clone detection. Device uniqueness and non-exportability must not be inferred from a successful assertion.

## Avoid approval fatigue

Routine actions should run within explicit existing permission. Fresh approval belongs at policy-selected consequential boundaries. Prompting for every tool call encourages reflexive approval and undermines useful autonomy.

## Revocation and audit limits

The proposed revocation cutoff is atomic reservation. Revocation committed first prevents reservation; a reservation committed first may proceed. Offline signature inspection cannot replace current revocation and replay state.

Audit events should omit secrets and routine assertion evidence. A local hash chain cannot prevent deletion, rollback or rewriting of the entire log. Audit evidence is not proof of successful remote execution.

## Website privacy

This website is static. It has no live approval ceremony, purchase form, analytics or runtime JavaScript. Development remains private and no deployment is configured.

Use the core repository's SECURITY.md through an authorized private channel to report suspected vulnerabilities. Do not publish credentials, assertion evidence or sensitive logs in website issues.

