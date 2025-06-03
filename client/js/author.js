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
