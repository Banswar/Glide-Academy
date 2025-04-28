
// <!-- Service Worker File - Normally this would be in a separate file -->
/* <script> */
    // This script simulates the content of /sw.js
    // In a real deployment, this would be a separate file at the root of your site
    
    // When actually implementing, save the following code to a file named sw.js
    // at the root of your website:
    
    
    const CACHE_NAME = 'glide-academy-v1';
    const urlsToCache = [
        '/',
        'index.html',
        'style.css',
        'script.js',
        // Add paths to all your assets, images, etc.
    ];

    // Install event - cache assets
    self.addEventListener('install', function(event) {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then(function(cache) {
                    console.log('Cache opened');
                    return cache.addAll(urlsToCache);
                })
        );
    });

    // Activate event - clean up old caches
    self.addEventListener('activate', function(event) {
        event.waitUntil(
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.filter(function(cacheName) {
                        return cacheName !== CACHE_NAME;
                    }).map(function(cacheName) {
                        return caches.delete(cacheName);
                    })
                );
            })
        );
    });

    // Fetch event - serve from cache or network
    self.addEventListener('fetch', function(event) {
        event.respondWith(
            caches.match(event.request)
                .then(function(response) {
                    // Cache hit - return the response from the cached version
                    if (response) {
                        return response;
                    }
                    
                    // Not in cache - return the result from the live server
                    // Clone the request because it's a one-time use
                    var fetchRequest = event.request.clone();
                    
                    return fetch(fetchRequest)
                        .then(function(response) {
                            // Check if valid response
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }
                            
                            // Clone the response because it's a one-time use
                            var responseToCache = response.clone();
                            
                            caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                });
                                
                            return response;
                        })
                        .catch(function() {
                            // Network request failed, try to return a fallback
                            return caches.match('/offline.html');
                        });
                })
        );
    });
    
