const statusTranslations = {
    'to read': 'Do przeczytania',
    'reading': 'W trakcie',
    'finished': 'Przeczytane'
};
window.Book = {
    sortBooks: function(books, order = 'newest') {
        return [...books].sort((a, b) => {
            const dateA = new Date(a.PublicationDate || 0);
            const dateB = new Date(b.PublicationDate || 0);
            return order === 'newest' ? dateB - dateA : dateA - dateB;
        });
    },
    renderBook: async function (book, options = {}) {
        const {isUserAuthenticated = false, isAdmin = false} = options;
        
        const bookElement = document.createElement('div');
        bookElement.className = 'book';

        bookElement.innerHTML = `
        <img src="${`https://covers.openlibrary.org/b/isbn/${book.ISBN}-M.jpg?default=false`}" class="cover"
        onerror="this.onerror=null;this.src='/images/default-cover.jpg';">
        <h3>${book.Title}</h3>
        <p>${book.Authors?.map(a =>
            `<a href="/authors/${a.id}" style="color: black; text-decoration: none;">${a.Name}</a>`)
            .join(', ') || 'Nieznany autor'}</p>
        <p>${book.Genres?.map(a => `<a href="/genres/${a.id}" style="color: black; text-decoration: none;">${a.Name}</a>`)
            .join(', ') || 'Brak gatunku'}</p>
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
                    <button class="edit-btn" data-id="${book.id}" >Edytuj</button>
                    <button class="delete-btn" data-id="${book.id}" >Usuń</button>
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
        window.location.reload();
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
    const confirmed = window.confirm("Czy na pewno chcesz usunąć tę książkę z biblioteki?");
    if (!confirmed) return;
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