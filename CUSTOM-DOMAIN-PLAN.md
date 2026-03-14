# Step 5: Custom Domain And Branding Plan

## Goal

Replace the random Azure hostname with a real domain and tighten the public-facing branding so the app looks intentional instead of accidentally deployed.

## Recommended direction

- keep Azure Static Web Apps
- use a short Swedish domain or subdomain
- keep `fredagskoll` as the product name unless a better one appears that is not embarrassing

## Suggested rollout

1. Pick the public address.
   - Best case: a dedicated domain like `fredagskoll.se`
   - Simpler case: a subdomain on something you already control, like `fredagskoll.<your-domain>`

2. Decide the branding baseline.
   - confirm product name
   - confirm one short tagline
   - decide whether `Mojo` stays visible or whether `fredagskoll` stands on its own
   - produce final favicon/app icon set and OG image

3. Wire the custom domain in Azure Static Web Apps.
   - add the custom domain in the Azure resource
   - create the required DNS record
   - wait for validation
   - verify HTTPS certificate issuance

4. Update the frontend metadata.
   - final `title`
   - `meta description`
   - Open Graph tags
   - manifest name/short name
   - favicon references

5. Add a tiny release checklist.
   - live URL responds
   - merged `main` deploys correctly
   - favicon shows up
   - social preview is sane
   - no mixed branding left in text or assets

## Concrete prep work before touching DNS

- verify who owns the domain or DNS zone
- verify whether Cloudflare, registrar DNS, or Azure DNS is the source of truth
- prepare:
  - `favicon.ico`
  - `favicon.png`
  - `apple-touch-icon.png`
  - social preview image around `1200x630`

## Likely implementation tasks

- replace the remaining generic metadata in `fredagskoll-frontend/public/index.html`
- update `fredagskoll-frontend/public/manifest.json`
- add final social preview asset in `fredagskoll-frontend/public/`
- optionally add a tiny footer link to the public domain once it exists

## Risks

- DNS ownership is often the slowest part because someone always half-remembers where the zone lives
- favicon and social preview caching are annoying and make clean launches look broken
- if the name changes late, some current assets and copy will need another pass

## Definition of done

- app is reachable on the chosen custom domain
- Azure default hostname is no longer the URL you hand to humans
- branding is consistent across page title, icon, manifest, and share preview
