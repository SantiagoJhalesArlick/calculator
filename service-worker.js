const CACHE_NAME = 'trade-simple-v2'; // Version updated for fresh cache
const urlsToCache = [
    '/', // Cache the root path
    '/index.html',
    '/logo.png',
    '/manifest.json', // Added the manifest file to cache
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11' // Added SweetAlert2 for offline use
];

// Install Event: Caches all necessary assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching assets');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Service Worker: Failed to cache assets:', err);
      })
  );
});

// Fetch Event: Serves files from cache first (Cache-First Strategy)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate Event: Cleans up old caches (to prevent outdated files from accumulating)
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache: ' + cacheName);
            return caches.delete(cacheName); 
          }
        })
      );
    })
  );
});