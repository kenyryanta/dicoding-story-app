class RegisterView {
  constructor() {
    this.onSubmit = null;
  }

  render() {
    return `
        <section class="register-section">
          <h2 class="section-title">Daftar Akun Baru</h2>
          <p class="section-description">Buat akun untuk mulai berbagi cerita</p>
          
          <form id="registerForm" class="form" aria-labelledby="register-title">
            <h3 id="register-title" class="sr-only">Form Registrasi</h3>
            
            <div class="form-group">
              <label for="registerName" class="form-label">Nama</label>
              <input 
                type="text" 
                id="registerName" 
                name="name"
                class="form-control" 
                placeholder="Nama lengkap" 
                required
                aria-required="true"
              >
            </div>
            
            <div class="form-group">
              <label for="registerEmail" class="form-label">Email</label>
              <input 
                type="email" 
                id="registerEmail" 
                name="email"
                class="form-control" 
                placeholder="Alamat email" 
                required
                aria-required="true"
              >
            </div>
            
            <div class="form-group">
              <label for="registerPassword" class="form-label">Password</label>
              <input 
                type="password" 
                id="registerPassword" 
                name="password"
                class="form-control" 
                placeholder="Password (minimal 8 karakter)" 
                required
                aria-required="true"
                minlength="8"
              >
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-block">
                <i class="fas fa-user-plus" aria-hidden="true"></i> Daftar
              </button>
            </div>
            
            <p class="text-center">
              Sudah punya akun? <a href="#/login">Login</a>
            </p>
          </form>
        </section>
      `;
  }

  setupEventListeners() {
    const registerForm = document.getElementById("registerForm");
    if (registerForm && this.onSubmit) {
      registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        this.onSubmit({ name, email, password });
      });
    }
  }

  setSubmitCallback(callback) {
    this.onSubmit = callback;
  }

  showError(message) {
    const form = document.getElementById("registerForm");
    if (form) {
      const existingError = form.querySelector(".register-error");
      if (existingError) {
        existingError.remove();
      }

      const errorDiv = document.createElement("div");
      errorDiv.className = "alert alert-error register-error";
      errorDiv.innerHTML = `<i class="fas fa-exclamation-circle" aria-hidden="true"></i> ${message}`;
      form.insertBefore(errorDiv, form.firstChild);
    }
  }

  showSuccess(message) {
    const form = document.getElementById("registerForm");
    if (form) {
      const existingSuccess = form.querySelector(".register-success");
      if (existingSuccess) {
        existingSuccess.remove();
      }

      const successDiv = document.createElement("div");
      successDiv.className = "alert alert-success register-success";
      successDiv.innerHTML = `<i class="fas fa-check-circle" aria-hidden="true"></i> ${message}`;
      form.insertBefore(successDiv, form.firstChild);
    }
  }
}

export default new RegisterView();
