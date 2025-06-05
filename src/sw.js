importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

if (typeof workbox !== "undefined") {
  console.log("Workbox berhasil dimuat");

  // Precache dengan manifest yang di-generate
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  // API Cache Strategy
  workbox.routing.registerRoute(
    ({ url }) => url.origin === "https://story-api.dicoding.dev",
    new workbox.strategies.NetworkFirst({
      cacheName: "story-api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 hari
        }),
      ],
    })
  );

  // Image Cache Strategy (skip caching di development)
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment) {
    workbox.routing.registerRoute(
      ({ request }) => request.destination === "image",
      new workbox.strategies.CacheFirst({
        cacheName: "images-cache",
        plugins: [
          new workbox.expiration.ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 hari
          }),
        ],
      })
    );
  }

  // Fonts dan External Resources
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === "font" ||
      request.url.includes("fonts.gstatic.com") ||
      request.url.includes("cdnjs.cloudflare.com"),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "fonts-and-icons",
    })
  );

  // Push Notification Handler
  self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};
    const notificationTitle = data.title || "Dicoding Story";

    const notificationOptions = {
      body: data.body || "Ada cerita baru!",
      icon: data.icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      data: { url: data.url || "/" },
      actions: [
        { action: "open", title: "Buka Aplikasi" },
        { action: "close", title: "Tutup" },
      ],
      requireInteraction: true,
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  });

  // Notification Click Handler
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const urlToOpen = event.notification.data.url || "/";

    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      })
    );
  });

  // Install dan Activate Event
  self.addEventListener("install", (event) => {
    self.skipWaiting();
    console.log("Service Worker: Installed");
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
    console.log("Service Worker: Activated");
  });
} else {
  console.error("Workbox tidak terdeteksi");
}
