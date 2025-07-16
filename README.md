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
