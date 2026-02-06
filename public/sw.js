const CACHE_NAME = 'taraweeh-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // تجاهل الأخطاء في التخزين المؤقت للملفات الفردية
      });
    })
  );
  self.skipWaiting();
});

// تنشيط Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// استراتيجية Cache First مع Fallback للإنترنت
self.addEventListener('fetch', (event) => {
  // تجاهل الطلبات غير الـ GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const contentType = response.headers.get('content-type') || '';
          const isHtml = contentType.includes('text/html');
          const isDoc = event.request.destination === 'document';

          // Do not cache HTML responses for non-document requests (prevents HTML for JS)
          if (isHtml && !isDoc) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });

          return response;
        })
        .catch(() => {
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
    })
  );
});
