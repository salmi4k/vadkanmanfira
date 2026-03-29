<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
  - template principle 1 -> I. Content-Pack Boundaries Are Absolute
  - template principle 2 -> II. Date Truth Before Presentation
  - template principle 3 -> III. Visible Quality Requires Rendered Verification
  - template principle 4 -> IV. Tests Guard Behavior, Not Just Compilation
  - template principle 5 -> V. Simplicity And Editorial Judgment Win
- Added sections:
  - Delivery Constraints
  - Workflow And Quality Gates
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
- Follow-up TODOs:
  - Consider adding .agents/ to .gitignore if this repo later stores agent-local credentials there.
-->
# Fredagskoll Constitution

## Core Principles

### I. Content-Pack Boundaries Are Absolute
The `public` and `team` packs MUST remain intentionally separated.
User-visible copy, branding, weekday lore, media, and behavior that are meant
only for `team` MUST stay behind the `team` content pack and MUST NOT leak into
`public`. Every feature plan that touches content, selection logic, or
deployment behavior MUST state which pack or packs it affects and how boundary
integrity is preserved.

### II. Date Truth Before Presentation
The app MUST be correct about dates before it is clever about tone. Built-in
celebrations, Easter-relative dates, recurring weekday logic, and unofficial
theme-day selection MUST remain aligned. If a celebration name is reserved by
day-classification logic, ordinary theme-day flows MUST NOT surface it on the
wrong date. User-facing copy about "today", "tomorrow", or nearby dates MUST be
grounded in exact date logic and verified against fixed-date tests.

### III. Visible Quality Requires Rendered Verification
User-visible changes are not complete when they compile. Any change affecting
copy, layout, motion, hierarchy, loading states, reroll flows, or other visible
front-end behavior MUST be inspected in a rendered experience before shipping.
Reviews MUST treat encoding problems, awkward copy, spacing regressions, and
unclear state transitions as product defects, not cosmetic follow-ups.

### IV. Tests Guard Behavior, Not Just Compilation
Changes to date rules, AI content handling, filtering, routing, and user-facing
interaction flows MUST add or update automated tests that lock the intended
behavior. Fixed injected dates are the default strategy for frontend tests.
Features that alter rendered UI states MUST prefer assertions about what the
user sees, not only internal helper behavior. "Tests optional" is not valid for
behavioral changes in this repository.

### V. Simplicity And Editorial Judgment Win
Fredagskoll MUST prefer fewer, stronger UI decisions over extra controls,
explanatory chrome, or exhaustive presentation. The interface exists to surface
the day's most relevant answer with calm, opinionated clarity. Plans and
implementations MUST follow `docs/design-philosophy.md`: content leads, chrome
recedes, motion stays restrained, and every user-visible string should read as
chosen rather than merely generated.

## Delivery Constraints

- The primary app surface lives in `fredagskoll-frontend`; plans MUST name the
  exact frontend, API, and data files they expect to change.
- Pure helpers and cross-cutting logic SHOULD be extracted from `App.tsx` when a
  feature would otherwise make it more complex or harder to test.
- AI-backed flows MUST behave coherently when cached, rerolled, or temporarily
  unavailable. If the product keeps using AI-derived content, the UI MUST avoid
  misleading local fallbacks that look like successful fresh AI output.
- Public deployment paths (`main`) and testing deployment paths (`testing`) MUST
  be considered separately when a feature changes environment-sensitive behavior.

## Workflow And Quality Gates

1. Start with a spec that states the user-visible outcome, the affected content
   pack, date or calendar implications, and whether the change affects AI,
   static content, or both.
2. Plans MUST pass a constitution check covering:
   content-pack boundaries, exact date correctness, required automated tests,
   required rendered verification, and design-philosophy alignment.
3. Task lists MUST include explicit verification tasks whenever user-visible
   behavior changes. That includes the relevant automated tests plus a rendered
   check in the app or testing environment.
4. For substantial multi-part work such as broad frontend audits, design passes,
   or larger feature updates, parallel sub-agents SHOULD be used when ownership
   can be split cleanly and final integration remains coherent.
5. Before commit or push, the implementer MUST review the final diff for copy
   quality, encoding issues, accidental pack leakage, and generated-file noise.

## Governance

This constitution overrides ad hoc workflow preferences for this repository.
All specifications, plans, task lists, reviews, and implementation work MUST
demonstrate compliance with these principles. Amendments require an explicit
update to this file, a summary of the impact on templates or workflow guidance,
and a semantic version bump using these rules:

- MAJOR: Removes or materially redefines a governing principle.
- MINOR: Adds a new principle or materially expands repository obligations.
- PATCH: Clarifies wording without changing the practical bar for compliance.

Compliance review is required in every feature plan and again before
implementation is considered complete. Runtime guidance in `AGENTS.md` and
product direction in `docs/design-philosophy.md` MUST remain aligned with this
constitution.

**Version**: 1.0.0 | **Ratified**: 2026-03-29 | **Last Amended**: 2026-03-29
