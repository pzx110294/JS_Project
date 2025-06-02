document.addEventListener('DOMContentLoaded', async () => {
    await checkUser();
    await fetchUserLibrary();
});

async function fetchUserLibrary() {
    const librarySection = document.getElementById('user-library');

    try {
        const response = await fetch('/api/library', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });

        if (!response.ok) throw new Error("Błąd ładowania biblioteki");
        const library = await response.json();

        if (library.length === 0) {
            librarySection.innerHTML = "<p>Brak książek w bibliotece</p>";
            return;
        }

        librarySection.innerHTML = "";
        library.forEach(book => {
            const title = book.title || "Brak tytułu";
            const author = book.author || "Nieznany autor";
            const status = book.status || "Nieznany status";

            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book-item');
            bookDiv.innerHTML = `
                <h3>${title}</h3>
                <p><strong>Autor:</strong> ${author}</p>
                <p><strong>Status:</strong> ${status}</p>
                <button class="update-btn" data-id="${book.id}">Zmień status</button>
                <button class="delete-btn" data-id="${book.id}">Usuń</button>
            `;
            librarySection.appendChild(bookDiv);
        });

        // Attach event listeners
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
    // Implement status update logic using PUT /api/library/:id
}

async function handleBookDelete(e) {
    const bookId = e.target.dataset.id;
    // Implement delete logic using DELETE /api/library/:id
}