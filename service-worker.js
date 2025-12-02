const CACHE_NAME = "hutan-kartun-v1";

const ASSETS = [
  "./", 
  "./index.html",
  "./style.css",
  "./app.js",

  // karakter ayam
  "./chicken-walking.gif",

  // ikon pwa
  "./icon-192.png",
  "./icon-512.png"
];

// Install SW → cache semua asset
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Fetch → ambil dari cache dulu
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});

// Update cache kalau ada versi baru
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

