// VAPID Public Key yang benar untuk Dicoding Story API
const VAPID_PUBLIC_KEY =
  "BDXnCSlYgIS47EVVE08yYre0CHQpM4jLqYv_h-Fk75KjNfD8b2qG3B9G4GZ8P9X9j3w4qO0D8t5F_y0nL6J7Z7s";

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
      // Tunggu service worker siap
      console.log("Waiting for service worker to be ready...");
      const registration = await navigator.serviceWorker.ready;
      console.log("Service worker is ready:", registration);

      // Cek subscription yang ada
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log("User is already subscribed:", existingSubscription);
        return existingSubscription;
      }

      // Konversi VAPID key
      console.log("Converting VAPID key...");
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      console.log("VAPID key converted successfully");

      // Subscribe ke push manager
      console.log("Subscribing to push manager...");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      });

      console.log("User subscribed successfully:", subscription);

      // Simpan subscription ke localStorage untuk demo
      localStorage.setItem("pushSubscription", JSON.stringify(subscription));

      return subscription;
    } catch (error) {
      console.error("Failed to subscribe the user:", error);

      // Error handling yang lebih detail
      if (error.name === "NotSupportedError") {
        console.error("Push messaging is not supported");
      } else if (error.name === "NotAllowedError") {
        console.error("Permission not granted for push notifications");
      } else if (error.name === "InvalidStateError") {
        console.error("Service worker is in invalid state");
      } else {
        console.error("Unknown error:", error.message);
      }

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

        // Simulasi push notification untuk demo
        const notificationData = {
          title: "Test Notification",
          body: "Ini adalah notifikasi test dari Dicoding Story App!",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-72x72.png",
          data: { url: "/" },
        };

        await registration.showNotification(notificationData.title, {
          body: notificationData.body,
          icon: notificationData.icon,
          badge: notificationData.badge,
          data: notificationData.data,
        });

        console.log("Test notification sent successfully");
      } catch (error) {
        console.error("Error sending test notification:", error);
      }
    }
  },
};

export default NotificationHelper;
