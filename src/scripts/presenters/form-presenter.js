import formView from "../views/form-view.js";
import storyModel from "../models/story-model.js";
import appView from "../views/app-view.js";
import storyApi from "../api/api.js";
import router from "../utils/router.js";

class FormPresenter {
  constructor() {
    this._view = formView;
    this._model = storyModel;
    this.init();
  }

  async init() {
    if (!storyApi.isAuthenticated()) {
      router.navigate("#/login");
      return;
    }

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

    this._view.render();
    this._view.setSubmitCallback(this.handleSubmit.bind(this));
  }

  async handleSubmit(formData) {
    appView.showLoading();

    try {
      const { description, photo, latitude, longitude } = formData;

      if (!description) {
        throw new Error("Deskripsi cerita tidak boleh kosong");
      }

      if (!photo) {
        throw new Error("Foto cerita tidak boleh kosong");
      }

      const response = await this._model.addStory(
        description,
        photo,
        latitude,
        longitude
      );

      appView.showSuccess("Cerita berhasil ditambahkan!");

      setTimeout(() => {
        router.navigate("#/");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      appView.showError(
        error.message || "Terjadi kesalahan saat menambahkan cerita."
      );
    } finally {
      appView.hideLoading();
    }
  }

  destroy() {
    this._view.cleanup();
  }
}

export default FormPresenter;
