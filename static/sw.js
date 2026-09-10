const VERSION = 'ccawmu-v4';
const PAGES = VERSION + '-pages';
const ASSETS = VERSION + '-assets';

self.addEventListener('install', event => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys()
			.then(names => Promise.all(
				names.filter(name => name !== PAGES && name !== ASSETS)
					.map(name => caches.delete(name))
			))
			.then(() => self.clients.claim())
	);
});

function put(cacheName, request, response) {
	if (response && response.ok) {
		const copy = response.clone();
		caches.open(cacheName).then(cache => cache.put(request, copy));
	}
	return response;
}

function networkFirst(request) {
	return fetch(request)
		.then(response => put(PAGES, request, response))
		.catch(() => caches.match(request).then(hit => hit || caches.match('/')));
}

function cacheFirst(request) {
	return caches.match(request).then(hit => hit || fetch(request).then(response => put(ASSETS, request, response)));
}

self.addEventListener('fetch', event => {
	const request = event.request;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (url.origin !== location.origin) return;
	if (url.pathname.startsWith('/api/')) return;

	if (request.mode === 'navigate') {
		event.respondWith(networkFirst(request));
		return;
	}

	if (/^\/(css|js|fonts|images)\//.test(url.pathname) || /^\/minutes\/(css|js)\//.test(url.pathname)) {
		event.respondWith(cacheFirst(request));
	}
});
