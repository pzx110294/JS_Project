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
            let statusHtml;
            if (book.Library.length === 1) {
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