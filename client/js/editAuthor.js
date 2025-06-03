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
    const authorId = pathParts[pathParts.length - 1];


    const form = document.getElementById('author-form');
    const nameInput = document.getElementById('Name');
    const messageDiv = document.getElementById('message');

    if (!authorId) {
        messageDiv.textContent = "Nie podano autora do edycji.";
        form.style.display = "none";
        return;
    }

    try {
        const res = await fetch(`/api/authors/${authorId}`);
        if (!res.ok) {
            messageDiv.textContent = "Nie znaleziono autora.";
            form.style.display = "none";
            return;
        }
        const author = await res.json();
        nameInput.value = author.Name || '';
    } catch (err) {
        messageDiv.textContent = "Błąd ładowania autora.";
        form.style.display = "none";
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            Name: nameInput.value
        };

        const res = await authFetch(`/api/authors/${authorId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            messageDiv.textContent = 'Autor zaktualizowany!';
            setTimeout(() => window.location.href = `/authors/${authorId}`, 1500);
        } else {
            const err = await res.json();
            messageDiv.textContent = err.message || 'Błąd edycji autora';
        }
    });
});
