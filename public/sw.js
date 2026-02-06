const CACHE_NAME = 'taraweeh-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/',
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
      // إرجاع من الـ Cache إن وجدت
      if (response) {
        return response;
      }

      // محاولة الحصول من الإنترنت وتخزين في الـ Cache
      return fetch(event.request)
        .then((response) => {
          // تحقق من أن الاستجابة صحيحة
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // عمل نسخة من الاستجابة
          const responseToCache = response.clone();

          // تخزين في الـ Cache (تجاهل الأخطاء)
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {
              // تجاهل أخطاء التخزين
            });
          });

          return response;
        })
        .catch(() => {
          // إذا فشل الإنترنت والـ Cache، عودة إلى صفحة خطأ
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
