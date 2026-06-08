/* 盛夏三日漫旅 — 離線快取 Service Worker
   策略：network-first，成功就更新快取；離線時改用快取。
   首次連線載入後，之後沒網路也能開啟行程（天氣與地圖仍需網路）。 */
const CACHE = 'trip-cache-v1';

self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        try {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        } catch (_) {}
        return res;
      })
      .catch(() => caches.match(req))
  );
});
