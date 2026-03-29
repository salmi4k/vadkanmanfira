# UI Contract: Testing AI Observability

## Purpose

Define the visible testing-only diagnostics that accompany the current excuse
content and reroll flow.

## Entry Conditions

- The user is on the dedicated testing deployment.
- The main excuse card is visible.
- The ordinary production public surface is not expected to render these
  diagnostics.

## Contract

### Initial request lifecycle

- Before the current request resolves, the page may show the normal loading
  treatment but must not claim a resolved source.
- After the request resolves, the page must show one of:
  - `AI`
  - `Cache`
  - `Lokal fallback`
  - equivalent localized reviewer-facing labels

### Reroll lifecycle

- When `Ny ursäkt` is pressed and reroll is available, the page must visibly
  indicate that a reroll is in progress.
- After reroll settles, the page must show one of:
  - fresh AI result
  - reused previous AI blurbs
  - local fallback
  - equivalent localized reviewer-facing labels

### Placement

- The observability treatment must stay visually secondary to the title and
  blurb.
- It must appear close enough to the main blurb and reroll action that a
  reviewer does not have to scan another panel.

### Environment rule

- The contract applies only when the environment visibility rule resolves to
  testing.
- When the environment rule resolves to non-testing, no observability labels,
  source badges, or reroll outcome summaries may render.

## Failure Conditions

- Showing testing observability in the normal production public surface
- Claiming a resolved source before the request has settled
- Reporting an outcome that does not match the visible reroll behavior
- Letting the diagnostics visually overpower the main content
