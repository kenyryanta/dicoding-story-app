const createStoryFormTemplate = () => {
  return `
      <section class="add-story-section">
        <h2 class="section-title">Tambah Cerita Baru</h2>
        <p class="section-description">Bagikan pengalaman menarikmu melalui cerita dengan gambar</p>
        
        <form id="addStoryForm" class="form-grid" aria-labelledby="form-title">
          <h3 id="form-title" class="sr-only">Form Tambah Cerita</h3>
          
          <div class="form-column">
            <div class="form-group">
              <label for="description" class="form-label">Deskripsi</label>
              <textarea 
                id="description" 
                name="description"
                class="form-control" 
                placeholder="Ceritakan pengalamanmu..." 
                required
                aria-required="true"
                aria-describedby="description-help"
              ></textarea>
              <small id="description-help" class="form-text">Tulis cerita dengan jelas dan menarik.</small>
            </div>
            
            <div class="form-group">
              <label id="location-label" class="form-label">Lokasi</label>
              <div class="map-container" id="locationMap" aria-labelledby="location-label" role="application"></div>
              <small id="map-help" class="form-text">Klik pada peta untuk memilih lokasi.</small>
            </div>
            
            <div class="form-group">
              <input type="hidden" id="latitude" name="latitude">
              <input type="hidden" id="longitude" name="longitude">
              <p id="selectedLocation" aria-live="polite">Belum memilih lokasi</p>
            </div>
          </div>
          
          <div class="form-column">
            <div class="form-group">
              <label id="photo-label" class="form-label">Foto Cerita</label>
              <div class="camera-container" aria-labelledby="photo-label">
                <video id="cameraPreview" class="camera-preview" autoplay playsinline aria-label="Pratinjau kamera"></video>
                <canvas id="photoCanvas" style="display: none;"></canvas>
                <div class="camera-controls">
                  <button type="button" id="switchCameraBtn" class="camera-btn" aria-label="Ganti kamera">
                    <i class="fas fa-sync-alt" aria-hidden="true"></i>
                  </button>
                  <button type="button" id="capturePhotoBtn" class="camera-btn" aria-label="Ambil foto">
                    <i class="fas fa-camera" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
              <small id="camera-help" class="form-text">Ambil foto menggunakan kamera atau pilih dari perangkatmu.</small>
            </div>
            
            <div class="form-group">
              <label for="photoFile" class="form-label">Atau upload file gambar</label>
              <input 
                type="file" 
                id="photoFile" 
                name="photoFile"
                class="form-control" 
                accept="image/*"
                aria-describedby="file-help"
              >
              <small id="file-help" class="form-text">Format yang didukung: JPG, PNG, GIF.</small>
            </div>
            
            <div class="form-group">
              <img id="photoPreview" style="display: none; max-width: 100%; border-radius: var(--border-radius); margin-top: 1rem;" alt="Pratinjau foto yang dipilih">
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-block">
                <i class="fas fa-paper-plane" aria-hidden="true"></i> Kirim Cerita
              </button>
            </div>
          </div>
        </form>
      </section>
    `;
};

export { createStoryFormTemplate };
