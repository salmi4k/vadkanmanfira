# Text Surface Audit

Date: 2026-03-15

## Goal

Mood should not control every string in the app.

The app has two different text systems:

- Stable UI copy: labels, buttons, navigation, settings, helper text
- Editorial copy: blurbs, narrative notes, fallback prose, celebratory lines

Only the editorial layer should become mood-aware.

## Stable UI Copy

These should remain locale-driven and structurally stable.

### Primary sources

- `fredagskoll-frontend/src/appText.ts`
- `fredagskoll-frontend/src/App.tsx`

### Keep stable

- Navigation labels
- Picker labels
- Buttons and toggles
- Dialog and credits labels
- Section headers
- Build/version labels
- Accessibility and explanatory helper text
- Error/loading/status text that is operational rather than editorial

### Why

If mood affects the app chrome, the product voice starts shifting in places where users expect consistency. That creates noise rather than personality.

## Mood-Aware Editorial Copy

These are the visible text surfaces that actually define tone. If mood only affects AI blurbs, the feature will feel partial because the rest of the app still speaks in the existing dry house voice.

### High priority

- `fredagskoll-frontend/src/appText.ts`
  - `ordinaryTitle`
  - `ordinaryThemeDayLead`
  - `ordinaryNoHitBody`
  - `asIfThatWasNotEnough`
  - `ordinaryThemeDayTitleEndingsByLocale`
  - `ordinaryThemeDayCardNotesByLocale`
- `fredagskoll-frontend/src/celebrations.ts`
  - celebratory/fallback blurbs
- `fredagskoll-frontend/src/aiBlurbs.ts`
  - request model already carries mood
- `api/shared/prompt.js`
  - prompt guidance already carries mood

### Medium priority

- `fredagskoll-frontend/src/themeDaySpecificBlurbs.ts`
  - hand-written override blurbs for named theme days
- `fredagskoll-frontend/src/themeDayCategoryBlurbs.ts`
  - category-based fallback blurbs
- `fredagskoll-frontend/src/themeDayDynamicBlurbs.ts`
  - dynamic multi-theme narrative blurbs
- `fredagskoll-frontend/src/upcomingNotables.ts`
  - narrative notes for upcoming notable dates
- `fredagskoll-frontend/src/seasonalNotes.ts`
  - seasonal narrative notes
- `fredagskoll-frontend/src/nationalDays.ts`
  - country/day narrative framing where it is editorial rather than raw factual data

### Why

These files are where the app currently sounds like itself. They contain the "dry, resigned, lightly amused" editorial voice. If mood support is real, these surfaces need a route to choose variants by mood.

## Mostly Factual Or Leave-Alone Text

These should not be rewritten aggressively for mood.

- Raw holiday or date names
- Country names
- Locale names
- Theme-day source data
- Structured metadata labels
- Image/source attribution text
- External references or citations

Mood can wrap these with editorial framing, but should not mutate the factual values themselves.

## Recommended Model

Use a shared frontend `Mood` type and pass it only into content-producing functions.

### Layer split

- `UI copy`
  - locale-driven
  - stable
  - no mood input
- `Editorial copy`
  - locale-driven
  - mood-aware
  - can fall back to `dry`

### Implementation shape

Prefer functions over giant nested dictionaries where practical.

Examples:

- `getOrdinaryThemeDayLead(locale, mood)`
- `getCelebrationBlurb(locale, mood, context)`
- `getThemeDaySpecificBlurbs(themeDay, locale, mood)`
- `buildThemeDayDynamicBlurbs(themeDays, locale, mood, displayThemeDays)`

This is better than trying to make every string table in `appText.ts` mood-indexed immediately.

## Rollout Order

### Phase 1

Wire mood into the highest-visibility editorial fallbacks:

- ordinary fallback prose in `appText.ts`
- celebration blurbs
- theme-day specific/category/dynamic blurbs

This gives the user a visible change on most screens.

### Phase 2

Extend mood into secondary narrative surfaces:

- `upcomingNotables.ts`
- `seasonalNotes.ts`
- editorial framing inside `nationalDays.ts`

### Phase 3

Clean up duplication by extracting reusable tone helpers:

- dry
- cheerful
- formal
- absurd
- later: warm, chaotic

Do not start with all moods everywhere. Ship a smaller set cleanly.

## Product Boundary

Mood should describe the editorial tone of the content, not the personality of the entire interface.

Good:

- "today's card note sounds more cheerful"
- "theme-day blurbs are more absurd"

Bad:

- buttons, toggles, or menus changing voice
- inconsistent operational copy
- factual content rewritten into character bits

## Conclusion

Yes, the app needs broader text handling than "AI blurbs only".

No, it should not make every field mood-aware.

The correct boundary is:

- stable UI copy stays stable
- editorial copy becomes mood-aware
- factual/source text remains factual
