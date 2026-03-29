# Feature Specification: Testing AI Observability

**Feature Branch**: `001-ai-observability`  
**Created**: 2026-03-29  
**Status**: Draft  
**Input**: User description: "Add a testing-only AI observability surface that
shows whether the current excuse content came from Azure OpenAI or cache, makes
reroll activity visible, and records whether rerolls returned fresh AI text,
reused prior AI blurbs, or fell back locally without changing the production
UI."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the current AI source in testing (Priority: P1)

As a person reviewing the testing environment, I want to see whether the
current visible excuse content came from live AI, cache, or local fallback, so
I can tell what the app is actually doing without reading network logs.

**Why this priority**: The current app can use AI correctly while still feeling
opaque. This story gives immediate confidence about what the testing
environment is showing.

**Independent Test**: Open the testing environment on a date that loads excuse
content and verify that the page exposes a visible testing-only indicator for
the current source without affecting the production UI.

**Acceptance Scenarios**:

1. **Given** a user is on the testing environment and excuse content has
   loaded, **When** the visible content comes from Azure OpenAI, **Then** the
   page shows that the current result is AI-generated.
2. **Given** a user is on the testing environment and excuse content has
   loaded, **When** the visible content comes from cache or local fallback,
   **Then** the page shows the corresponding source clearly enough to
   distinguish it from live AI.

---

### User Story 2 - Understand reroll progress and outcome (Priority: P2)

As a person verifying `Ny ursäkt` in the testing environment, I want to see
that a reroll is in progress and how it resolved, so I can tell whether the new
result came from fresh AI text, reused earlier AI blurbs, or local fallback.

**Why this priority**: The reroll path is where uncertainty has been highest.
Reviewers need to know not just that something changed, but how the app arrived
there.

**Independent Test**: Trigger `Ny ursäkt` in the testing environment and verify
that the page first shows a reroll-in-progress state and then reports the final
reroll outcome in testing-only UI.

**Acceptance Scenarios**:

1. **Given** a user is on the testing environment with reroll available,
   **When** the user presses `Ny ursäkt`, **Then** the page shows that a reroll
   is being fetched before the new result settles.
2. **Given** a reroll completes in the testing environment, **When** the app
   resolves the request, **Then** the page reports whether the result used fresh
   AI text, reused prior AI blurbs, or fell back locally.

---

### User Story 3 - Keep production clean while testing stays transparent (Priority: P3)

As a product owner, I want observability to be visible only where it helps
testing, so production keeps its intended editorial feel while testing remains
diagnosable.

**Why this priority**: This project values simplicity and restraint. Diagnostic
UI is useful in testing but should not become permanent product chrome for all
users.

**Independent Test**: Compare testing and production-oriented environments and
verify that observability messaging appears in testing but does not appear in
the normal public production surface.

**Acceptance Scenarios**:

1. **Given** the feature is enabled in the testing environment, **When** a
   reviewer opens the page, **Then** observability details are visible there.
2. **Given** the same feature branch is not running in the normal production
   public surface, **When** a user opens that surface, **Then** no testing-only
   observability labels or outcome summaries are shown.

### Repository-Specific Context *(mandatory for this project)*

- **Affected Content Pack**: public
- **Date Logic Impact**: none
- **User-Visible Surface**: copy, layout, interaction, AI-generated content,
  deployment behavior
- **Rendered Verification Needed**: inspect the rendered result in the testing
  environment during initial load and after `Ny ursäkt`, and verify that the
  production-like public surface does not show the testing-only observability
  treatment

### Edge Cases

- What happens when the page is still waiting for the first AI response and no
  source has been resolved yet?
- How does the system behave when reroll returns metadata but no fresh blurbs
  and the app intentionally reuses earlier AI blurbs?
- What happens when the managed API is unavailable and the app must fall back
  locally?
- How does the page behave when reroll is not available for the current state?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show a testing-only visual indicator for the
  currently visible excuse source after content has resolved.
- **FR-002**: The system MUST distinguish at least these resolved sources in the
  testing environment: live AI, cache, and local fallback.
- **FR-003**: Users in the testing environment MUST be able to tell when a
  reroll is actively being fetched after pressing `Ny ursäkt`.
- **FR-004**: The system MUST report the reroll outcome in the testing
  environment after each reroll attempt.
- **FR-005**: The reroll outcome MUST distinguish whether the settled result
  used fresh AI text, reused earlier AI blurbs, or fell back locally.
- **FR-006**: The system MUST keep the observability treatment out of the normal
  production public surface.
- **FR-007**: The system MUST preserve the existing user-facing excuse
  experience, meaning the observability treatment cannot replace or obscure the
  main blurb, title treatment, or ordinary reroll action.
- **FR-008**: The system MUST continue to behave coherently when AI-backed
  content is loading, cached, rerolled, or unavailable.

### Key Entities *(include if feature involves data)*

- **Resolved Source State**: The current explanation of where the visible excuse
  content came from, such as live AI, cache, or local fallback.
- **Reroll Outcome State**: The most recent explanation of how a reroll
  resolved, including whether it produced fresh AI text, reused earlier AI
  blurbs, or fell back locally.
- **Environment Visibility Rule**: The rule that determines whether
  observability details are shown in the current environment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In the testing environment, a reviewer can determine the current
  excuse source within 5 seconds of the content settling.
- **SC-002**: In the testing environment, a reviewer can determine the latest
  reroll outcome within 5 seconds of pressing `Ny ursäkt`.
- **SC-003**: In rendered verification, the normal production public surface
  shows zero testing-only observability labels or status messages.
- **SC-004**: Reviewers no longer need browser network inspection for the
  common question "did this come from live AI, cache, or fallback?"

## Assumptions

- The testing environment is the correct place for extra diagnostic visibility,
  while the normal public production surface should remain editorial and calm.
- Existing AI and fallback flows remain the source of truth; this feature only
  makes those outcomes observable to reviewers.
- The feature applies to the public pack path used by the testing deployment and
  does not introduce any team-only behavior.
- Current AI source categories are sufficient for this feature: live AI, cache,
  and local fallback.
