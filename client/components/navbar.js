let navbarLoaded = false;

async function loadNavbar() {
    if (navbarLoaded) return;
    navbarLoaded = true;
    
    const navbarHTML = `
    <div class="header-bar">
        <a href="/"><h1 class="header-title">📚 Biblioteka</h1></a>
        <div id="auth-buttons">
            <a href="/login" class="auth-button" id="login-btn">Zaloguj się</a>
            <a href="/register" class="auth-button" id="register-btn">Zarejestruj się</a>
            <a href="/library" class="auth-button" id="library-btn" style="display: none">Moja biblioteka</a>
            <div class="dropdown" id="admin-dropdown" style="display: none">
                <button class="auth-button" id="admin-btn">Panel admina ▼</button>
                <div class="dropdown-content" style="display: none; position: absolute; background: white; border: 1px solid #ccc; z-index: 100;">
                    <a href="/addBook">Dodaj książkę</a>
                    <a href="/addAuthor">Dodaj autora</a>
                    <a href="/addGenre">Dodaj gatunek</a>
                </div>
            </div>
            <div id="user"></div>
            <button class="auth-button" id="logout-btn" style="display: none">Wyloguj się</button>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    await initializeAuth();
    
    const adminBtn = document.getElementById('admin-btn');
    const dropdownContent = document.querySelector('#admin-dropdown .dropdown-content');
    if (adminBtn && dropdownContent) {
        adminBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', () => {
            dropdownContent.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', loadNavbar);