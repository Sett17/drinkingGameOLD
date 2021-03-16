var CACHE = '#BUILDNUMBER#'

self.addEventListener('install', function (evt) {
	console.log('The service worker is being installed.')
	evt.waitUntil(precache())
})

self.addEventListener('fetch', function (evt) {
	console.log('The service worker is serving the asset.')
	evt.respondWith(fromCache(evt.request))
	evt.waitUntil(update(evt.request))
})

function precache() {
	return caches.open(CACHE).then(function (cache) {
		return cache.addAll([
			'./assets/SF-UI-Text-Regular.otf',
			'./assets/bottle.svg',
			'./assets/cards.js',
			'./assets/down_arrow.svg',
			'./assets/icon-ios.png',
			'./assets/icon.png',
			'./assets/icon.webp',
			'./assets/maskable_icon.png',
			'./compos/card.compo',
			'./compos/options.compo',
			'./compos/play.compo',
			'./compos/pregame.compo',
			'./compos/startmenu.compo',
			'./helpers.js',
			'./index.html',
			'./main.js',
			'./options.js',
			'./style.css',
		])
	})
}

function fromCache(request) {
	return caches.open(CACHE).then(function (cache) {
		return cache.match(request).then(function (matching) {
			return matching || Promise.reject('no-match')
		})
	})
}

function update(request) {
	return caches.open(CACHE).then(function (cache) {
		return fetch(request).then(function (response) {
			return cache.put(request, response)
		})
	})
}