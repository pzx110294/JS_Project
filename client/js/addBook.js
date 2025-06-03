(async function verifyAdminAccess() {
    try {
        const user = await getCurrentUser();
        if (user.role !== 'admin') {
            alert("Tylko administratorzy mogą dodawać książki.");
            window.location.href = "/";
        }
    } catch (error) {
        console.log(error);
        console.warn("User not authenticated or fetch failed");
        window.location.href = "/login";
    }
})();

document.addEventListener('DOMContentLoaded', async () => {
    const authors = fetch('/api/authors').then(res => res.json());
    const genres = fetch('/api/genres').then(res => res.json());


    const authorSelect = document.getElementById('author-select');
    const genreSelect = document.getElementById('genre-select');

    for (const author of await authors) {
        const option = document.createElement('option');
        option.value = author.id;
        option.textContent = author.Name;
        authorSelect.appendChild(option);
    }

    for (const genre of await genres) {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.Name;
        genreSelect.appendChild(option);
    }

    document.getElementById('book-form').addEventListener('submit', async (e) => {
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
            Title: formData.get('Title'),
            ISBN: formData.get('ISBN'),
            PublicationDate: date, 
            AuthorId: authorIds,
            GenreId: genreIds
        };

        const res = await authFetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const messageDiv = document.getElementById('message');
        if (res.ok) {
            messageDiv.textContent = 'Książka dodana!';
            form.reset();
            setTimeout(() => window.location.href = "/", 1500);
        } else {
            const err = await res.json();
            messageDiv.textContent = err.message || 'Błąd dodawania książki';
        }
    });
});
