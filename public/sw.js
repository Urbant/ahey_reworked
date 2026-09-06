const currentCacheName = "naberesh-v3";
self.addEventListener("install", event => { event.waitUntil(self.skipWaiting()); });
self.addEventListener("activate", event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== currentCacheName).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
// Calls, conference pages and temporary ICE credentials always require the network.
self.addEventListener("fetch", event => {
 if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
 event.respondWith(fetch(event.request));
});
