// Import CSS
import "../styles/main.css";

// Import modules
import appPresenter from "./presenters/app-presenter.js";
import storyApi from "./api/api.js";
import NotificationHelper from "./utils/notification-helper.js";
import DbHelper from "./utils/db-helper.js";

// Import Workbox untuk Service Worker
import { Workbox } from "workbox-window";

// Registrasi Service Worker dengan Workbox
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const wb = new Workbox("/sw.js");

      wb.addEventListener("installed", (event) => {
        if (event.isUpdate) {
          console.log("Service Worker updated");
        } else {
          console.log("Service Worker installed for the first time");
        }
      });

      wb.addEventListener("controlling", () => {
        console.log("Service Worker is controlling the page");
      });

      await wb.register();
      console.log("Service Worker registered successfully");
      return wb;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  } else {
    console.log("Service Worker not supported in this browser.");
    return null;
  }
};

// Setup Push Notification Buttons
const setupPushNotificationButtons = async () => {
  const subscribeBtn = document.getElementById("subscribePushBtn");
  const unsubscribeBtn = document.getElementById("unsubscribePushBtn");

  if (!subscribeBtn || !unsubscribeBtn) return;

  const isSubscribed = await NotificationHelper.checkSubscription();

  if (isSubscribed) {
    subscribeBtn.style.display = "none";
    unsubscribeBtn.style.display = "inline-block";
  } else {
    subscribeBtn.style.display = "inline-block";
    unsubscribeBtn.style.display = "none";
  }

  subscribeBtn.addEventListener("click", async () => {
    const permissionGranted = await NotificationHelper.requestPermission();
    if (permissionGranted) {
      const subscription = await NotificationHelper.subscribePush();
      if (subscription) {
        console.log("Successfully subscribed to push notifications.");
        subscribeBtn.style.display = "none";
        unsubscribeBtn.style.display = "inline-block";

        setTimeout(() => {
          NotificationHelper.sendTestNotification();
        }, 2000);

        alert(
          "Anda berhasil subscribe notifikasi! Notifikasi test akan muncul dalam 2 detik."
        );
      } else {
        alert("Gagal subscribe notifikasi. Cek konsol untuk detail.");
      }
    } else {
      alert("Izin notifikasi tidak diberikan.");
    }
  });

  unsubscribeBtn.addEventListener("click", async () => {
    const unsubscribed = await NotificationHelper.unsubscribePush();
    if (unsubscribed) {
      console.log("Successfully unsubscribed from push notifications.");
      subscribeBtn.style.display = "inline-block";
      unsubscribeBtn.style.display = "none";
      alert("Anda berhasil unsubscribe notifikasi!");
    } else {
      alert("Gagal unsubscribe notifikasi. Cek konsol untuk detail.");
    }
  });
};

// Setup Logout Button
const setupLogoutButton = () => {
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      try {
        await storyApi.logout();
        await DbHelper.clearAllStories();
        console.log("Offline stories cleared after logout.");
        window.location.hash = "#/login";
      } catch (error) {
        console.error("Logout error:", error);
      }
    });
  }
};

// Setup Skip Link
const setupSkipLink = () => {
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
};

// Setup PWA Install Banner
const setupPWAInstallBanner = () => {
  let deferredPrompt;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const installBanner = document.createElement("div");
    installBanner.className = "install-banner";
    installBanner.innerHTML = `
      <p><i class="fas fa-download"></i> Install aplikasi ini untuk pengalaman yang lebih baik!</p>
      <button id="installBtn" class="btn" style="margin-left: 1rem;">Install</button>
      <button id="dismissBtn" class="btn" style="margin-left: 0.5rem; background: transparent; border: 1px solid white;">Nanti</button>
    `;

    document.body.appendChild(installBanner);
    setTimeout(() => installBanner.classList.add("show"), 100);

    document
      .getElementById("installBtn")
      .addEventListener("click", async () => {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        installBanner.remove();
      });

    document.getElementById("dismissBtn").addEventListener("click", () => {
      installBanner.remove();
    });
  });
};

// Setup Offline Indicator
const setupOfflineIndicator = () => {
  const offlineIndicator = document.createElement("div");
  offlineIndicator.className = "offline-indicator";
  offlineIndicator.innerHTML =
    '<i class="fas fa-wifi"></i> Anda sedang offline';
  document.body.appendChild(offlineIndicator);

  window.addEventListener("online", () => {
    offlineIndicator.classList.remove("show");
  });

  window.addEventListener("offline", () => {
    offlineIndicator.classList.add("show");
  });
};

// Main App Initialization
document.addEventListener("DOMContentLoaded", async () => {
  // Registrasi Service Worker
  await registerServiceWorker();

  // Setup PWA features
  setupPWAInstallBanner();
  setupOfflineIndicator();

  // Inisialisasi aplikasi
  appPresenter.init();

  // Setup event listeners
  setupLogoutButton();
  setupSkipLink();

  // Setup push notification jika user sudah login
  if (storyApi.isAuthenticated()) {
    await setupPushNotificationButtons();
  }
});
