# TSAM

Visuals generator for [@TacticalStealthAmbientMusic](https://www.youtube.com/@TacticalStealthAmbientMusic).

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

- Build into _docs/_ folder (using _docs/_ instead of default _dist/_ to make it work more easily with Github Pages)
  ```
  npx vite build 
  ```
  - For configuration, see _vite.config.js_