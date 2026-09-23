---
layout: ../layouts/Docs.astro
title: Architecture
description: Human authority, carried by agents and verified where actions happen.
vision: true
authorityFlow: true
---

## The destination verifies before it commits

Vollmacht's goal is a common way to express bounded human authority across agents and services. The human grants authority; the agent carries it; the service responsible for the consequential action verifies it before committing.

The diagram simplifies the roles. An agent can propose an operation first, a service can request missing authority, and the human can approve through a trusted ceremony. Routine work within existing permission does not need repeated prompts.

## Who runs where?

| Role | Location | Responsibility |
| :--- | :--- | :--- |
| Human and authenticator | Personal device | Review the requested authority and approve with a passkey; biometric verification stays local |
| Agent | Personal device or remote host | Present the mandate, exact operation and proof of the bound agent key |
| Verifying service | Merchant, payment service, API or trusted gateway | Validate authority and local policy; reserve permitted use before committing |

Verification needs trusted execution and current state, not a particular cloud placement. A server operated by the destination can do it. A local gateway can also do it when that gateway controls access to the action.

## Flight booking and payment protect different commitments

A booking service checks the selected itinerary, passenger, fare conditions and permitted purchase. A payment service checks the merchant, amount, currency and payment authority. Payment approval alone does not prove that the correct flight was booked.

These are illustrative integration roles, not claims of support by Google Flights, Stripe or any other provider. A real integration needs agreed operation semantics and a trusted verification profile.

When booking and payment involve different services, one single-use mandate cannot simply be spent twice. Separate, audience-bound authorizations or an explicitly designed coordinated transaction are needed. Cross-service atomicity, refunds and compensation are not supplied by the mandate itself.

## What the service must verify

1. **Trust:** resolve enrolled issuer and credential keys through an agreed trust relationship, not keys supplied only by the agent.
2. **Evidence:** validate the approval evidence and its binding to the mandate using the agreed profile.
3. **Agent:** verify possession of the bound agent key and fresh request proof.
4. **Scope:** match the exact action, resource, constraints, audience and validity window.
5. **Policy and state:** check current policy, credential status, revocation and replay state; atomically reserve use.
6. **Commit:** apply available resource preconditions, perform the authorized operation, and record its outcome.

A valid signature is necessary evidence, not a complete authorization decision. Sharing a signed artifact does not share replay or revocation state between services.

## Two adoption paths

**Native service integration:** a participating merchant, payment processor or API verifies mandates at its own action boundary. This is the broader target architecture and requires that service's integration and trust configuration.

**Vollmacht gateway:** a local or hosted gateway verifies mandates and calls an existing API using credentials it controls. The destination need not understand Vollmacht. The initial planned GitHub demo follows this path on macOS.

A gateway is effective only if the agent cannot bypass it with equivalent direct credentials. Local enforcement is an adoption path, not a requirement that every agent or verifier live on the user's Mac.

## Approval and execution remain separate

The intended profile binds approval to domain-separated canonical payload bytes with fresh trusted randomness. Precise encoding, trust provisioning and interoperability profiles require review before deployment. A passkey assertion does not prove what the user saw or understood.

For a single-use operation, the intended lifecycle is approved, reserved, then succeeded, failed or unknown. Reservation must be durable before dispatch. A timeout may mean the remote action succeeded; do not automatically retry a consequential operation or make the mandate reusable.

Exactly-once remote execution is not promised. Revocation cannot reliably recall a dispatched action. Read the [security boundaries](/security/) and [standards mappings](/standards/) for the limits.

## Available today

Design documentation and feasibility experiments are available to project contributors. A completed service-side integration, production verifier and GitHub enforcement service are not released. See [what you can try today](/quickstart/) for the current state.
