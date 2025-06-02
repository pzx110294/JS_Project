async function fetchBooks() {
    const bookList = document.getElementById("book-list");
    if (!bookList) return;

    try {
        const response = await fetch('/api/books');
        if (!response.ok) throw new Error(`HTTP error  ${response.status}`);

        const books = await response.json();

        if (books.length === 0) {
            bookList.innerHTML = "<p>Brak książek w bazie.</p>";
            return;
        }

        bookList.innerHTML = "";
        books.forEach(book => {
            const title = book.Title || "Brak tytułu";

            const authors = Array.isArray(book.Authors)
                ? book.Authors.map(a => a.Name).join(", ")
                : "Nieznani autorzy";

            const publicationDate = book.PublicationDate || "Brak daty";

            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book");
            const coverUrl =  '' // || `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`;
            bookDiv.innerHTML = `
                <img src="${coverUrl}" alt="Okładka ${title}" class="cover">
                <h2>${title}</h2>
                <p><strong>Autorzy:</strong> ${authors}</p>
                <p><strong>📅 Data publikacji:</strong> ${publicationDate}</p>
                <button>Wypożycz</button>
            `;
            bookList.appendChild(bookDiv);

        });
    } catch (error) {
        bookList.innerHTML = "<p>Nie udało się załadować książek.</p>";
        console.error("Błąd pobierania książek:", error);
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    await fetchBooks();
});