const CACHE_NAME = 'universal-tool-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/global.css',
  '/css/variables.css',
  '/css/components.css',
  '/js/theme-manager.js',
  '/js/shared-ui.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
