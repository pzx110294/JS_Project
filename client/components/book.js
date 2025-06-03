window.Book = { renderBook: async function (book, options = {}) {
        const {showStatus = false, showAdmin = false} = options;
        const bookElement = document.createElement('div');
        if (!book.UserBook) {
  const addBtn = bookElement.querySelector(".add-to-library");
  if (addBtn) {
    addBtn.addEventListener("click", async () => {
      try {
        const res = await authFetch(`/api/library`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ BookId: book.ID }),
        });

        if (res.ok) {
          alert("Dodano książkę do Twojej biblioteki");
          // Możesz np. przeładować stronę lub zmienić stan
        } else {
          alert("Błąd podczas dodawania książki");
        }
      } catch (err) {
        console.error(err);
        alert("Wystąpił błąd po stronie klienta");
      }
    });
  }
}
        bookElement.className = 'book';

        bookElement.innerHTML = `
        <img src="${book.CoverUrl || `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`}" class="cover">
        <h3>${book.Title}</h3>
        <p>${book.Authors.map(a => `<span class="author-link" data-id="${a.id}">${a.Name}</span>`).join(", ")}</p>
    `;

        if (showStatus) {
            console.log(book)
            let statusHtml;
            if (book.Library && book.Library.length === 1) {
                statusHtml = this.renderStatusControls(book);
            }
            else if (book.UserBook) {
                book.Library = book.UserBook
                statusHtml = this.renderStatusControls(book);
            }
            else {
                statusHtml = `<button class="add-to-library" data-id="${book.id}">Dodaj do biblioteki</button>`;
            }
            bookElement.innerHTML += statusHtml;
        }

        if (showAdmin) {
            bookElement.innerHTML += `
            <div class="admin-controls">
                <button class="edit-book" data-id="${book.id}">Edytuj</button>
                <button class="delete-book" data-id="${book.id}">Usuń</button>
            </div>
        `;
        }

        return bookElement;
    },

renderStatusControls: function (book) {
    return `
        <div>Status: ${book.Library[0]}</div>
        <div class="status-controls">
            <select class="status-select" data-id="${book.id}">
                <option value="to-read" ${book.Library.status === 'to-read' ? 'selected' : ''}>Do przeczytania</option>
                <option value="reading" ${book.Library.status === 'reading' ? 'selected' : ''}>W trakcie</option>
                <option value="completed" ${book.Library.status === 'completed' ? 'selected' : ''}>Przeczytane</option>
            </select>
            <button class="save-status" data-id="${book.id}" >Zapisz</button>
        </div>
    `;
}
}
document.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("author-link")) {
    const authorId = target.dataset.id;
    window.location.href = `/views/author.html?id=${authorId}`;
  }
});
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const authorId = params.get("id");

  const bookSection = document.getElementById("author-books");
  const authorNameHeader = document.getElementById("author-name");

  if (!authorId) {
    bookSection.innerHTML = "<p>Nie podano autora.</p>";
    return;
  }

  try {
    const res = await fetch(`/api/authors/${authorId}`);
    if (!res.ok) throw new Error("Nie udało się pobrać autora");

    const author = await res.json();
    authorNameHeader.textContent = author.Name;

    if (!author.Books || author.Books.length === 0) {
      bookSection.innerHTML = "<p>Brak książek tego autora.</p>";
      return;
    }

    bookSection.innerHTML = ""; // wyczyść

    for (const book of author.Books) {
      const div = document.createElement("div");
      div.className = "book";
      const cover = `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`;

      div.innerHTML = `
        <img src="${cover}" alt="Okładka ${book.Title}" class="cover">
        <h3>${book.Title}</h3>
      `;

      bookSection.appendChild(div);
    }

  } catch (err) {
    console.error(err);
    bookSection.innerHTML = "<p>Nie udało się załadować książek autora.</p>";
  }
});
document.getElementById("back-btn").addEventListener("click", () => {
  window.location.href = "/"; // lub inna strona główna
});
