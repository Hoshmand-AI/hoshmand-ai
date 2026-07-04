// Minimal service worker for the Saraf PWA. Enables install-to-home-screen
// and an offline app shell. Market data and orders always go to the network
// (never cached) so prices and trades are never stale.

const CACHE = "saraf-shell-v1";
const SHELL = ["/saraf", "/saraf/connections", "/saraf/risk", "/saraf-icon.svg", "/saraf.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Never cache API calls (prices, orders, status) — always live.
  if (url.pathname.startsWith("/api/")) return;

  // App shell / navigations: network first, fall back to cache when offline.
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("/saraf")))
  );
});
