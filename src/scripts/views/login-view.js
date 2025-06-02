class LoginView {
  constructor() {
    this.onSubmit = null;
  }

  render() {
    return `
        <section class="login-section">
          <h2 class="section-title">Login ke Dicoding Story</h2>
          <p class="section-description">Masukkan email dan password untuk melanjutkan</p>
          
          <form id="loginForm" class="form" aria-labelledby="login-title">
            <h3 id="login-title" class="sr-only">Form Login</h3>
            
            <div class="form-group">
              <label for="loginEmail" class="form-label">Email</label>
              <input 
                type="email" 
                id="loginEmail" 
                name="email"
                class="form-control" 
                placeholder="Alamat email" 
                required
                aria-required="true"
              >
            </div>
            
            <div class="form-group">
              <label for="loginPassword" class="form-label">Password</label>
              <input 
                type="password" 
                id="loginPassword" 
                name="password"
                class="form-control" 
                placeholder="Password" 
                required
                aria-required="true"
              >
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-block">
                <i class="fas fa-sign-in-alt" aria-hidden="true"></i> Login
              </button>
            </div>
            
            <p class="text-center">
              Belum punya akun? <a href="#/register">Daftar sekarang</a>
            </p>
          </form>
        </section>
      `;
  }

  setupEventListeners() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm && this.onSubmit) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        this.onSubmit({ email, password });
      });
    }
  }

  setSubmitCallback(callback) {
    this.onSubmit = callback;
  }

  showError(message) {
    // Bisa dipanggil dari presenter untuk menampilkan error spesifik login
    const form = document.getElementById("loginForm");
    if (form) {
      const existingError = form.querySelector(".login-error");
      if (existingError) {
        existingError.remove();
      }

      const errorDiv = document.createElement("div");
      errorDiv.className = "alert alert-error login-error";
      errorDiv.innerHTML = `<i class="fas fa-exclamation-circle" aria-hidden="true"></i> ${message}`;
      form.insertBefore(errorDiv, form.firstChild);
    }
  }
}

export default new LoginView();
