document.addEventListener('DOMContentLoaded', async () => {
    const pathParts = window.location.pathname.split('/');
    const genreId = pathParts[pathParts.length - 1];
    const messageDiv = document.getElementById('message');
    const isDigit = /^\d+$/.test(genreId);
    if (!genreId || isNaN(genreId) || !isDigit) { 
        messageDiv.textContent = "Nie podano gatunku.";
        return;
    }
    try {
        const headers = {};
        const isUserAuthenticated = isAuthenticated();
        if (isUserAuthenticated) {
            headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
        }
        const user = await getCurrentUser();
        const isAdmin = user?.role === 'admin';

        const adminButtons = document.getElementById('admin-buttons');
        if (isAdmin && adminButtons) {
            adminButtons.style.display = '';

            document.getElementById('edit-genre-btn').onclick = () => {
                window.location.href = `/editGenre/${genreId}`;
            };
            document.getElementById('delete-genre-btn').onclick = async () => {
                if (confirm('Czy na pewno chcesz usunąć ten gatunek?')) {
                    const res = await authFetch(`/api/genres/${genreId}`, { method: 'DELETE' });
                    if (res.ok) {
                        window.location.href = '/';
                    } else {
                        const msg = await res.json();
                        document.getElementById('message').textContent = msg.message || 'Błąd usuwania gatunku';
                    }
                }
            };
        }

        const res = await fetch(`/api/genres/${genreId}`, {headers});
        if (!res.ok) {
            messageDiv.textContent = "Nie znaleziono gatunku.";
            return;
        }
        const genre = await res.json();
        document.getElementById('genre-name').textContent = genre.Name;
        const booksList = document.getElementById('book-list');
        booksList.innerHTML = '';
        const books = genre.Books || [];
        if (books.length === 0) {
            booksList.innerHTML = '<li>Brak książek.</li>';
        } else {
             for (const book of books) {
                const bookElement = await Book.renderBook(book, {isUserAuthenticated, isAdmin});
                 booksList.append(bookElement);
            }
        }
    } catch (err) {
        messageDiv.textContent = "Błąd ładowania danych gatunku.";
    }
});
