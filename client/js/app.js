async function fetchBooks(sortOrder = 'newest') {
    const bookList = document.getElementById("book-list");
    if (!bookList) return;

    try {
        const headers = {};
        const isUserAuthenticated = isAuthenticated();
        if (isUserAuthenticated) {
            headers['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;
        }

        const response = await fetch('/api/books', {
            headers
        });
        if (!response.ok) throw new Error(`HTTP error  ${response.status}`);

        let books = await response.json();

        books = Book.sortBooks(books, sortOrder);
        
        if (books.length === 0) {
            bookList.innerHTML = "<p>Brak książek w bazie.</p>";
            return;
        }

        bookList.innerHTML = "";
        const user = await getCurrentUser();
        const isAdmin = user?.role === 'admin';
        for (const book of books) {
            const bookElement = await Book.renderBook(book, {isUserAuthenticated, isAdmin});
            bookList.appendChild(bookElement);
        }
    } catch (error) {
        bookList.innerHTML = "<p>Nie udało się załadować książek.</p>";
        console.error("Błąd pobierania książek: ", error);
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    await fetchBooks();
});

