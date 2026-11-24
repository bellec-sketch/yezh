const CACHE = "yezh-v10";
const FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./srsEngine.js",
  "./tutorsData.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./logo.svg",
  "./nina.jpg",
  "./pavel.jpg",
  "./sophie.jpg",
  "./louis.jpg",
  "./enora.jpg",
  "./yann.jpg",
  "./hana.jpg",
  "./haruto.jpg",
  "./mei.jpg",
  "./chen.jpg",
  "./layla.jpg",
  "./karim.jpg",
  "./reward-nina.jpg",
  "./reward-pavel.jpg",
  "./reward-sophie.jpg",
  "./reward-louis.jpg",
  "./reward-enora.jpg",
  "./reward-yann.jpg",
  "./reward-hana.jpg",
  "./reward-haruto.jpg",
  "./reward-mei.jpg",
  "./reward-chen.jpg",
  "./reward-layla.jpg",
  "./reward-karim.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
