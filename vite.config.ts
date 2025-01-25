export default {
  base: './',  // Use relative paths for assets
  build: {
    outDir: 'docs',  // Use docs/ instead of default dist/ to make it work more easily with Github Pages
    rollupOptions: {
      input: {
        main: 'index.html',
        planning: 'planning/index.html',
        binoculars: 'binoculars/index.html',
        sneak: 'sneak/index.html',
        battlefield: 'battlefield/index.html',
      },
    },
  },
};