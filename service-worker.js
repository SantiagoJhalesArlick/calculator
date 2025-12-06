const CACHE_NAME = 'trade-simple-v1';
const urlsToCache = [
    '/', // Root path
    '/index.html',
    '/logo.png', // Assuming logo.png is also in the root
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

self.addEventListener('install', event => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // Serve cached content when offline
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // If not found in cache, fetch from network
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    // Delete old caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});