import { createStoryFormTemplate } from "../../templates/form-template.js";
import appView from "./app-view.js";
import camera from "../utils/camera.js";

class FormView {
  constructor() {
    this.map = null;
    this.marker = null;
    this.photoBlob = null;
    this.latitude = null;
    this.longitude = null;
  }

  render() {
    const html = createStoryFormTemplate();
    appView.renderHTML(html);

    this.initializeCamera();
    this.initializeMap();
    this.setupEventListeners();
  }

  async initializeCamera() {
    const videoElement = document.getElementById("cameraPreview");
    const canvasElement = document.getElementById("photoCanvas");

    if (!videoElement || !canvasElement) {
      return;
    }

    try {
      await camera.startCamera(videoElement, canvasElement);
    } catch (error) {
      console.error("Failed to initialize camera:", error);
      const cameraContainer = videoElement.closest(".camera-container");
      if (cameraContainer) {
        cameraContainer.innerHTML = `
          <div class="camera-error" role="alert">
            <p><i class="fas fa-exclamation-triangle"></i> Kamera tidak dapat diakses. Silakan gunakan opsi upload file.</p>
          </div>
        `;
      }
    }
  }

  initializeMap() {
    const mapContainer = document.getElementById("locationMap");

    if (!mapContainer) {
      return;
    }

    this.map = L.map(mapContainer).setView([-2.548926, 118.0148634], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.map.on("click", (e) => {
      this.setLocationMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  setLocationMarker(lat, lng) {
    this.latitude = lat;
    this.longitude = lng;

    const latitudeInput = document.getElementById("latitude");
    const longitudeInput = document.getElementById("longitude");
    const selectedLocationText = document.getElementById("selectedLocation");

    if (latitudeInput) latitudeInput.value = lat;
    if (longitudeInput) longitudeInput.value = lng;
    if (selectedLocationText) {
      selectedLocationText.textContent = `Lokasi terpilih: ${lat.toFixed(
        6
      )}, ${lng.toFixed(6)}`;
    }

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }

    this.map.setView([lat, lng], 14);
  }

  setupEventListeners() {
    const captureBtn = document.getElementById("capturePhotoBtn");
    if (captureBtn) {
      captureBtn.addEventListener("click", () => {
        this.photoBlob = camera.takePhoto();

        if (this.photoBlob) {
          const photoPreview = document.getElementById("photoPreview");
          if (photoPreview) {
            photoPreview.src = URL.createObjectURL(this.photoBlob);
            photoPreview.alt = "Pratinjau foto yang akan diunggah";
            photoPreview.style.display = "block";
          }
        }
      });
    }

    const switchBtn = document.getElementById("switchCameraBtn");
    if (switchBtn) {
      switchBtn.addEventListener("click", () => {
        camera.switchCamera();
      });
    }

    const fileInput = document.getElementById("photoFile");
    if (fileInput) {
      fileInput.addEventListener("change", (event) => {
        if (event.target.files && event.target.files[0]) {
          this.photoBlob = event.target.files[0];

          const photoPreview = document.getElementById("photoPreview");
          if (photoPreview) {
            photoPreview.src = URL.createObjectURL(this.photoBlob);
            photoPreview.alt = "Pratinjau foto yang dipilih";
            photoPreview.style.display = "block";
          }
        }
      });
    }

    const form = document.getElementById("addStoryForm");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const descriptionInput = document.getElementById("description");
        const description = descriptionInput ? descriptionInput.value : "";

        if (this.onSubmit) {
          this.onSubmit({
            description,
            photo: this.photoBlob,
            latitude: this.latitude,
            longitude: this.longitude,
          });
        }
      });
    }
  }

  setSubmitCallback(callback) {
    this.onSubmit = callback;
  }

  cleanup() {
    camera.stopCamera();

    if (this.photoBlob) {
      URL.revokeObjectURL(this.photoBlob);
    }
  }
}

export default new FormView();
