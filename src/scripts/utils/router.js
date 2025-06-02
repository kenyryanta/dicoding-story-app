class Router {
  constructor() {
    this.routes = {};
    this.currentUrl = "";

    window.addEventListener("hashchange", () => {
      this.navigate(window.location.hash);
    });

    // Handle back/forward buttons
    window.addEventListener("popstate", () => {
      this.navigate(window.location.hash);
    });
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(url) {
    if (!url || url === "") {
      url = "#/";
    }

    const path = url.replace("#", "");

    if (path === this.currentUrl) {
      return;
    }

    this.currentUrl = path;

    const route = Object.keys(this.routes).find((route) => {
      if (route === path) {
        return true;
      }

      if (route.includes(":")) {
        const routeParts = route.split("/");
        const pathParts = path.split("/");

        if (routeParts.length !== pathParts.length) {
          return false;
        }

        return routeParts.every((part, i) => {
          if (part.startsWith(":")) {
            return true;
          }
          return part === pathParts[i];
        });
      }

      return false;
    });

    if (route) {
      const params = {};

      if (route.includes(":")) {
        const routeParts = route.split("/");
        const pathParts = path.split("/");

        routeParts.forEach((part, i) => {
          if (part.startsWith(":")) {
            params[part.slice(1)] = pathParts[i];
          }
        });
      }

      // Implementasi View Transitions API
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          this.routes[route](params);
          this._updatePageTitle(path);
        });
      } else {
        this.routes[route](params);
        this._updatePageTitle(path);
      }

      // Focus management untuk aksesibilitas
      setTimeout(() => {
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
          mainContent.focus();
        }
      }, 100);
    } else {
      this.navigate("#/404");
    }
  }

  _updatePageTitle(path) {
    const titles = {
      "/": "Home - Dicoding Story",
      "/add": "Tambah Cerita - Dicoding Story",
      "/offline": "Cerita Offline - Dicoding Story",
      "/login": "Login - Dicoding Story",
      "/register": "Register - Dicoding Story",
      "/404": "404 - Halaman Tidak Ditemukan",
    };

    document.title = titles[path] || "Dicoding Story App";
  }

  init() {
    this.navigate(window.location.hash);
  }
}

export default new Router();
