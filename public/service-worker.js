cacheName = 'cache-beta-v0.7'
// prettier-ignore
const toCache = {
	//what comes after url:           cache-first?  
	'index.html': false,      // true in depl
	'index.html?page=startmenu': false,      // -----""-----
	'?page=startmenu': false,      // -----""-----
	'index.html?page=pregame': false,      // -----""-----
	'?page=pregame': false,      // -----""-----
	'index.html?page=play': false,      // -----""-----
	'?page=play': false,      // -----""-----
	'main.js': false,      // -----""-----
	'helpers.js': false,      // -----""-----
	'options.js': false,      // -----""-----
	'style.css': true,       // -----""-----
	'manifest.webmanifest': true,       // -----""-----
	'assets/cards.js': false,      // always false
	'assets/icon-ios.png': true,       // always true
	'assets/icon.webp': true,       // ----"""----
	'assets/icon.png': true,       // ----"""----
	'assets/maskable_icon.png': true,       // ----"""----
	'assets/SF-UI-Text-Regular.otf': true,       // ----"""----
	'compos/card.compo': true,       // ----"""----
	'compos/play.compo': true,       // ----"""----
	'compos/pregame.compo': true,       // ----"""---- 
	'compos/startmenu.compo': true,       // ----"""----
	'compos/options.compo': true        // ----"""----
}

// service worker with dynamic strategy
self.addEventListener('fetch', (e) => {
	console.log(`[Service Worker] [Request] req to ${e.request.url}`)
	if (toCache[e.request.url.replace(e.request.referrer, '')]) {
		// if strategy in toCache is set to true, aka cache-first
		e.respondWith(
			caches.match(e.request).then((r) => {
				// r is a cache fetch response, including the file
				if (r) {
					// r is truish, so serve from cache
					console.log(`[Service Worker] [Respone] served ${e.request.url} from CACHE`)
					return r
				} else {
					// file is not cached, serve from web and cache it
					fetch(e.request).then((res) => {
						caches.open(cacheName).then((cache) => {
							cache.put(e.request, res.clone())
							console.log(`[Service Worker] [Respone] served ${e.request.url} from WEB`)
							console.log(`[Service Worker] [ Cache ] added  ${e.request.url} to the cache`)
							return res
						})
					})
				}
			})
		)
	} else {
		fetch(e.request).then((r) => {
			if (r) {
				console.log(`[Service Worker] [Respone] served ${e.request.url} from WEB`)
				caches.match(e.request).then((inCache) => {
					if (!inCache) {
						console.log(`[Service Worker] [ Cache ] added  ${e.request.url} to the cache`)
					}
				})
				return r
			} else {
				caches.match(e.request).then((res) => {
					console.log(`[Service Worker] [Respone] served ${e.request.url} from CACHE`)
					return res
				})
			}
		})
	}
})

// for removing unnecssary cached files, or so it said on stackoverflow. idc, it prolly works
self.addEventListener('activate', (e) => {
	e.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== cacheName) {
						return caches.delete(key)
					}
				})
			)
		})
	)
})

self.addEventListener('install', function (e) {
	self.skipWaiting()
	console.log('[Service Worker] Latest version installed!')
	e.waitUntil(
		caches.open(cacheName).then((cache) => {
			console.log('[Service Worker] Caching all: app shell and content')
			Object.keys(toCache).forEach((el) => {
				console.log(`  └►[Service Worker] ${el}`)
			})
			return cache.addAll(Object.keys(toCache))
		})
	)
})
