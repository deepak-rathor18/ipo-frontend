// FinTrack service worker
//
// Rules (see FINTRACK spec sections 36-38):
//  - Cache the static app shell and non-sensitive static assets.
//  - NEVER cache API responses (auth, IPO, money, repayments, dashboard, reports).
//    All /api/* requests are always network-only.
//  - Cache versioning: bumping CACHE_VERSION invalidates old caches on activate.
//  - No blind "cache everything" strategy.

const CACHE_VERSION = "fintrack-v1";
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL_URLS = [
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_URLS))
    // Intentionally no self.skipWaiting() here — a newly installed worker stays
    // "waiting" until the user confirms the "New version available" prompt,
    // so we never unexpectedly refresh someone mid-form.
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("fintrack-") &&
                key !== APP_SHELL_CACHE &&
                key !== RUNTIME_CACHE
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isApiRequest(url) {
  // Never cache anything under /api — auth, IPO, money, repayments, dashboard,
  // reports and exports are all financial or auth data and must always hit the network.
  return url.pathname.startsWith("/api/");
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.json" ||
    url.pathname.startsWith("/_next/static/")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // never intercept mutations

  const url = new URL(request.url);

  // Cross-origin (e.g. the separate backend API host) — always network, never cached.
  if (url.origin !== self.location.origin) return;

  if (isApiRequest(url)) {
    // Network-only. Sensitive financial/auth data is never served from cache.
    event.respondWith(fetch(request));
    return;
  }

  if (isStaticAsset(url)) {
    // Cache-first for immutable static assets, populating the runtime cache
    // the first time each asset is actually fetched.
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  // App shell / page navigations: network-first so users always see fresh,
  // non-sensitive UI, but each successful response is cached so the shell
  // for pages already visited can still open when offline.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches
          .match(request)
          .then((cached) => cached || caches.match("/offline"))
      )
  );
});
