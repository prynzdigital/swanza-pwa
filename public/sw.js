// Swanza Service Worker — offline shell caching
// Cache strategy: cache-first for shell assets, network-first for API calls.
// Version: 1.0.0

const CACHE_NAME = "swanza-shell-v1";

// App shell — static assets to cache on install
const SHELL_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Remove old cache versions
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests and API/auth calls
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/sign-")) return;

  // Network-first for navigation (HTML pages) — fall back to offline shell
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/").then((cached) => cached ?? new Response("Offline", { status: 503 }))
      )
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Cache successful static asset responses
        if (
          response.ok &&
          (request.url.includes("/_next/static/") ||
            request.url.includes("/icons/") ||
            request.url.endsWith(".css") ||
            request.url.endsWith(".js"))
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      });
    })
  );
});
