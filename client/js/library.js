document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = '/login';
    }
    await fetchUserLibrary();
});

async function fetchUserLibrary() {
    const librarySection = document.getElementById('user-library');

    try {
        const response = await authFetch('/api/library');
        const data = await response.json();
        const library = data.Library;
        if (library.length === 0) {
                librarySection.innerHTML = "<p>Brak książek w bibliotece</p>";
                return;
        }
        librarySection.innerHTML = "";
        for (const book of library) {
            const bookElement = await Book.renderBook(book, {
                showStatus: isAuthenticated()
            });
            librarySection.appendChild(bookElement);
            // const title = book.Title || "Brak tytułu";
            //
            // const authors = book.Authors?.length > 0
            //     ? book.Authors.map(author => author.Name).join(', ')
            //     : "Nieznany autor";
            //
            // const genres = book.Genres?.length > 0
            //     ? book.Genres.map(genre => genre.Name).join(', ')
            //     : 'Nieznany gatunek';
            // const status = book.UserBook.status || "Nieznany status";
            // const coverUrl =   `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`;
            // const bookDiv = document.createElement('div');
            // bookDiv.classList.add('book-item');
            // bookDiv.innerHTML = `
            //     <h3>${title}</h3>
            //     <img src="${coverUrl}" alt="Okładka ${title}" class="cover">
            //     <p><strong>Autorzy:</strong> ${authors}</p>
            //     <p><strong>Gatunki:</strong> ${genres}</p>
            //     <p><strong>Status:</strong> ${status}</p>
            //     <label>
            //         <strong>Status:</strong>
            //         <select class="status-select" data-id="${book.id}">
            //             <option value="to read" ${status === 'to read' ? 'selected' : ''}>Do przeczytania</option>
            //             <option value="reading" ${status === 'reading' ? 'selected' : ''}>W trakcie</option>
            //             <option value="finished" ${status === 'finished' ? 'selected' : ''}>Przeczytane</option>
            //         </select>
            //     </label>
            //     <button class="update-btn" data-id="${book.id}">Zapisz</button>
            //     <button class="delete-btn" data-id="${book.id}">Usuń</button>
            // `;
            // librarySection.appendChild(bookDiv);
        }
        
        document.querySelectorAll('.update-btn').forEach(btn => {
            btn.addEventListener('click', handleStatusUpdate);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleBookDelete);
        });

    } catch (error) {
        librarySection.innerHTML = "<p>Wystąpił błąd podczas ładowania biblioteki</p>";
        console.error("Błąd:", error);
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
           window.location.href = '/library';
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
        window.location.href = '/library';
    }
    catch (error) {
        console.error("Bląd usunięcia: ", error)
    }
}