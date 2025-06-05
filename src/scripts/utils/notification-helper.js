// VAPID Public Key yang benar dari Dicoding Story API
const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  try {
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (error) {
    console.error("Error converting VAPID key:", error);
    throw new Error("Invalid VAPID key format");
  }
}

const NotificationHelper = {
  async requestPermission() {
    if (!("Notification" in window)) {
      console.error("This browser does not support notifications.");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  },

  async subscribePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.error("Push messaging is not supported.");
      return null;
    }

    try {
      console.log("Waiting for service worker to be ready...");
      const registration = await navigator.serviceWorker.ready;
      console.log("Service worker is ready:", registration);

      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log("User is already subscribed:", existingSubscription);
        return existingSubscription;
      }

      console.log("Converting VAPID key...");
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      console.log("VAPID key converted successfully");

      console.log("Subscribing to push manager...");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });

      console.log("User subscribed successfully:", subscription);

      // SKIP server subscription untuk development - hanya simpan lokal
      localStorage.setItem("pushSubscription", JSON.stringify(subscription));
      console.log("Subscription saved locally (development mode)");

      return subscription;
    } catch (error) {
      console.error("Failed to subscribe the user:", error);
      return null;
    }
  },

  async unsubscribePush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.error("Push messaging is not supported.");
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        console.log("User not subscribed.");
        return true;
      }

      const successful = await subscription.unsubscribe();
      if (successful) {
        console.log("User unsubscribed successfully.");
        localStorage.removeItem("pushSubscription");
      } else {
        console.error("Failed to unsubscribe user.");
      }
      return successful;
    } catch (error) {
      console.error("Error unsubscribing user:", error);
      return false;
    }
  },

  async checkSubscription() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return !!subscription;
    } catch (error) {
      console.error("Error checking subscription:", error);
      return false;
    }
  },

  // Demo function untuk mengirim notifikasi test
  async sendTestNotification() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;

        const notificationData = {
          title: "Test Notification - Dicoding Story",
          body: "Push notification berhasil berjalan di development!",
          icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIGZpbGw9IiMzNDk4ZGIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRTPC90ZXh0Pjwvc3ZnPg==",
          badge:
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIGZpbGw9IiMyOTgwYjkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRTPC90ZXh0Pjwvc3ZnPg==",
          data: { url: "/" },
          requireInteraction: true,
          tag: "dicoding-story-test",
        };

        await registration.showNotification(notificationData.title, {
          body: notificationData.body,
          icon: notificationData.icon,
          badge: notificationData.badge,
          data: notificationData.data,
          requireInteraction: notificationData.requireInteraction,
          tag: notificationData.tag,
        });

        console.log("Test notification sent successfully");
      } catch (error) {
        console.error("Error sending test notification:", error);
      }
    }
  },
};

export default NotificationHelper;
