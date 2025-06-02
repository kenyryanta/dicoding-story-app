import listView from "../views/list-view.js";
import storyModel from "../models/story-model.js";
import appView from "../views/app-view.js";
import storyApi from "../api/api.js";
import router from "../utils/router.js";
import DbHelper from "../utils/db-helper.js";

class ListPresenter {
  constructor() {
    this._view = listView;
    this._model = storyModel;
    this._dbHelper = DbHelper;
    this.init();
  }

  async init() {
    appView.showLoading();

    try {
      // Periksa apakah pengguna terautentikasi
      if (!storyApi.isAuthenticated()) {
        router.navigate("#/login");
        return;
      }

      // Update UI untuk menampilkan tombol logout
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

      // Coba ambil stories dari API
      const storiesFromApi = await this._model.fetchAllStories();

      // Simpan ke IndexedDB untuk offline access
      if (storiesFromApi && storiesFromApi.length > 0) {
        await this._dbHelper.putAllStories(storiesFromApi);
        console.log("Stories saved to IndexedDB for offline access");
      }

      // Render view dengan data API
      this._view.render(storiesFromApi);
      this._setupSaveOfflineListeners(storiesFromApi);
    } catch (error) {
      console.error("Error initializing list presenter:", error);
      appView.showError(
        "Terjadi kesalahan saat memuat cerita. Menampilkan data offline jika ada..."
      );

      // Jika API gagal, coba tampilkan dari IndexedDB
      try {
        const storiesFromDb = await this._dbHelper.getAllStories();
        if (storiesFromDb && storiesFromDb.length > 0) {
          this._view.render(storiesFromDb);
          appView.showSuccess("Menampilkan cerita dari cache offline.");
          this._setupSaveOfflineListeners(storiesFromDb);
        } else {
          appView.showError("Tidak ada cerita di cache offline.");
        }
      } catch (dbError) {
        console.error("Error fetching stories from DB:", dbError);
        appView.showError("Gagal memuat cerita dari API maupun cache offline.");
      }
    } finally {
      appView.hideLoading();
    }
  }

  _setupSaveOfflineListeners(stories) {
    const saveButtons = document.querySelectorAll(".btn-save-offline");
    saveButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const storyId = event.target.closest("button").dataset.id;
        const storyToSave = stories.find((story) => story.id === storyId);

        if (storyToSave) {
          try {
            await this._dbHelper.putStory(storyToSave);
            appView.showSuccess(
              `Cerita "${storyToSave.name}" berhasil disimpan offline!`
            );

            // Update button state
            const button = event.target.closest("button");
            button.innerHTML =
              '<i class="fas fa-check" aria-hidden="true"></i> Tersimpan';
            button.disabled = true;
            button.classList.remove("btn-save-offline");
            button.classList.add("btn-success");
          } catch (error) {
            console.error("Gagal menyimpan cerita offline:", error);
            appView.showError("Gagal menyimpan cerita offline.");
          }
        }
      });
    });
  }

  destroy() {
    // Cleanup jika diperlukan
  }
}

export default ListPresenter;
