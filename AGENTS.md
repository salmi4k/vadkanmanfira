# Vad kan man fira? Agent Notes

## Scope

- This repo is now primarily a React + TypeScript frontend in
  `fredagskoll-frontend`.
- Media files such as `.gif`, `.png`, `.jpg`, and `.webp` are intentionally
  committed because they are part of the app experience.
- The app has two content packs:
  - `public` is the default and should stay safe for public deployment
  - `team` contains private recurring weekday lore and the Mojo branding
- `main` is intended to deploy both variants from the same codebase with
  different `REACT_APP_CONTENT_PACK` values.

## Runbook

- Run the frontend from `fredagskoll-frontend` with `npm start`.
- The frontend day classification lives in
  `fredagskoll-frontend/src/dayLogic.ts`.
- Content-pack boundaries live in
  `fredagskoll-frontend/src/contentPack.ts`.
- Use `CI=true npm test -- --runInBand` semantics when sandboxed test runners
  complain about watch mode or process spawning.

## Cross-file conventions

- If you add or rename a built-in celebration, update both
  `fredagskoll-frontend/src/dayLogic.ts` and
  `fredagskoll-frontend/src/celebrations.ts`.
- If a change is team-only, keep it behind the `team` content pack instead of
  leaking it into the shared public default.
- Keep date formatting, holiday presentation, and other pure helpers out of
  `App.tsx` when practical.
- Keep frontend tests aligned with the day classification rules. The current
  tests inject fixed dates through the `initialDate` prop.

## Change discipline

- Favor small, explicit changes. This project is simple enough that extra
  abstraction usually adds more maintenance cost than value.
- Review your own diff critically before committing or pushing. Check for
  broken text encoding, obvious UI regressions, naming drift, and copy that
  does not actually read the way it is intended to in the app.
- Do not ship unreviewed string or UI changes just because the code compiles.
  For user-visible changes, at minimum inspect the rendered result and the
  final changed files before committing.
