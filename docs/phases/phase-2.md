# Phase 2 - Engagement Features

Status: completed

GitHub issues:
- `#71` Add a surprise celebration button
- `#72` Add a celebration scoring system
- `#75` Add celebration categories
- `#77` Add a "Dagens ursäkt att fika" feature

## What was added

- A `Surprise me` action in the left-side intro panel that jumps to a celebration-worthy
  date instead of a random dead zone in the calendar.
- A lightweight engagement scoring layer that gives each day a `1-100` celebration
  score based on built-in celebration priority, category, official holiday status, and
  interesting theme-day matches.
- Visible celebration categories in the UI, reused from the shared celebration rule
  definitions.
- A `Dagens ursäkt att fika` panel with a fika item, a fika score, and a short excuse
  note that fits the selected day.

## Main files

- `fredagskoll-frontend/src/features/engagement/engagement.ts`
- `fredagskoll-frontend/src/components/EngagementPanel.tsx`
- `fredagskoll-frontend/src/components/IntroPanel.tsx`
- `fredagskoll-frontend/src/components/MainCelebrationCard.tsx`
- `fredagskoll-frontend/src/components/AppMainColumn.tsx`
- `fredagskoll-frontend/src/hooks/useAppShellState.ts`
- `fredagskoll-frontend/src/features/engagement/engagement.test.ts`

## Notes

- The surprise button is weighted toward stronger dates, not just random picks.
- The scoring layer is intentionally simple. It is meant to support better product
  behavior and future ranking, not to become a giant rules engine.
- Categories now have a real UI surface, which gives later browsing/filtering work a
  clearer base to build on.
