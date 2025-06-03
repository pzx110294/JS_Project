(async function verifyAdminAccess() {
    try {
        const user = await getCurrentUser();
        if (user.role !== 'admin') {
            window.location.href = "/";
        }
    } catch (error) {
        console.log(error);
        window.location.href = "/login";
    }
})();

document.addEventListener('DOMContentLoaded', async () => {
    const pathParts = window.location.pathname.split('/');
    const genreId = pathParts[pathParts.length - 1];

    const form = document.getElementById('genre-form');
    const nameInput = document.getElementById('Name');
    const messageDiv = document.getElementById('message');

    if (!genreId) {
        messageDiv.textContent = "Nie podano gatunku do edycji.";
        form.style.display = "none";
        return;
    }

    try {
        const res = await fetch(`/api/genres/${genreId}`);
        if (!res.ok) {
            messageDiv.textContent = "Nie znaleziono gatunku.";
            form.style.display = "none";
            return;
        }
        const genre = await res.json();
        nameInput.value = genre.Name || '';
    } catch (err) {
        messageDiv.textContent = "Błąd ładowania gatunku.";
        form.style.display = "none";
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            Name: nameInput.value
        };

        const res = await authFetch(`/api/genres/${genreId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            messageDiv.textContent = 'Gatunek zaktualizowany!';
            setTimeout(() => window.location.href = `/genres/${genreId}`, 1500);
        } else {
            const err = await res.json();
            messageDiv.textContent = err.message || 'Błąd edycji gatunku';
        }
    });
});
