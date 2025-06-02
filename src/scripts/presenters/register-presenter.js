import registerView from "../views/register-view.js";
import appView from "../views/app-view.js";
import storyApi from "../api/api.js";
import router from "../utils/router.js";

class RegisterPresenter {
  constructor() {
    this._view = registerView;
    this.init();
  }

  init() {
    // Hide authenticated elements
    this._hideAuthenticatedElements();

    // Render register view
    const html = this._view.render();
    appView.renderHTML(html);

    // Setup event listeners
    this._view.setSubmitCallback(this.handleRegister.bind(this));
    this._view.setupEventListeners();
  }

  async handleRegister(formData) {
    try {
      appView.showLoading();

      const { name, email, password } = formData;
      const response = await storyApi.register(name, email, password);

      if (response.error) {
        throw new Error(response.message);
      }

      this._view.showSuccess("Registrasi berhasil! Silakan login.");

      // Navigate to login after successful registration
      setTimeout(() => {
        router.navigate("#/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      this._view.showError(
        error.message || "Gagal mendaftar. Silakan coba lagi."
      );
    } finally {
      appView.hideLoading();
    }
  }

  _hideAuthenticatedElements() {
    const logoutContainer = document.getElementById("logoutContainer");
    if (logoutContainer) {
      logoutContainer.style.display = "none";
    }

    const notificationControls = document.getElementById(
      "notification-controls"
    );
    if (notificationControls) {
      notificationControls.style.display = "none";
    }
  }

  destroy() {
    // Cleanup if needed
  }
}

export default RegisterPresenter;
