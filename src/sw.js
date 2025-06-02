// src/sw.js
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

if (workbox) {
  console.log("Workbox berhasil dimuat");

  // PENTING: Gunakan self.__WB_MANIFEST hanya SEKALI
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Cache API calls
  workbox.routing.registerRoute(
    ({ url }) => url.origin === "https://story-api.dicoding.dev",
    new workbox.strategies.NetworkFirst({
      cacheName: "story-api-cache",
    })
  );

  // Cache images
  workbox.routing.registerRoute(
    ({ request }) => request.destination === "image",
    new workbox.strategies.CacheFirst({
      cacheName: "images-cache",
    })
  );
} else {
  console.log("Workbox gagal dimuat");
}

// Push notification handlers
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const notificationTitle = data.title || "Dicoding Story";
  const notificationOptions = {
    body: data.body || "Ada cerita baru!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
