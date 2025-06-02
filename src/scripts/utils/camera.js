class Camera {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.canvasElement = null;
    this.facingMode = "environment";
  }

  async startCamera(videoElement, canvasElement) {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;

    try {
      this.stopCamera();

      this.videoElement.setAttribute("aria-label", "Pratinjau kamera");

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.facingMode },
        audio: false,
      });

      // Announce untuk screen readers
      this._announceToScreenReader("Kamera aktif, siap mengambil foto");

      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();

      return true;
    } catch (error) {
      console.error("Error starting camera:", error);
      this._announceToScreenReader("Kamera tidak dapat diakses");
      return false;
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  switchCamera() {
    this.facingMode =
      this.facingMode === "environment" ? "user" : "environment";
    if (this.videoElement) {
      this.startCamera(this.videoElement, this.canvasElement);
      this._announceToScreenReader(
        `Beralih ke kamera ${
          this.facingMode === "environment" ? "belakang" : "depan"
        }`
      );
    }
  }

  takePhoto() {
    if (!this.videoElement || !this.canvasElement) {
      return null;
    }

    const context = this.canvasElement.getContext("2d");

    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;

    context.drawImage(
      this.videoElement,
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    this._announceToScreenReader("Foto berhasil diambil");

    return this.dataURLtoBlob(this.canvasElement.toDataURL("image/jpeg"));
  }

  dataURLtoBlob(dataURL) {
    const parts = dataURL.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(raw.length);

    for (let i = 0; i < raw.length; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  _announceToScreenReader(message) {
    const statusElement = document.createElement("div");
    statusElement.setAttribute("aria-live", "polite");
    statusElement.classList.add("sr-only");
    statusElement.textContent = message;
    document.body.appendChild(statusElement);

    setTimeout(() => {
      if (document.body.contains(statusElement)) {
        document.body.removeChild(statusElement);
      }
    }, 1000);
  }
}

export default new Camera();
