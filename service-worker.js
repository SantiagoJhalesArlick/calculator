const CACHE_NAME = 'risk-calculator-cache-v1'; // <-- IMPORTANT: Increment this version number when you update your code!
const urlsToCache = [
  '/calculator/', // Cache the index page when accessed without the file name
  '/calculator/index.html', // The main file
  '/calculator/logo.png', // The custom logo image
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' // External CSS (Font Awesome)
];

// Install Event: Caches all necessary assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching assets');
        // Add all required files to the cache
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
        // Cache hit - return response (This enables offline use)
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
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
          // If the cache name is NOT in the whitelist, delete it
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache: ' + cacheName);
            return caches.delete(cacheName); 
          }
        })
      );
    })
  );
});