# TSAM

# Installation

- Install [Node.js](https://nodejs.org/)
- Install THREE.js and [Vite](https://vitejs.dev/) (build tool for development) using `npm`
  ```
  # three.js
  npm install --save three

  # vite
  npm install --save-dev vite
  ```

# Run

- Run locally
  ```
  npx vite
  ```

# Deploy

- Build into _docs/_ folder (using _docs/_ instead of default _dist/_ to make it work more easily with Github Pages)
  ```
  npx vite build --outDir docs
  ```