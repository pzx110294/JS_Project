(async function verifyAdminAccess() {
    try {
        const user = await getCurrentUser();
        if (user.role !== 'admin') {
            window.location.href = "/";
        }
    } catch (error) {
        console.log(error);
        console.warn("User not authenticated or fetch failed");
        window.location.href = "/login";
    }
})();

document.addEventListener('DOMContentLoaded', async () => {
    const messageDiv = document.getElementById('message');
    const bookDetailsDiv = document.getElementById('book-details');
    const pathParts = window.location.pathname.split('/');
    const bookId = pathParts[pathParts.length - 1];

    if (!bookId) {
        messageDiv.textContent = "Nie podano książki do usunięcia.";
        return;
    }

    try {
        const res = await fetch(`/api/books/${bookId}`);
        if (!res.ok) {
            messageDiv.textContent = "Nie znaleziono książki.";
            return;
        }
        const book = await res.json();
        const bookElement = await Book.renderBook(book);
        bookDetailsDiv.appendChild(bookElement);
    } catch (err) {
        messageDiv.textContent = "Błąd pobierania danych książki.";
        return;
    }

    document.getElementById('delete-btn').addEventListener('click', async () => {
        if (!confirm("Czy na pewno chcesz usunąć tę książkę?")) return;
        try {
            const res = await authFetch(`/api/books/${bookId}`, { method: 'DELETE' });
            if (res.ok) {
                bookDetailsDiv.innerHTML = '';
                messageDiv.textContent = "Książka została usunięta.";
                setTimeout(() => window.location.href = "/", 1500);
            } else {
                const err = await res.json();
                messageDiv.textContent = err.message || "Błąd usuwania książki.";
            }
        } catch {
            messageDiv.textContent = "Błąd połączenia z serwerem.";
        }
    });
});