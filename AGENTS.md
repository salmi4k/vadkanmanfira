# Fredagskoll Agent Notes

## Scope

- This repo is now primarily a React + TypeScript frontend in
  `fredagskoll-frontend`.
- Media files such as `.gif`, `.png`, `.jpg`, and `.webp` are intentionally
  committed because they are part of the app experience.

## Runbook

- Run the frontend from `fredagskoll-frontend` with `npm start`.
- The frontend day classification lives in
  `fredagskoll-frontend/src/dayLogic.ts`.
- Use `CI=true npm test -- --runInBand` semantics when sandboxed test runners
  complain about watch mode or process spawning.

## Cross-file conventions

- If you add or rename a built-in celebration, update both
  `fredagskoll-frontend/src/dayLogic.ts` and
  `fredagskoll-frontend/src/celebrations.ts`.
- Keep date formatting, holiday presentation, and other pure helpers out of
  `App.tsx` when practical.
- Keep frontend tests aligned with the day classification rules. The current
  tests inject fixed dates through the `initialDate` prop.

## Media tool

- `tools/MeatWednesdayGifGen` generates animated assets from a source image
  using ImageSharp. Prefer extending that tool instead of rewriting ad hoc
  media-generation code in the app.

## Change discipline

- Favor small, explicit changes. This project is simple enough that extra
  abstraction usually adds more maintenance cost than value.
