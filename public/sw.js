
//////////////////////////////////////////////////////////////////////////////////
////////////////////////Cache naminig
/////////////////////////////////////////////////////////////////////////////////
var dynamicCache = "dynamic-cache";
var preCache = 'pre-cache';

/////////////////////////////////////////////////////////////////////////////////
/////////////////////File to pre-cache
/////////////////////////////////////////////////////////////////////////////////

var filesToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/js/app.js',
  '/src/css/style.css',
  'src/images/android-icon-36x36.png',
  'src/images/android-icon-48x48.png',
  'src/images/android-icon-72x72.png',
  'src/images/android-icon-96x96.png',
  'src/images/android-icon-144x144.png',
  'src/images/android-icon-192x192.png',
  'https://data.police.uk/api/crime-categories',
  'https://data.police.uk/api/forces',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
  'https://code.jquery.com/jquery-3.3.1.slim.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
  'https://unpkg.com/sweetalert/dist/sweetalert.min.js',
];

/////////////////////////////////////////////////////////////////////////////////
/////////////////////Service Worker Installation Event
/////////////////////////////////////////////////////////////////////////////////

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  self.skipWaiting();
  e.waitUntil(
    caches.open(preCache)
    .then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
////////////////////////////////////////////////////////////////////////////////
/////////////////////////Service Worker Activation Event
////////////////////////////////////////////////////////////////////////////////

self.addEventListener('activate', function(e) 
{
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) 
    {
      return Promise.all(keyList.map(function(key) 
      {
        if (key !== preCache) 
        {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  
  return self.clients.claim();
});
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////// Service Worker Fetch Event
/////////////////////////////////////////////////////////////////////////////////

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://data.police.uk/api/crimes-no-location';
  if (e.request.url.indexOf(dataUrl) !== -1) 
  {
    e.respondWith(async function() 
    {
      const cache = await caches.open(dynamicCache);
      const cachedResponse = await cache.match(e.request);
      const networkResponsePromise = fetch(e.request);

      e.waitUntil(async function() 
      {
        const networkResponse = await networkResponsePromise;
        await cache.put(e.request, networkResponse.clone());
      }());
      
      // Returned the cached response if we have one, otherwise return the network response.
      return cachedResponse || networkResponsePromise;
    }());
  } 
  else {
    e.respondWith(
      caches.match(e.request)
      .then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
