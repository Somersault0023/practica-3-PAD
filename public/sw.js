// Nombre del caché
const CACHE_NAME = 'pwa-cache-v1';

// Archivos a cachear
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/main.js',
  '/images/logo.png',
  'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
  '/index.html',
  'https://www.googleapis.com/books/v1/volumes'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => { return cache.addAll(urlsToCache); })
  );
});

// Intercepta la solicitud
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) { return response; }
        return fetch(event.request);
      })
  );
});
