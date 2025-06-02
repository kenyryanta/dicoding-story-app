class AppView {
  constructor() {
    this.appContainer = document.getElementById("app");
    this.loadingElement = document.getElementById("loading");
  }

  showLoading() {
    if (this.loadingElement) {
      this.loadingElement.style.display = "block";
      this.loadingElement.setAttribute("aria-busy", "true");
    }
  }

  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.style.display = "none";
      this.loadingElement.setAttribute("aria-busy", "false");
    }
  }

  renderHTML(html) {
    if (this.appContainer) {
      this.appContainer.innerHTML = html;
    }
  }

  showError(message) {
    const errorHTML = `
        <div class="alert alert-error" role="alert">
          <i class="fas fa-exclamation-circle" aria-hidden="true"></i> ${message}
        </div>
      `;

    if (this.appContainer) {
      this.appContainer.innerHTML = errorHTML + this.appContainer.innerHTML;
    }
  }

  showSuccess(message) {
    const successHTML = `
        <div class="alert alert-success" role="alert">
          <i class="fas fa-check-circle" aria-hidden="true"></i> ${message}
        </div>
      `;

    if (this.appContainer) {
      this.appContainer.innerHTML = successHTML + this.appContainer.innerHTML;
    }
  }
}

export default new AppView();
