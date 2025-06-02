const createStoryItemTemplate = (story, isOfflineStory = false) => {
  const latitude = story.lat || null;
  const longitude = story.lon || null;
  const hasLocation = latitude !== null && longitude !== null;

  const actionButton = isOfflineStory
    ? `<button class="btn btn-danger btn-delete-offline" data-id="${story.id}" aria-label="Hapus cerita offline ${story.name}">
           <i class="fas fa-trash" aria-hidden="true"></i> Hapus
         </button>`
    : `<button class="btn btn-save-offline" data-id="${story.id}" aria-label="Simpan cerita ${story.name} untuk offline">
           <i class="fas fa-save" aria-hidden="true"></i> Simpan Offline
         </button>`;

  return `
      <article class="story-card">
        <img 
          src="${story.photoUrl}" 
          alt="Cerita dari ${story.name}: ${story.description.substring(
    0,
    50
  )}${story.description.length > 50 ? "..." : ""}" 
          class="story-image"
        >
        <div class="story-content">
          <h2 class="story-title">${story.name}</h2>
          <p class="story-description">${story.description}</p>
          <div class="story-meta">
            <span class="story-date">
              <i class="fas fa-calendar" aria-hidden="true"></i> ${new Date(
                story.createdAt
              ).toLocaleDateString("id-ID")}
            </span>
            <span class="story-location">
              <i class="fas fa-map-marker-alt" aria-hidden="true"></i> 
              ${hasLocation ? "Lihat lokasi" : "Lokasi tidak tersedia"}
            </span>
          </div>
          <div style="margin-top: 10px;">
            ${actionButton}
          </div>
        </div>
      </article>
    `;
};

const createStoriesTemplate = (stories, isOfflinePage = false) => {
  const title = isOfflinePage ? "Cerita Tersimpan Offline" : "Cerita Terbaru";
  const description = isOfflinePage
    ? "Berikut adalah cerita yang telah Anda simpan untuk diakses secara offline."
    : "Berikut adalah cerita terbaru dari pengguna Dicoding Story";

  if (stories.length === 0 && isOfflinePage) {
    return `
        <section class="stories-section">
          <h2 class="section-title">${title}</h2>
          <p class="section-description">${description}</p>
          <div class="text-center" style="padding: 2rem;">
            <i class="fas fa-database fa-3x" style="color: var(--dark-gray); margin-bottom: 1rem;"></i>
            <p>Tidak ada cerita yang tersimpan secara offline.</p>
            <a href="#/" class="btn">Kembali ke Beranda</a>
          </div>
        </section>
      `;
  }

  return `
      <section class="stories-section">
        <h2 class="section-title">${title}</h2>
        <p class="section-description">${description}</p>
        
        ${
          !isOfflinePage
            ? '<div class="map-container" id="storiesMap" role="application" aria-label="Peta lokasi cerita"></div>'
            : ""
        }
        
        <div class="story-grid">
          ${stories
            .map((story) => createStoryItemTemplate(story, isOfflinePage))
            .join("")}
        </div>
      </section>
    `;
};

export { createStoryItemTemplate, createStoriesTemplate };
