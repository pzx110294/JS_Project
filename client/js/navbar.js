let navbarLoaded = false;

async function loadNavbar() {
    if (navbarLoaded) return;
    navbarLoaded = true;
    
    const navbarHTML = `
    <div class="header-bar">
        <a href="/"><h1>📚 Moja Bibioteka</h1></a>
        <div id="auth-buttons">
            <a href="/login" class="auth-button" id="login-btn">Zaloguj się</a>
            <a href="/register" class="auth-button" id="register-btn">Zarejestruj się</a>
            <a href="/library" class="auth-button" id="library-btn" style="display: none">Moja biblioteka</a>
            <a href="/admin" class="auth-button" id="admin-btn" style="display: none">Panel admina</a>
            <div id="user"></div>
            <button class="auth-button" id="logout-btn" style="display: none">Wyloguj się</button>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    await initializeAuth();
}

document.addEventListener('DOMContentLoaded', loadNavbar);