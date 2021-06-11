const CACHE_DATE = "offline-data";
const STATIC_RESOURCES = ["index.html", "app.js", "favicon.ico", "logo192.png"];

self.addEventListener("install", async (e) => {
	console.log("SW installed");

	e.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_DATE);

			return await cache.addAll(STATIC_RESOURCES);
		})()
	);

	self.skipWaiting();
});

self.addEventListener("fetch", async (e) => {
	console.log(`SW fetch: ${e.request.url}`);

	e.respondWith(
		(async () => {
			const cache = await caches.open(CACHE_DATE);

			try {
				const networkResponse = await fetch(e.request);
				await cache.put(e.request, networkResponse.clone());

				return networkResponse;
			} catch (err) {
				const cachedResponse = await cache.match(e.request);

				return cachedResponse;
			}
		})()
	);
});

self.addEventListener("activate", async (e) => {
	console.log("SW activated");
});
