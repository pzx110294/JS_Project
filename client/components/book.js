const statusTranslations = {
    'to read': 'Do przeczytania',
    'reading': 'W trakcie',
    'finished': 'Przeczytane'
};
window.Book = { renderBook: async function (book, options = {}) {
        const {isUserAuthenticated = false, isAdmin = false} = options;
        
        const bookElement = document.createElement('div');
        bookElement.className = 'book';

        bookElement.innerHTML = `
        <img src="${book.CoverUrl || `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`}" class="cover">
        <h3>${book.Title}</h3>
        <p>${book.Authors?.map(a => a.Name).join(', ') || 'Nieznany autor'}</p>
        <p>${book.Genres?.map(a => a.Name).join(', ') || 'Brak gatunku'}</p>
        <p><b>Data wydania: </b>${book.PublicationDate || 'W przyszłości'}</p>
        `;

        if (isUserAuthenticated) {
            let statusHtml;
            if(book.UserBook) {
                statusHtml = this.renderStatusControls(book.id, book.UserBook.status);
            }
            else {
                statusHtml = `<button class="add-to-library" data-id="${book.id}">Dodaj do biblioteki</button>`;
            }
            bookElement.innerHTML += statusHtml;
        }

        if (isAdmin) {
            bookElement.innerHTML += `
            <div class="admin-controls">
                <button class="menu-button">⚙️</button>
                <div class="menu-dropdown">
                    <button class="edit-btn" data-id="${book.id}">Edytuj</button>
                    <button class="delete-btn" data-id="${book.id}">Usuń</button>
                </div>
            </div>
        `;
        }
        

        return bookElement;
    },

    renderStatusControls: function (id, status) {
    const statusPl = statusTranslations[status] || status;
    return `
    <div><b>Status:</b> ${statusPl}</div>
    <div class="status-controls">
        <select class="status-select" data-id="${id}">
            <option value="to read" ${status === 'to read' ? 'selected' : ''}>Do przeczytania</option>
            <option value="reading" ${status === 'reading' ? 'selected' : ''}>W trakcie</option>
            <option value="finished" ${status === 'finished' ? 'selected' : ''}>Przeczytane</option>
        </select>
        <button class="save-status" data-id="${id}">Zapisz</button>
        <button class="delete-library-book" data-id="${id}">Usuń</button>
    </div>`;
    }
}


document.addEventListener('click', async function (e) {
    if (e.target.matches('.save-status')) {
        await handleStatusUpdate(e);
    }
    if (e.target.matches('.delete-library-book')) {
        await handleBookDelete(e);
    }
    if (e.target.matches('.add-to-library')) {
        await handleBookAdd(e);
    }
})


async function handleBookAdd(e) {
    const bookId = e.target.dataset.id;
    try {
        const response = await authFetch(`/api/library/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                BookId: bookId
            })
        });
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        window.location.href = '/library';
    }
    catch (error) {
        console.error("Bląd podczas dodawania książki: ", error);
    }
}

async function handleStatusUpdate(e) {
    const bookId = e.target.dataset.id;
    const select = document.querySelector(`.status-select[data-id="${bookId}"]`);
    const newStatus = select?.value;
    try {
        const response = await authFetch(`/api/library/${bookId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        window.location.reload();
    } catch (err) {
        console.error("Błąd aktualizacji statusu:", err);
    }
}

async function handleBookDelete(e) {
    const bookId = e.target.dataset.id;
    try {
        const response = await authFetch(`/api/library/${bookId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        window.location.reload();
    }
    catch (error) {
        console.error("Bląd usunięcia: ", error)
    }
}

document.addEventListener("click", (e) => {
    const allMenus = document.querySelectorAll(".menu-dropdown");
    allMenus.forEach(menu => (menu.style.display = "none"));

    if (e.target.classList.contains("menu-button")) {
        const menu = e.target.nextElementSibling;
        menu.style.display = "block";
        e.stopPropagation();
    }
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
        const bookId = e.target.dataset.id;
        window.location.href = `/editBook/${bookId}`;
    }
});
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        const bookId = e.target.dataset.id;
        window.location.href = `/deleteBook/${bookId}`;
    }
});
async function FilterBooksByAuthor(authorId) {
  const bookList = document.getElementById("book-list");
  const filterControls = document.getElementById("filter-controls");

  if (!bookList || !authorId) return;

  bookList.innerHTML = "<p>Ładowanie książek autora...</p>";

  try {
    console.log("📡 Pobieram autora:", authorId);

    const res = await fetch(`/api/authors/${authorId}`);
    console.log("📥 Odpowiedź:", res);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Błąd backendu:", res.status, errorText);
      throw new Error("Błąd pobierania autora");
    }

    const author = await res.json();
    console.log("✅ Dane autora:", author);

    bookList.innerHTML = "";

    if (!author.Books || !author.Books.length) {
      bookList.innerHTML = "<p>Autor nie ma przypisanych książek.</p>";
      return;
    }

    author.Books.forEach(book => {
      const cover = `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`;

      const div = document.createElement("div");
      div.classList.add("book");

      div.innerHTML = `
        <img src="${cover}" class="cover" alt="Okładka ${book.Title}">
        <h3>${book.Title}</h3>
        <p><strong>Autor:</strong> ${author.Name}</p>
        <button class="borrow-btn">Dodaj</button>
      `;

      bookList.appendChild(div);
    });

    filterControls.style.display = "block";

  } catch (err) {
    console.error(err);
    bookList.innerHTML = "<p>❌ Nie udało się załadować książek autora.</p>";
  }
}