# Implementation Plan: Testing AI Observability

**Branch**: `001-ai-observability` | **Date**: 2026-03-29 | **Spec**: [spec.md](C:/Users/salmi/projects/Personal/fredagskoll/specs/001-ai-observability/spec.md)
**Input**: Feature specification from `/specs/001-ai-observability/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a testing-only observability surface around the existing AI excuse flow so
reviewers can see the resolved source state and the latest reroll outcome
without using browser network tools. The implementation will extend the current
frontend AI state model, preserve the existing public production UI, and expose
the observability treatment only when the app is running in the dedicated
testing environment.

## Technical Context

**Language/Version**: TypeScript 4.9.5, JavaScript (Azure Functions), React 19.2.3  
**Primary Dependencies**: React, Vite 7, Vitest, Testing Library, Azure Static Web Apps Functions  
**Storage**: Azure Table-backed AI variant cache via existing API layer; browser memory state for current session observability  
**Testing**: Vitest, Testing Library, rendered verification in the testing Static Web App  
**Target Platform**: Azure Static Web Apps web app with managed Functions API; desktop and mobile web reviewers  
**Project Type**: web application with frontend plus managed API  
**Performance Goals**: observability UI appears with the same content lifecycle as the current excuse flow and adds no noticeable interaction delay  
**Constraints**: production public UI must remain free of testing-only diagnostic chrome; existing AI/fallback behavior must stay coherent; content pack remains `public` for testing deployment  
**Scale/Scope**: one feature branch affecting the AI hook, current main card UI, tests, and testing-environment gating

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Content-pack boundary impact is identified (`public` only via the testing deployment path), and no `team` content or production-only behavior changes are introduced.
- Date correctness impact is none; no celebration or theme-day classification logic changes are planned, so no new date-rule regressions are required beyond protecting existing behavior.
- Automated test coverage will be added for source-state visibility, reroll progress visibility, reroll outcome labeling, and environment gating.
- Rendered verification will be required in the testing environment for initial AI load and post-reroll behavior, plus a production-like check that no testing-only labels appear there.
- The plan follows `docs/design-philosophy.md` by keeping the observability treatment testing-only, secondary to the main content, and restrained enough not to compete with the daily result.

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-observability/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ai-observability-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
api/
└── blurbs/
    └── index.js

fredagskoll-frontend/
├── src/
│   ├── App.tsx
│   ├── appText.ts
│   ├── components/
│   │   └── MainCelebrationCard.tsx
│   ├── features/
│   │   └── ai/
│   │       ├── aiBlurbs.ts
│   │       ├── useAiContent.ts
│   │       └── useAiContent.test.tsx
│   ├── App.test.tsx
│   └── styles/
│       └── layout.css
└── package.json

.github/
└── workflows/
    └── deploy-static-apps.yml
```

**Structure Decision**: Keep the feature inside the existing frontend AI flow
and main card surface. The primary changes belong in
`fredagskoll-frontend/src/features/ai`, `fredagskoll-frontend/src/components`,
and supporting UI text/tests. The current API response format in `api/blurbs`
already exposes the source, so the plan should reuse and minimally extend that
contract only if reroll outcome data is not derivable on the client.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
