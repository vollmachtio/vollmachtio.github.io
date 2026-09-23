---
layout: ../layouts/Docs.astro
title: Architecture
description: A local enforcement boundary in front of existing APIs.
---

## Current status

Vollmacht has feasibility experiments, not a completed issuer, verifier or GitHub enforcement service. This is the intended design. GitHub would not need to adopt a new protocol.

## Proposed operation flow

1. **Propose:** the agent submits an exact supported operation to the local service.
2. **Evaluate:** policy denies it, allows a permitted read, or requires a mandate.
3. **Approve:** a trusted local UI displays the operation and requests passkey verification when required.
4. **Verify:** the service validates evidence, enrolled keys, agent proof, audience, constraints and current state.
5. **Reserve:** persistent state atomically marks the mandate used before dispatch.
6. **Execute:** the GitHub adapter uses its isolated write credential and available API preconditions.
7. **Record:** sanitized audit events distinguish success, failure and an unknown remote result.

The write credential belongs behind the enforcement boundary. An agent with equivalent direct access can bypass this design.

## Module boundaries

| Component | Responsibility | Important boundary |
| :--- | :--- | :--- |
| Rust mandate core | Strict parsing, canonicalization and verification | A signature alone does not authorize execution |
| Approval UI and WebAuthn helper | Enrollment and operation-bound evidence | Verification does not prove informed intent |
| Policy and storage | Narrow authority, revocation, atomic consumption | Offline evidence has no current replay state |
| GitHub adapter | Explicit operations and preconditions | No arbitrary shell or API forwarding |
| CLI | Propose, inspect and report outcomes | Approval is not execution success |

## Challenge binding remains a design gate

The intended construction derives a WebAuthn challenge from domain-separated canonical payload bytes containing fresh trusted randomness. The verifier would independently reconstruct the challenge and verify original assertion bytes against enrolled credentials.

The SimpleWebAuthn software experiment demonstrates a public custom-challenge API and exact verification. Its opaque operation bytes are not the final canonical mandate schema. Production helper packaging, persistent enrollment and hardware/browser acceptance remain separate work.

## Failures are part of the protocol

The proposed states are approved, reserved, then succeeded, failed or unknown. Reservation must be durable before a write. A crash or timeout must not make a mandate reusable.

Exactly-once remote execution is not promised. An ambiguous response may mean GitHub already performed the operation. Reconcile before another approval; do not automatically retry a write.

The first planned demo uses a deliberately selected disposable repository and a documentation-only PR. Simulation is the intended default. Repository deletion, secret changes and branch-protection changes are outside its initial scope.

