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
            console.log(book)
            const title = book.Title || "Brak tytułu";

            const authors = book.Authors?.length > 0
                ? book.Authors.map(author => author.Name).join(', ')
                : "Nieznany autor";

            const genres = book.Genres?.length > 0
                ? book.Genres.map(genre => genre.username).join(', ')
                : 'Nieznany gatunek';
            const status = book.UserBook.status || "Nieznany status";
            const coverUrl =   `https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg`;
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book-item');
            bookDiv.innerHTML = `
                <h3>${title}</h3>
                <img src="${coverUrl}" alt="Okładka ${title}" class="cover">
                <p><strong>Autor:</strong> ${authors}</p>
                <p><strong>Status:</strong> ${status}</p>
                <button class="update-btn" data-id="${book.id}">Zmień status</button>
                <button class="delete-btn" data-id="${book.id}">Usuń</button>
            `;
            librarySection.appendChild(bookDiv);
        }
        // const response = await fetch('/api/library', {
        //     headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        // });
        //
        // if (!response.ok) throw new Error("Błąd ładowania biblioteki");
        // const library = await response.json();
        //
        // console.log(library);
        // if (library.length === 0) {
        //     librarySection.innerHTML = "<p>Brak książek w bibliotece</p>";
        //     return;
        // }
        //
        // librarySection.innerHTML = "";
        // library.forEach(book => {
        //     const title = book.title || "Brak tytułu";
        //     const author = book.author || "Nieznany autor";
        //     const status = book.status || "Nieznany status";
        //     // 
        //     const bookDiv = document.createElement('div');
        //     bookDiv.classList.add('book-item');
        //     bookDiv.innerHTML = `
        //         <h3>${title}</h3>
        //         <p><strong>Autor:</strong> ${author}</p>
        //         <p><strong>Status:</strong> ${status}</p>
        //         <button class="update-btn" data-id="${book.id}">Zmień status</button>
        //         <button class="delete-btn" data-id="${book.id}">Usuń</button>
        //     `;
        //     librarySection.appendChild(bookDiv);
        // });
        //
        // // Attach event listeners
        // document.querySelectorAll('.update-btn').forEach(btn => {
        //     btn.addEventListener('click', handleStatusUpdate);
        // });
        //
        // document.querySelectorAll('.delete-btn').forEach(btn => {
        //     btn.addEventListener('click', handleBookDelete);
        // });

    } catch (error) {
        librarySection.innerHTML = "<p>Wystąpił błąd podczas ładowania biblioteki</p>";
        console.error("Błąd:", error);
    }
}


async function handleStatusUpdate(e) {
    const bookId = e.target.dataset.id;
    // Implement status update logic using PUT /api/library/:id
}

async function handleBookDelete(e) {
    const bookId = e.target.dataset.id;
    // Implement delete logic using DELETE /api/library/:id
}