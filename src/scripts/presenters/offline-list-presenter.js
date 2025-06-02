import listView from "../views/list-view.js";
import appView from "../views/app-view.js";
import storyApi from "../api/api.js";
import router from "../utils/router.js";
import DbHelper from "../utils/db-helper.js";

class OfflineListPresenter {
  constructor() {
    this._view = listView;
    this._dbHelper = DbHelper;
    this.init();
  }

  async init() {
    appView.showLoading();

    try {
      // Update UI untuk menampilkan tombol logout jika user login
      if (storyApi.isAuthenticated()) {
        const logoutContainer = document.getElementById("logoutContainer");
        if (logoutContainer) {
          logoutContainer.style.display = "block";
        }

        const notificationControls = document.getElementById(
          "notification-controls"
        );
        if (notificationControls) {
          notificationControls.style.display = "block";
        }
      }

      // Ambil cerita dari IndexedDB
      const storiesFromDb = await this._dbHelper.getAllStories();

      // Render view dengan data offline
      this._view.render(storiesFromDb, true); // true = offline mode
      this._setupDeleteOfflineListeners();
    } catch (error) {
      console.error("Error initializing offline list presenter:", error);
      appView.showError("Gagal memuat cerita offline.");
    } finally {
      appView.hideLoading();
    }
  }

  _setupDeleteOfflineListeners() {
    const deleteButtons = document.querySelectorAll(".btn-delete-offline");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const storyId = event.target.closest("button").dataset.id;

        if (
          confirm(
            "Apakah Anda yakin ingin menghapus cerita ini dari daftar offline?"
          )
        ) {
          try {
            await this._dbHelper.deleteStory(storyId);
            appView.showSuccess("Cerita berhasil dihapus dari daftar offline!");

            // Re-render list setelah delete
            setTimeout(() => {
              this.init();
            }, 1000);
          } catch (error) {
            console.error("Gagal menghapus cerita offline:", error);
            appView.showError("Gagal menghapus cerita offline.");
          }
        }
      });
    });
  }

  destroy() {
    // Cleanup jika diperlukan
  }
}

export default OfflineListPresenter;
