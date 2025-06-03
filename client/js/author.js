document.addEventListener('DOMContentLoaded', async () => {
    const pathParts = window.location.pathname.split('/');
    const authorId = pathParts[pathParts.length - 1];
    const messageDiv = document.getElementById('message');
    const isDigit = /^\d+$/.test(authorId);
    if (!authorId || isNaN(authorId) || !isDigit) { 
        messageDiv.textContent = "Nie podano autora.";
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

            document.getElementById('edit-author-btn').onclick = () => {
                window.location.href = `/editAuthor/${authorId}`;
            };
            document.getElementById('delete-author-btn').onclick = async () => {
                if (confirm('Czy na pewno chcesz usunąć tego autora?')) {
                    const res = await authFetch(`/api/authors/${authorId}`, { method: 'DELETE' });
                    if (res.ok) {
                        window.location.href = '/';
                    } else {
                        const msg = await res.json();
                        document.getElementById('message').textContent = msg.message || 'Błąd usuwania autora';
                    }
                }
            };
        }

        const res = await fetch(`/api/authors/${authorId}`, {headers});
        if (!res.ok) {
            messageDiv.textContent = "Nie znaleziono autora.";
            return;
        }
        const author = await res.json();
        document.getElementById('author-name').textContent = author.Name;
        console.log(author)
        const booksList = document.getElementById('book-list');
        booksList.innerHTML = '';
        const books = author.Books || [];
        if (books.length === 0) {
            booksList.innerHTML = '<li>Brak książek.</li>';
        } else {
             for (const book of books) {
                const bookElement = await Book.renderBook(book, {isUserAuthenticated, isAdmin});
                 booksList.append(bookElement);
            }
        }
    } catch (err) {
        messageDiv.textContent = "Błąd ładowania danych autora.";
    }
});
