# Data Model: Testing AI Observability

## ResolvedSourceState

Represents the source of the currently visible excuse content after the current
request has settled.

### Fields

- `source`: one of `azure-openai`, `cache`, `fallback`, or `unknown`
- `visible`: boolean indicating whether the observability treatment should be
  shown in the current environment
- `label`: localized reviewer-facing text for the current source

### Rules

- `unknown` is only valid before the current request has resolved.
- `fallback` means the visible result is not coming from a live AI or cached AI
  bundle for the current settled request.
- `visible` MUST be false outside the testing environment.

## RerollOutcomeState

Represents how the most recent reroll attempt resolved for the visible excuse.

### Fields

- `status`: one of `idle`, `loading`, `fresh-ai`, `reused-ai`, `local-fallback`
- `label`: localized reviewer-facing text for the latest reroll outcome
- `hasAttempt`: boolean indicating whether at least one reroll has been
  attempted in the current page state

### Rules

- `idle` is the default before a reroll attempt starts.
- `loading` is valid only while `Ny ursäkt` is actively fetching.
- `fresh-ai` means the reroll produced a usable new AI bundle with fresh blurbs.
- `reused-ai` means the reroll returned useful AI metadata but the app kept the
  previous AI blurbs as the visible excuse pool.
- `local-fallback` means the reroll resolved without a usable AI result and the
  visible excuse was chosen from the local fallback pool.

## ObservabilityVisibilityRule

Determines whether the diagnostics surface should render at all.

### Fields

- `isTestingEnvironment`: boolean derived from deployment/runtime context
- `showAiObservability`: boolean computed from the environment rule

### Rules

- `showAiObservability` MUST be true only in the dedicated testing environment.
- The rule MUST be independent from `contentPack`, because the testing
  deployment uses the public pack.

## AiObservabilityViewModel

Combined frontend state used by the UI layer.

### Fields

- `resolvedSourceState`: `ResolvedSourceState`
- `rerollOutcomeState`: `RerollOutcomeState`
- `isAiBundleLoading`: existing loading state for the current request
- `isAiRerolling`: existing loading state for reroll

### Rules

- The view model MUST never replace the main content hierarchy.
- The view model MUST update in sync with the currently visible blurb state.
- When the date changes, reroll outcome state resets to `idle` until a reroll
  occurs on the new date.
