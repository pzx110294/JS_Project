let navbarLoaded = false;

async function loadNavbar() {
    
    if (navbarLoaded) return;
    navbarLoaded = true;
    
    
    const navbarHTML = `
    <div class="header-bar">
        <a href="/"><h1 class="header-title">📚 Moja Biblioteka</h1></a>
        <div id="auth-buttons">
            <a href="/addBook" class="auth-button" id="add-book-btn" style="display: none">➕ Dodaj książkę</a>
            <a href="/login" class="auth-button" id="login-btn">Zaloguj się</a>
            <a href="/register" class="auth-button" id="register-btn">Zarejestruj się</a>
            <a href="/library" class="auth-button" id="library-btn" style="display: none">Moja biblioteka</a>
            <a href="/admin" class="auth-button" id="admin-btn" style="display: none">Panel admina</a>
            
            <button class="auth-button" id="logout-btn" style="display: none">Wyloguj się</button>
            <div id="user"></div>
        </div>
    </div>
    `;
    
    
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    await initializeAuth();
}

document.addEventListener('DOMContentLoaded', loadNavbar);
