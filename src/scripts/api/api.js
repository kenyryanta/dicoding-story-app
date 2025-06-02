const API_BASE_URL = "https://story-api.dicoding.dev/v1";

class StoryApi {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem("token") || null;
  }

  async _fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async register(name, email, password) {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    return response.json();
  }

  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to login");
    }

    if (responseData.loginResult && responseData.loginResult.token) {
      this.token = responseData.loginResult.token;
      localStorage.setItem("token", this.token);

      // Update UI untuk menampilkan tombol logout
      const logoutContainer = document.getElementById("logoutContainer");
      if (logoutContainer) {
        logoutContainer.style.display = "block";
      }

      // Show notification controls
      const notificationControls = document.getElementById(
        "notification-controls"
      );
      if (notificationControls) {
        notificationControls.style.display = "block";
      }
    }

    return responseData;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem("token");

    // Update UI untuk menyembunyikan tombol logout
    const logoutContainer = document.getElementById("logoutContainer");
    if (logoutContainer) {
      logoutContainer.style.display = "none";
    }

    // Hide notification controls
    const notificationControls = document.getElementById(
      "notification-controls"
    );
    if (notificationControls) {
      notificationControls.style.display = "none";
    }
  }

  async getAllStories() {
    if (!this.token) {
      throw new Error("Authentication required");
    }

    const response = await this._fetchWithAuth(`${this.baseUrl}/stories`);
    return response.json();
  }

  async getStoryDetail(id) {
    if (!this.token) {
      throw new Error("Authentication required");
    }

    const response = await this._fetchWithAuth(`${this.baseUrl}/stories/${id}`);
    return response.json();
  }

  async addNewStory(description, photo, lat, lon) {
    if (!this.token) {
      throw new Error("Authentication required");
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await this._fetchWithAuth(`${this.baseUrl}/stories`, {
      method: "POST",
      body: formData,
    });

    return response.json();
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export default new StoryApi();
