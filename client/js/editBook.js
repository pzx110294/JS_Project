(async function verifyAdminAccess() {
    try {
        const user = await getCurrentUser();
        if (user.role !== 'admin') {
            alert("Tylko administratorzy mogą edytować książki.");
            window.location.href = "/";
        }
    } catch (error) {
        console.log(error);
        window.location.href = "/login";
    }
})();

document.addEventListener('DOMContentLoaded', async () => {
    const pathParts = window.location.pathname.split('/');
    const bookId = pathParts[pathParts.length - 1];

    const messageDiv = document.getElementById('message');
    if (!bookId) {
        messageDiv.textContent = "Nie podano książki do edycji.";
        return;
    }

    const authors = await fetch('/api/authors').then(res => res.json());
    const genres = await fetch('/api/genres').then(res => res.json());

    const authorSelect = document.getElementById('author');
    const genreSelect = document.getElementById('genre');

    for (const author of authors) {
        const option = document.createElement('option');
        option.value = author.id;
        option.textContent = author.Name;
        authorSelect.appendChild(option);
    }

    for (const genre of genres) {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.Name;
        genreSelect.appendChild(option);
    }

    const bookRes = await fetch(`/api/books/${bookId}`);
    if (!bookRes.ok) {
        messageDiv.textContent = "Nie znaleziono książki.";
        return;
    }
    const book = await bookRes.json();
    console.log(book)
    document.getElementById('title').value = book.Title || '';
    document.getElementById('ISBN').value = book.ISBN || '';
    document.getElementById('PublicationDate').value = book.PublicationDate
        ? new Date(book.PublicationDate).toISOString().split('T')[0]
        : '';

    if (book.Authors) {
        for (const author of book.Authors) {
            const opt = Array.from(authorSelect.options).find(o => o.value == author.id);
            if (opt) opt.selected = true;
        }
    }

    if (book.Genres) {
        for (const genre of book.Genres) {
            const opt = Array.from(genreSelect.options).find(o => o.value == genre.id);
            if (opt) opt.selected = true;
        }
    }

    document.getElementById('edit-book-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);

        const authorIds = Array.from(authorSelect.selectedOptions).map(opt => opt.value);
        const genreIds = Array.from(genreSelect.selectedOptions).map(opt => opt.value);

        let date = formData.get('PublicationDate');
        if (date.trim() === '') {
            date = null;
        } 
        
        const payload = {
            Title: formData.get('title'),
            ISBN: formData.get('ISBN'),
            PublicationDate: date, 
            AuthorId: authorIds,
            GenreId: genreIds
        };

        const res = await authFetch(`/api/books/${bookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            messageDiv.textContent = 'Książka zaktualizowana!';
        } else {
            const err = await res.json();
            messageDiv.textContent = err.message || 'Błąd edycji książki';
        }
    });
});
