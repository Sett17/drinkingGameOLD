cacheName = '#BUILDNUMBER#'
const toCache = [
	'index.html',
	'index.html?page=startmenu',
	'?page=startmenu',
	'index.html?page=pregame',
	'?page=pregame',
	'index.html?page=play',
	'?page=play',
	'main.js',
	'helpers.js',
	'options.js',
	'style.css',
	'manifest.webmanifest',
	'assets/cards.js',
	'assets/icon-ios.png',
	'assets/icon.webp',
	'assets/icon.png',
	'assets/maskable_icon.png',
	'assets/SF-UI-Text-Regular.otf',
	'compos/card.compo',
	'compos/play.compo',
	'compos/pregame.compo',
	'compos/startmenu.compo',
	'compos/options.compo',
]

self.addEventListener('install', (e) => {
	console.log('[Service Worker] Install');
	e.waitUntil((async () => {
		const cache = await caches.open(cacheName);
		console.log('[Service Worker] Caching all: app shell and content');
		await cache.addAll(toCache);
	})());
});

self.addEventListener('fetch', (e) => {
	e.respondWith((async () => {
		const r = await caches.match(e.request);
		console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
		if (r) { return r; }
		const response = await fetch(e.request);
		const cache = await caches.open(cacheName);
		console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
		cache.put(e.request, response.clone());
		return response;
	})());
});

self.addEventListener('activate', (e) => {
	e.waitUntil((async () => {
		const keyList = await caches.keys();
		await Promise.all(keyList.map((key) => {
			if (key === cacheName) { return; }
			await caches.delete(key);
		}))
	})());
});