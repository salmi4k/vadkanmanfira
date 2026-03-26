# Design Philosophy

This project should feel intentional, opinionated, calm, and finished.
It is not trying to look like a generic web app with a calendar attached. It
should feel like a product with taste, restraint, and a clear point of view.

## Core principles

### Simplicity is the ultimate sophistication

Remove anything that does not clearly help the user understand the day, the
reason it matters, or what to do next.

- prefer one clear path over several maybe-useful ones
- if a control, label, or panel feels optional, it probably is
- reduce explanation before adding explanation
- make the default experience understandable at a glance

The best interface here is one that does not ask the user to think about the
interface at all.

### Opinions are features

This product should make choices instead of outsourcing them to the user.

- avoid option overload and defensive "just in case" controls
- prefer curated editorial choices over exhaustive presentation
- choose the most relevant celebration or framing instead of exposing internal
  ranking noise
- make the right default visible and commit to it

When there is a tradeoff between flexibility and clarity, bias toward clarity.

### The detail is the product

Small visual and textual decisions are not polish layered on afterward. They
are the product.

- spacing, type scale, contrast, motion timing, and border treatment matter
- user-visible copy should read like it was chosen, not merely generated
- loading, empty, and transition states should feel deliberate and calm
- visual hierarchy should be precise enough that the user knows what matters
  without being told

If a detail feels sloppy, the experience is sloppy.

### Materials, not flat surfaces

The UI should feel layered and physical rather than boxed and flat.

- use translucency, blur, depth, and layered surfaces where they improve focus
- let cards and panels feel like surfaces in space, not heavy containers
- motion should reinforce material behavior rather than decorate the page
- chrome should recede behind the content instead of trapping it

Use these tools with restraint. The goal is depth and atmosphere, not visual
noise.

### Content is king

The content is the point. UI exists to reveal it clearly and gracefully.

- brand, controls, and supporting panels should serve the daily result
- visual framing should never compete with the main celebration or blurb
- typography and layout should help the writing land cleanly
- extra metadata should stay secondary unless it directly helps the moment

The interface should feel like it emerges around the content, not like the
content was inserted into a frame.

## How this applies to Fredagskoll

### Calm over clutter

The app should feel composed, not busy. If several elements compete for
attention, remove or subordinate the weaker ones.

### Strong defaults over exposed machinery

The internal logic can be complex, but the UI should not advertise that
complexity. Users should see the best answer, not the decision tree.

### Tone through the whole surface

Mood is not only text. Color, shape, spacing, contrast, and motion should help
the selected tone feel coherent across the whole experience.

### Editorial judgment matters

This product already has a dry, amused, opinionated voice. Design decisions
should support that voice by feeling confident, understated, and intentional,
not generic or overly configurable.

### Public and team should both feel designed

The `public` and `team` packs can differ in branding and content, but both
should feel equally deliberate. Team-only lore must stay properly scoped, but
it should not look like a second-class variant.

## Working rules

- add UI only when it materially improves comprehension or flow
- prefer fewer, better controls
- test visible changes in the rendered app, not only in code
- treat copy, spacing, and motion regressions as product regressions
- avoid generic web-app framing when a more product-shaped solution is possible
