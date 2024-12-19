export default {
  base: './',  // Use relative paths for assets
  build: {
    outDir: 'docs',  // Use docs/ instead of default dist/ to make it work more easily with Github Pages
    rollupOptions: {
      input: {
        main: 'index.html',
        planning: 'scenes/planning/index.html',
        binoculars: 'scenes/binoculars/index.html',
      },
    },
  },
};