# Research: Testing AI Observability

## Decision: Gate observability in the frontend by environment, not content pack

**Rationale**: The testing deployment already uses the `public` content pack,
so content-pack checks alone cannot distinguish testing from production public.
The feature needs an environment-specific rule tied to the dedicated testing
deployment, not a pack distinction. That keeps `public` content intact while
allowing testing-only UI to appear where intended.

**Alternatives considered**:
- Use `contentPack === 'public'`: rejected because both production public and
  testing use `public`.
- Add testing-only copy directly to deployment docs without UI changes:
  rejected because reviewers still need to inspect network traffic manually.

## Decision: Reuse the existing `/api/blurbs` source field for resolved source visibility

**Rationale**: The current managed API already returns `source` with values
`azure-openai`, `cache`, or `fallback`. That is sufficient for the initial
resolved-source surface and avoids unnecessary API expansion for the first part
of the feature.

**Alternatives considered**:
- Add a second diagnostics endpoint: rejected as needless complexity for a
  single-flow frontend feature.
- Infer the source only from frontend branch behavior: rejected because the API
  already provides a direct and more reliable signal.

## Decision: Model reroll outcome explicitly in the frontend hook

**Rationale**: The current hook already knows whether a reroll returned a new
bundle, reused previous AI blurbs, or fell back locally. Encoding that as
frontend state is enough to power the testing-only UI and keeps the contract
close to the behavior it describes.

**Alternatives considered**:
- Expand the API to classify reroll outcome on the server: rejected because the
  client already determines the final visible behavior after applying fallback
  rules.
- Avoid an explicit outcome model and show only loading state: rejected because
  the main reviewer question is how the reroll resolved, not only that it ran.

## Decision: Place the observability treatment near the main blurb as secondary metadata

**Rationale**: Reviewers need the source and reroll result in the same area as
the visible excuse. A small secondary treatment below the main blurb or reroll
action fits the design philosophy better than a new diagnostic panel and keeps
the content primary.

**Alternatives considered**:
- Add a separate testing debug panel: rejected because it adds unnecessary
  chrome and competes with the content.
- Hide diagnostics behind another disclosure: rejected because the point is to
  remove inspection friction during testing.

## Decision: Validate with hook-level tests plus rendered app verification

**Rationale**: This feature changes both state semantics and user-visible UI.
Hook tests can lock the reroll outcome logic precisely, while app-level tests
and testing-environment rendering checks verify that reviewers can actually see
the right information.

**Alternatives considered**:
- Only unit-test the hook: rejected because the value of the feature is visible
  diagnosability.
- Only do manual verification: rejected because the observability behavior is
  easy to regress and should be locked in tests.
