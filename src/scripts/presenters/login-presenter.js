import loginView from "../views/login-view.js";
import appView from "../views/app-view.js";
import storyApi from "../api/api.js";
import router from "../utils/router.js";

class LoginPresenter {
  constructor() {
    this._view = loginView;
    this.init();
  }

  init() {
    // Hide authenticated elements
    this._hideAuthenticatedElements();

    // Render login view
    const html = this._view.render();
    appView.renderHTML(html);

    // Setup event listeners
    this._view.setSubmitCallback(this.handleLogin.bind(this));
    this._view.setupEventListeners();
  }

  async handleLogin(formData) {
    try {
      appView.showLoading();

      const { email, password } = formData;
      await storyApi.login(email, password);

      // Navigate to home after successful login
      router.navigate("#/");
    } catch (error) {
      console.error("Login error:", error);
      this._view.showError(
        error.message || "Gagal login. Periksa email dan password."
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

export default LoginPresenter;
