# Tasks: Testing AI Observability

**Input**: Design documents from `/specs/001-ai-observability/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include automated test tasks for any behavioral change. In this
repository, tests are REQUIRED when a feature changes date logic, filtering,
AI/fallback behavior, or any user-visible interaction state.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- This repo is a web app centered on `fredagskoll-frontend/` with managed API
  code in `api/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Define the environment gate and observability scope before implementation

- [ ] T001 Add the testing-only environment gate decision to `specs/001-ai-observability/plan.md` and `specs/001-ai-observability/contracts/ai-observability-ui.md` if implementation details shift
- [ ] T002 Define the runtime flag source for testing-only AI observability in `.github/workflows/deploy-static-apps.yml` and the relevant frontend config touchpoints

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared state and visibility rules that every story depends on

- [ ] T003 Create observability state and environment helper logic in `fredagskoll-frontend/src/features/ai/`
- [ ] T004 [P] Extend AI bundle types and hook return types in `fredagskoll-frontend/src/features/ai/aiBlurbs.ts` and `fredagskoll-frontend/src/features/ai/useAiContent.ts`
- [ ] T005 [P] Add localized observability labels in `fredagskoll-frontend/src/appText.ts`

**Checkpoint**: Shared observability model exists and can be consumed by the UI

---

## Phase 3: User Story 1 - See the current AI source in testing (Priority: P1) 🎯 MVP

**Goal**: Show whether the current visible excuse came from live AI, cache, or local fallback in the testing environment only

**Independent Test**: Open the testing environment and confirm that the current resolved source is visible there, while the normal public surface does not show it

### Tests for User Story 1

- [ ] T006 [P] [US1] Add hook tests for resolved source state in `fredagskoll-frontend/src/features/ai/useAiContent.test.tsx`
- [ ] T007 [P] [US1] Add app-level tests for testing-only source visibility and production-hidden behavior in `fredagskoll-frontend/src/App.test.tsx`

### Implementation for User Story 1

- [ ] T008 [US1] Expose resolved source state from `fredagskoll-frontend/src/features/ai/useAiContent.ts`
- [ ] T009 [US1] Wire testing-only observability props through `fredagskoll-frontend/src/App.tsx` and `fredagskoll-frontend/src/components/MainCelebrationCard.tsx`
- [ ] T010 [US1] Add secondary styling for the testing-only source treatment in `fredagskoll-frontend/src/styles/layout.css`
- [ ] T011 [US1] Enable the testing-only gate in `.github/workflows/deploy-static-apps.yml`

**Checkpoint**: Reviewers can see the current source in testing without production leakage

---

## Phase 4: User Story 2 - Understand reroll progress and outcome (Priority: P2)

**Goal**: Make reroll progress and reroll resolution visible to testing reviewers

**Independent Test**: Trigger `Ny ursäkt` and confirm both a loading state and a final outcome label appear in the testing environment

### Tests for User Story 2

- [ ] T012 [P] [US2] Add hook tests for reroll outcomes (`fresh-ai`, `reused-ai`, `local-fallback`) in `fredagskoll-frontend/src/features/ai/useAiContent.test.tsx`
- [ ] T013 [P] [US2] Add app-level tests for reroll loading/outcome rendering in `fredagskoll-frontend/src/App.test.tsx`

### Implementation for User Story 2

- [ ] T014 [US2] Track reroll outcome state in `fredagskoll-frontend/src/features/ai/useAiContent.ts`
- [ ] T015 [US2] Render reroll progress and outcome messaging in `fredagskoll-frontend/src/components/MainCelebrationCard.tsx`
- [ ] T016 [US2] Refine observability copy in `fredagskoll-frontend/src/appText.ts` so loading, source, and outcome labels stay clear but secondary

**Checkpoint**: Reviewers can tell both that reroll happened and how it resolved

---

## Phase 5: User Story 3 - Keep production clean while testing stays transparent (Priority: P3)

**Goal**: Keep all observability UI isolated to testing and visually subordinate

**Independent Test**: Compare testing and non-testing rendering and confirm only testing shows observability metadata

### Tests for User Story 3

- [ ] T017 [P] [US3] Add environment-gating regression coverage in `fredagskoll-frontend/src/App.test.tsx`

### Implementation for User Story 3

- [ ] T018 [US3] Centralize the environment visibility rule in `fredagskoll-frontend/src/features/ai/`
- [ ] T019 [US3] Verify that the observability treatment stays secondary in `fredagskoll-frontend/src/components/MainCelebrationCard.tsx` and `fredagskoll-frontend/src/styles/layout.css`

**Checkpoint**: Testing stays diagnosable and production stays calm

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and rollout readiness

- [ ] T020 Run targeted tests in `fredagskoll-frontend`
- [ ] T021 Run a production build in `fredagskoll-frontend`
- [ ] T022 Run rendered verification in the testing environment after deployment
- [ ] T023 Review diffs for copy quality, encoding issues, and deployment-only leakage

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 shared UI wiring
- **User Story 3 (Phase 5)**: Depends on the environment gate and visible metadata existing
- **Polish (Final Phase)**: Depends on all desired stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: MVP; enables visible source debugging in testing
- **User Story 2 (P2)**: Builds on the same observability surface to explain rerolls
- **User Story 3 (P3)**: Confirms the final isolation and visual restraint rules

### Parallel Opportunities

- T004 and T005 can run in parallel
- T006 and T007 can run in parallel
- T012 and T013 can run in parallel

---

## Parallel Example: User Story 1

```text
Task: "Add hook tests for resolved source state in fredagskoll-frontend/src/features/ai/useAiContent.test.tsx"
Task: "Add app-level tests for testing-only source visibility and production-hidden behavior in fredagskoll-frontend/src/App.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Establish the testing-only environment gate
2. Expose resolved source state from the existing AI hook
3. Render a small secondary source treatment in testing only
4. Validate testing visibility and production absence

### Incremental Delivery

1. Ship current source visibility first
2. Add reroll outcome observability next
3. Finish with environment-isolation and visual polish

### Parallel Team Strategy

1. One worker updates hook state and tests
2. One worker updates the UI surface and styling
3. Final integration verifies environment gating and rendered behavior
