# Ecosystem Roadmap

Fredagskoll should behave like one opinionated daily object that can travel well.

## Product Rule

- One verdict worth opening.
- One card worth sending.
- One next date worth caring about.
- No feature farms.

## Best Next Builds

1. Scheduled Slack and Teams posting
   Use the integration endpoint as the final presentation layer and `platform=digest` as the low-cost automation layer.

2. Ambient app entry points
   PWA shortcuts, widgets, and simple notification/reminder entry points should lead into either `today` or `surprise`, not a menu of modes.

3. High-signal calendar feeds
   Prefer one “best upcoming” or “worth caring about” feed over exhaustive exports.

4. AI effort where it matters
   Spend Azure tokens on:
   - today
   - rerolls
   - dense collision dates
   - share-worthy celebrations

   Do not spend them on routine automation requests that can reuse cached/generated data.

## Free-Tier Azure Posture

- Azure OpenAI is for the verdict, not for plumbing.
- Azure Table Storage is the memory.
- Static generated integration data is the backbone.
- Chat platforms should consume prepared objects, not force fresh generation.

## Ecosystem Surfaces

- App: the main ritual
- Share card: the social object
- Slack/Teams: the workplace ritual
- Calendar: the planning surface
- Widget/shortcut: the ambient surface
