// Page entry point: with no query string at all, show the mission gallery
// (gallery.ts) instead of the 3D scene. main.ts is imported dynamically so
// none of its module-level side effects (renderer, tiles, URL parsing) run
// on the gallery page.
if (window.location.search === '') {
	import('./gallery.ts').then(({ showGallery }) => showGallery());
} else {
	import('./main.ts');
}
