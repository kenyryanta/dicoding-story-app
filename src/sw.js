importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

if (workbox) {
  console.log("Workbox berhasil dimuat");

  // Precache files
  workbox.precaching.precacheAndRoute([]);

  // Cache API calls
  workbox.routing.registerRoute(
    ({ url }) => url.origin === "https://story-api.dicoding.dev",
    new workbox.strategies.NetworkFirst({
      cacheName: "story-api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24,
        }),
      ],
    })
  );

  // Cache images - SKIP untuk development
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === "image" && !request.url.includes("localhost"),
    new workbox.strategies.CacheFirst({
      cacheName: "images-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        }),
      ],
    })
  );

  // Cache fonts and external resources
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === "font" ||
      request.url.includes("fonts.gstatic.com") ||
      request.url.includes("cdnjs.cloudflare.com"),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "fonts-and-icons",
    })
  );
}

// Push notification handlers dengan fallback icon
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push Received.");

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      console.error("Error parsing push data:", error);
      data = { title: "Dicoding Story", body: event.data.text() };
    }
  }

  const notificationTitle = data.title || "Dicoding Story";

  // Fallback icon menggunakan data URL
  const fallbackIcon =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIGZpbGw9IiMzNDk4ZGIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRTPC90ZXh0Pjwvc3ZnPg==";
  const fallbackBadge =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIGZpbGw9IiMyOTgwYjkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRTPC90ZXh0Pjwvc3ZnPg==";

  const notificationOptions = {
    body: data.body || "Ada update baru di Dicoding Story!",
    icon: data.icon || fallbackIcon,
    badge: fallbackBadge,
    image: data.image,
    data: {
      url: data.url || "/",
      storyId: data.storyId,
      timestamp: Date.now(),
    },
    actions: [
      {
        action: "open",
        title: "Buka Aplikasi",
      },
      {
        action: "close",
        title: "Tutup",
      },
    ],
    requireInteraction: true,
    tag: data.tag || "dicoding-story",
    renotify: true,
    vibrate: [200, 100, 200],
    silent: false,
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification click Received.");

  const notification = event.notification;
  const action = event.action;

  if (action === "close") {
    notification.close();
    return;
  }

  const urlToOpen = notification.data.url || "/";

  notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(clients.claim());
});
