window.Book = { renderBook: async function (book, options = {}) {
        const {showStatus = false, showAdmin = false} = options;
        const bookElement = document.createElement('div');
        bookElement.className = 'book';

        bookElement.innerHTML = `
        <img src="${book.CoverUrl || `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`}" class="cover">
        <h3>${book.Title}</h3>
        <p>${book.Authors?.map(a => a.Name).join(', ') || 'Unknown author'}</p>
    `;

        if (showStatus) {
            console.log(book)
            let statusHtml;
            if (book.Library && book.Library.length === 1) {
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
    console.log(book)
    return `
        <div class="status-controls">
            <select class="status-select" data-id="${book.id}">
                <option value="to-read" ${book.Library[0].status === 'to-read' ? 'selected' : ''}>Do przeczytania</option>
                <option value="reading" ${book.Library[0].status === 'reading' ? 'selected' : ''}>W trakcie</option>
                <option value="completed" ${book.Library[0].status === 'completed' ? 'selected' : ''}>Przeczytane</option>
            </select>
            <button class="save-status" data-id="${book.id}" >Zapisz</button>
        </div>
    `;
}
}
async function filterBooksByAuthor(authorId) {
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