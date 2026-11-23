# drone/

Mission-monitoring visual: glowing operator dots patrol a photorealistic 3D
map (streets, trees, buildings) rendered with [3d-tiles-renderer](https://github.com/NASA-AMMOS/3DTilesRendererJS)
on top of three.js, graded into a dark tactical night look on top of the
(daylight-captured) imagery.

Requires an API key/token, since the 3D tiles are streamed from a paid map
provider (Apple Maps has no public API for this kind of data, so this only
works with Google's Photorealistic 3D Tiles):

1. Copy `.env.local.example` to `.env.local` (already gitignored).
2. Fill in `VITE_ION_KEY` with a free [Cesium Ion](https://ion.cesium.com) access token — every account gets Google's Photorealistic 3D Tiles available by default (asset id `2275207`), no billing needed to start. Alternatively set `VITE_GOOGLE_MAPS_API_KEY` to stream directly from the Google Maps Platform Map Tiles API (requires billing).
3. `npx vite` and open `/drone/`.

To point it at a different real-world location, change `SITE_LAT`/`SITE_LON`
in `drone/constants.ts`, then orbit the scene and adjust the illustrative
patrol routes in `drone/mission.ts` to match the actual streets/cover.

Because this is a static site, whatever key is present at build time gets
bundled into the published JS. Restrict the key/token (HTTP referrer or Ion's
domain allowlist) regardless of how it's supplied, since it will still be
plain-text-readable in the published bundle. The token is only ever baked in
at build time (`.env.local` locally, an environment secret in CI, see below)
— it's never carried in a URL.

### Github Pages deploy

The `gh-pages.yml` workflow builds with a `github-pages` [Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
so `VITE_ION_KEY` doesn't have to live in `.env.local` to be picked up by the
deployed site:

1. Repository > Settings > Environments > New environment, name it
   `github-pages` (matches the `environment:` value in `gh-pages.yml`).
2. Add an environment secret named `VITE_ION_KEY` with your Cesium Ion token.
3. Push to `main` — the workflow's build step passes the secret in as
   `VITE_ION_KEY`, so `import.meta.env.VITE_ION_KEY` picks it up the same way
   a local `.env.local` would.

## Mission via URL

Instead of (or in addition to) baking location/paths into the build,
`drone/` accepts them as URL query params, resolved once in
`drone/urlParams.ts` and preferred over the `constants.ts`/`mission.ts`
defaults when present:

- `coord` — site origin, as `lat,lon`, overrides `SITE_LAT`/`SITE_LON`
- `paths` — operator trajectories, as JSON `[[[east,north],...], ...]` (one
  array of `[east, north]` pairs per operator) — e.g.
  `?paths=[[[-48.9,15.1],[-43.6,25.4]]]`
- `brightness` — overall brightness multiplier, independent of `vibe`
  (default `1`, clamped to `0.25`–`3`), e.g. `?brightness=1.5`. Also
  adjustable live with Alt+- / Alt+=, and saved by the path editor.

This makes a "mission" fully shareable as one URL — no rebuild needed to hand
someone a different location/route, and any number of missions can exist as
different links instead of different files.

### Jump to a location from Google Maps

Copy a Google Maps URL (or a plain `lat, lon` pair) and press Ctrl+V (Cmd+V
on macOS) on the gallery or in the scene. `drone/geoPaste.ts` extracts the
coordinates (the place pin `!3d…!4d…` if present, else the `@lat,lon` view
centre, else `?q=`/`?query=`/`?ll=`) and reloads with them as `coord`.
`paths`, `rotation` and `groundY` are dropped since they belong to the old
site, so the path editor opens; `vibe`, `brightness`, `hud`, `alt` and `names` are kept.
Short links (`maps.app.goo.gl/…`) aren't supported — open them first and
copy the full URL from the address bar.
