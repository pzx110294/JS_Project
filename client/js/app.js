document.addEventListener("DOMContentLoaded", async () => {
    await checkUser();
    await fetchBooks();
});

async function fetchBooks() {
    const bookList = document.getElementById("book-list");

    try {
        const response = await fetch("/api/books");
        if (!response.ok) throw new Error("Błąd sieci");

        const books = await response.json();
        console.log("Dane książek:", books);

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
            const coverUrl = book.CoverUrl || `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`;
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
async function checkUser() {
    if (isAuthenticated()) {
        const user = await getCurrentUser();
        const role = user.role;
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('library-btn').style.display = 'inline-block';
        document.getElementById('logout-btn').style.display = 'inline-block';
        document.getElementById('admin-btn').style.display = role === 'admin' ? 'inline-block' : 'none';
        document.getElementById('user').textContent = user.username;
    }
}
document.getElementById('logout-btn').addEventListener('click', logout);
