import router from "../utils/router.js";
import storyApi from "../api/api.js";
import appView from "../views/app-view.js";
import errorView from "../views/error-view.js";
import ListPresenter from "./list-presenter.js";
import FormPresenter from "./form-presenter.js";
import OfflineListPresenter from "./offline-list-presenter.js";
import LoginPresenter from "./login-presenter.js";
import RegisterPresenter from "./register-presenter.js";

class AppPresenter {
  constructor() {
    this.currentPresenter = null;
    this.setupRoutes();
  }

  setupRoutes() {
    // Route home
    router.addRoute("/", () => {
      this._destroyCurrentPresenter();
      this.currentPresenter = new ListPresenter();
    });

    // Route tambah story
    router.addRoute("/add", () => {
      this._destroyCurrentPresenter();
      this.currentPresenter = new FormPresenter();
    });

    // Route untuk cerita offline
    router.addRoute("/offline", () => {
      this._destroyCurrentPresenter();
      this.currentPresenter = new OfflineListPresenter();
    });

    // Route login - menggunakan LoginPresenter terpisah
    router.addRoute("/login", () => {
      this._destroyCurrentPresenter();
      this.currentPresenter = new LoginPresenter();
    });

    // Route register - menggunakan RegisterPresenter terpisah
    router.addRoute("/register", () => {
      this._destroyCurrentPresenter();
      this.currentPresenter = new RegisterPresenter();
    });

    // Route 404 - menggunakan ErrorView terpisah
    router.addRoute("/404", () => {
      this._destroyCurrentPresenter();
      const html = errorView.render(
        "404",
        "Halaman Tidak Ditemukan",
        "Maaf, halaman yang Anda cari tidak tersedia atau Anda tidak memiliki akses."
      );
      appView.renderHTML(html);
    });
  }

  _destroyCurrentPresenter() {
    if (
      this.currentPresenter &&
      typeof this.currentPresenter.destroy === "function"
    ) {
      this.currentPresenter.destroy();
    }
    this.currentPresenter = null;
  }

  init() {
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

      router.init();
    } else {
      router.navigate("#/login");
    }
  }
}

export default new AppPresenter();
