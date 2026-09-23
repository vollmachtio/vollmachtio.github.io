---
layout: ../layouts/Docs.astro
title: Standards and interoperability
description: Practical local enforcement today as a design goal, standards bridges later.
---

Research snapshot: **2026-09-22**. Vollmacht implements none of the agent-authorization profiles below and exposes no OAuth or GNAP endpoints. These are potential mappings, not conformance claims. Individual Internet-Drafts are not IETF endorsements. Working-group drafts can also change.

## Emerging IETF work

### Agent Authorization Envelope

[draft-kroehl-agentic-trust-aae-02](https://datatracker.ietf.org/doc/html/draft-kroehl-agentic-trust-aae-02), Lars Kersten Kroehl, 2026-09-06. Active individual draft, intended Informational.

Its mandate, constraints and validity blocks resemble the planned action, limits and lifetime of a Human Mandate. Its VC/DID model and JOSE profile differ from Vollmacht's proposed local enrolled-key model. Similar fields do not establish compatible tokens or shared replay consumption. [Current status](https://datatracker.ietf.org/doc/draft-kroehl-agentic-trust-aae/).

### Agent identity and trust

[draft-ietf-wimse-aims-00](https://datatracker.ietf.org/doc/html/draft-ietf-wimse-aims-00), Pieter Kasselman, Jeff Lombardo, Yaroslav Rosomakho, Brian Campbell, Nick Steele and Aaron Parecki, 2026-09-15. Active WIMSE working-group draft; header intends Informational. It replaces draft-klrc-aiagent-auth.

Its separation of agent identity, credentials and authorization supports keeping agent keys distinct from human passkeys. A locally enrolled key is not automatically a WIMSE identity or provisioned credential. [Current status](https://datatracker.ietf.org/doc/draft-ietf-wimse-aims/).

### OAuth delegation and actor chains

[draft-mishra-oauth-agent-grants-02](https://datatracker.ietf.org/doc/html/draft-mishra-oauth-agent-grants-02), Sanjeev Kumar, 2026-08-30. Active individual draft, intended Informational. Its delegated grants and resource restrictions are relevant to a future adapter. Vollmacht currently lacks the participating OAuth servers and token profiles. [Current status](https://datatracker.ietf.org/doc/draft-mishra-oauth-agent-grants/).

[draft-mw-oauth-actor-chain-01](https://datatracker.ietf.org/doc/html/draft-mw-oauth-actor-chain-01), A Prasad, Ramki Krishnan, Diego Lopez and Srinivasa Addepalli, 2026-06-15. Active individual draft, intended Standards Track. It investigates verifiable actor chains. Vollmacht's initial design has one enrolled agent, no subdelegation and none of its chain proofs. [Current status](https://datatracker.ietf.org/doc/draft-mw-oauth-actor-chain/).

## Published building blocks

[OAuth Token Exchange, RFC 8693](https://www.rfc-editor.org/rfc/rfc8693.html), January 2020, Standards Track, by Michael B. Jones, Anthony Nadalin, Brian Campbell, John Bradley and Chuck Mortimore. A future bridge could map a principal to the subject and the agent to the current actor. Nested actor history is not proof that each delegation was cryptographically authorized. Vollmacht provides no token-exchange endpoint.

[GNAP, RFC 9635](https://www.rfc-editor.org/rfc/rfc9635.html), October 2024, Standards Track, by Justin Richer and Fabien Imbault. Its grant interaction, client keys and access rights could support a future bridge. Vollmacht is neither a GNAP client nor authorization server. Mapping requires agreed resource semantics, trust and lifetime handling.

## WebAuthn and FIDO boundaries

[WebAuthn Level 3](https://www.w3.org/TR/webauthn-3/) is W3C work, not an IETF agent-delegation protocol. Assertions cover authenticator data and hashed original client data, including challenge and origin. User verification does not guarantee Touch ID, informed intent or unique humanity. The relying party does not receive biometric templates.

Operation-derived challenges are being investigated in Vollmacht's SimpleWebAuthn experiment. Exact custom-challenge verification in software is not a completed mandate format, hardware support matrix or persistent replay defense.

## x401 is a separate project

[x401's live specification](https://x401.proof.com/spec/latest/), observed 2026-09-22, describes HTTP proof requirements and presentations using OpenID4VP/DCQL. It is not an IETF standard. Its evidence/delegation layer is relevant to transporting proof requests, whereas Vollmacht's intended local boundary decides whether an operation may execute.

A bridge would need an agreed credential profile, agent and audience binding, exact-action semantics, trusted verification and replay handling. No interoperability is implemented. This source is live, not a pinned release.

## Conditions for a future adapter

Preserve principal, agent, action, resource, constraints, audience and validity without widening authority. Keep approval evidence, issuer trust, policy, replay reservation and execution outcome separate. Require independent interoperability vectors and negative tests before claiming conformance.

This is a selected-source overview, not a comprehensive survey. Recheck revisions and status before release or adapter design.

