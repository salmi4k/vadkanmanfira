# Quickstart: Testing AI Observability

## Local development

1. Work on branch `001-ai-observability`.
2. Start the frontend from `fredagskoll-frontend`:

```powershell
npm start
```

3. Run focused tests while iterating:

```powershell
npm test -- src/App.test.tsx src/features/ai/useAiContent.test.tsx
```

4. Run a production build before finishing:

```powershell
npm run build
```

## Implementation focus

- Extend the frontend AI state so the UI can distinguish:
  - current resolved source
  - current reroll loading state
  - latest reroll outcome
- Gate the observability treatment to the dedicated testing environment only.
- Keep the visible treatment secondary to the main blurb and reroll action.

## Rendered verification

1. Open the dedicated testing deployment.
2. Load a date that uses AI-backed content.
3. Confirm the page shows the resolved source after content settles.
4. Press `Ny ursäkt`.
5. Confirm the page shows:
   - a reroll-in-progress state
   - a final reroll outcome once settled
6. Verify the normal production-like public surface does not show the same
   observability treatment.

## Completion criteria

- Hook and app tests pass.
- Build passes.
- Rendered verification passes in the testing environment.
- No testing-only observability leaks into the normal production public surface.
