---
layout: ../layouts/Docs.astro
title: Human Mandates
description: Permission for a specific purpose, not unrestricted access.
vision: true
---

## Approve the commitment, not every step

The goal is useful autonomy within existing permission. An agent can research flights without a prompt for every search. A policy may require fresh approval before it buys a nonrefundable ticket. The same distinction applies to reading code versus merging into a protected branch.

Low risk does not mean unlimited authority. Policy must define the allowed action and resource. Unknown or unsupported requests should be denied.

## What a mandate would bind

In the target design, a mandate binds the principal and registered credential, agent key, exact action and resource, constraints, issuer and verifier audience, issue and expiry times, fresh nonce, and a versioned display model. An evidence envelope carries the approval assertion and issuer signature. The agent presents that authority to a participating service or a trusted gateway.

The agent may run on your device or remotely. Verification belongs at the boundary controlling the action, not necessarily on the human's device. A service must have an agreed profile and trusted verification keys; an agent-supplied signature is not self-authenticating authority.

These are design requirements, not a finalized interoperable schema. The initial profile targets one exact operation per mandate, with no wildcards or onward delegation.

## A concrete example

A proposed GitHub mandate would identify a repository, pull request number, expected head commit and merge method. Permission to merge that revision would not authorize a different commit, another repository or a secrets change.

The travel example illustrates the same principle. Flight booking is not an implemented integration.

## Approval is one input

A valid signature does not establish that the key is trusted, the agent is authorized, the operation is still current or the mandate is unused. Enforcement must also check policy, enrolled identities, expiry, revocation and replay state.

Passkey user verification is not universal proof of humanity or proof that someone understood the request. Touch ID is one possible local verification method, not a protocol guarantee.

Continue with the [architecture](/architecture/) and [security boundaries](/security/).
