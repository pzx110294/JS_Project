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
            const bookElement = Book.renderBook(book, {
                showStatus: isAuthenticated()
            });
            
        //     const title = book.Title || "Brak tytułu";
        //
        //     const authors = Array.isArray(book.Authors)
        //         ? book.Authors.map(a => a.Name).join(", ")
        //         : "Nieznani autorzy";
        //
        //     const publicationDate = book.PublicationDate || "Brak daty";
        //
        //     const bookDiv = document.createElement("div");
        //     bookDiv.classList.add("book");
        //     const coverUrl =  ''  || `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`;
        //     bookDiv.innerHTML = `
        //         <img src="${coverUrl}" alt="Okładka ${title}" class="cover">
        //         <h2>${title}</h2>
        //         <p><strong>Autorzy:</strong> ${authors}</p>
        //         <p><strong>📅 Data publikacji:</strong> ${publicationDate}</p>
        //         <p><strong>Status:</strong> ${book.status}</p>
        //
        //         <div class="book-actions">
        //             <button class="borrow-btn">Wypożycz</button>
        //             <div class="menu-wrapper">
        //                 <button class="menu-button">⋮</button>
        //                 <div class="menu-dropdown">
        //             <button class="edit-btn" data-id="${book.id}">Edit</button>
        //             <button class="delete-btn" data-id="${book.id}">Delete</button>
        //         </div>
        //     </div>
        // </div>
        // `;
        //
            bookList.appendChild(bookElement);

        });
    } catch (error) {
        bookList.innerHTML = "<p>Nie udało się załadować książek.</p>";
        console.error("Błąd pobierania książek:", error);
    }
}
document.addEventListener("DOMContentLoaded", async () => {
    await fetchBooks();
});

document.addEventListener("click", (e) => {
  const allMenus = document.querySelectorAll(".menu-dropdown");
  allMenus.forEach(menu => (menu.style.display = "none"));

  if (e.target.classList.contains("menu-button")) {
    const menu = e.target.nextElementSibling;
    menu.style.display = "block";
    e.stopPropagation();
  }
});

// Obsługa kliknięcia w przycisk "Edit"
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const bookId = e.target.dataset.id;
    window.location.href = `/editBook.html?id=${bookId}`;
  }
});