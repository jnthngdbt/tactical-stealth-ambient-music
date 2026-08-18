# TSAM

https://jnthngdbt.github.io/tactical-stealth-ambient-music/

Visuals experiments for [@TacticalStealthAmbientMusic](https://www.youtube.com/@TacticalStealthAmbientMusic).

# Installation

- Install [Node.js](https://nodejs.org/)
- Install [Three.js](https://threejs.org/) and [Vite](https://vitejs.dev/) (build tool for development) using `npm`
  ```
  # three.js
  npm install --save three

  # vite
  npm install --save-dev vite
  ```

# Run

- Build and run a local server
  ```
  npx vite
  ```
- Launch with vscode using F5 (opens browser and debugging is enabled)

# Deploy

## Automated Github Actions

- The Github Actions workflow is defined in _.github/worklows/gh-pages.yml_
  - At each push in `main` branch, it builds using `npx vite build`
  - Build artifacts are pushed in branch `gh-pages`
    - Branch only contains build files in _root_
- Github Pages is configured to deploy branch `gh-pages` from _root_ folder
  - See [Repository > Settings > Pages](https://github.com/jnthngdbt/tactical-stealth-ambient-music/settings/pages)

## Manually (_not used anymore_)

- Build into _docs/_ folder (using _docs/_ instead of default _dist/_ to make it work more easily with Github Pages)
  ```
  npx vite build 
  ```
  - For configuration, see _vite.config.js_
- Push the changes

# Pages

## overwatch/

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
domain allowlist) before wiring it into the Github Pages deploy, and only add
it as a repo secret to the Actions workflow if you're fine with it being
usable by anyone visiting the published page.
