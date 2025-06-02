class ErrorView {
  render(
    errorCode = "404",
    title = "Halaman Tidak Ditemukan",
    description = "Maaf, halaman yang Anda cari tidak tersedia atau Anda tidak memiliki akses."
  ) {
    return `
        <section class="error-section text-center">
          <h2 class="section-title">${errorCode} - ${title}</h2>
          <p class="section-description">${description}</p>
          <div style="margin: 2rem 0;">
            <i class="fas fa-sad-tear fa-5x" style="color: var(--primary-color);"></i>
          </div>
          <div class="text-center" style="margin-top: 2rem;">
            <a href="#/" class="btn">
              <i class="fas fa-home" aria-hidden="true"></i> Kembali ke Beranda
            </a>
          </div>
        </section>
      `;
  }
}

export default new ErrorView();
