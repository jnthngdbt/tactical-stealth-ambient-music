# overwatch/

Mission-monitoring visual: glowing operator dots patrol a photorealistic 3D
map (streets, trees, buildings) rendered with [3d-tiles-renderer](https://github.com/NASA-AMMOS/3DTilesRendererJS)
on top of three.js, graded into a dark tactical night look on top of the
(daylight-captured) imagery.

Requires an API key/token, since the 3D tiles are streamed from a paid map
provider (Apple Maps has no public API for this kind of data, so this only
works with Google's Photorealistic 3D Tiles):

1. Copy `.env.local.example` to `.env.local` (already gitignored).
2. Fill in `VITE_ION_KEY` with a free [Cesium Ion](https://ion.cesium.com) access token — every account gets Google's Photorealistic 3D Tiles available by default (asset id `2275207`), no billing needed to start. Alternatively set `VITE_GOOGLE_MAPS_API_KEY` to stream directly from the Google Maps Platform Map Tiles API (requires billing).
3. `npx vite` and open `/overwatch/`.

To point it at a different real-world location, change `SITE_LAT`/`SITE_LON`
in `overwatch/constants.ts`, then orbit the scene and adjust the illustrative
patrol routes in `overwatch/mission.ts` to match the actual streets/cover.

Because this is a static site, whatever key is present at build time gets
bundled into the published JS. Restrict the key/token (HTTP referrer or Ion's
domain allowlist) regardless of how it's supplied, since it will still be
plain-text-readable in the published bundle.

### Github Pages deploy

The `gh-pages.yml` workflow builds with a `github-pages` [Environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
so `VITE_ION_KEY` doesn't have to live in `.env.local` or be passed as a
`?token=` URL param to be picked up by the deployed site:

1. Repository > Settings > Environments > New environment, name it
   `github-pages` (matches the `environment:` value in `gh-pages.yml`).
2. Add an environment secret named `VITE_ION_KEY` with your Cesium Ion token.
3. Push to `main` — the workflow's build step passes the secret in as
   `VITE_ION_KEY`, so `import.meta.env.VITE_ION_KEY` picks it up the same way
   a local `.env.local` would, and the published page works with no `?token=`
   needed.

A `?token=` in the URL (see below) still overrides whatever was baked in at
build time, so per-mission links can hand out a different/restricted token if
ever needed.

## Mission via URL

Instead of (or in addition to) baking a token/location/paths into the build,
`overwatch/` accepts them as URL query params, resolved once in
`overwatch/urlParams.ts` and preferred over the `.env.local`/`constants.ts`/
`mission.ts` defaults when present:

- `token` — Cesium Ion access token
- `lat` / `lon` — site origin, overrides `SITE_LAT`/`SITE_LON`
- `paths` — operator trajectories, as JSON `[[[east,north],...], ...]` (one
  array of `[east, north]` pairs per operator) — e.g.
  `?paths=[[[-48.9,15.1],[-43.6,25.4]]]`

This makes a "mission" fully shareable as one URL — no `.env.local` and no
rebuild needed to hand someone a different location/route, and any number of
missions can exist as different links instead of different files. Note this
doesn't make the token any more secret than the build-time approach above —
it's still plain text, just carried by the link instead of the JS bundle
(restrict the token the same way regardless). Since the Github Pages build
now bakes in `VITE_ION_KEY` from the `github-pages` environment secret (see
above), `?token=` is only needed to override that default for a specific
shared link, not to make the deployed page work at all. A future `data=`
param carrying a single encoded/encrypted blob (in place of these four
separate params) is the natural next step if that's ever needed.
