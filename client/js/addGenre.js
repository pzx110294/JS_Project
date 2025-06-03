(async function verifyAdminAccess() {
    try {
        const user = await getCurrentUser();
        if (user.role !== 'admin') {
            alert("Tylko administratorzy mogą dodawać gatunki.");
            window.location.href = "/";
        }
    } catch (error) {
        console.log(error);
        console.warn("User not authenticated or fetch failed");
        window.location.href = "/login";
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('genre-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const payload = {
            Name: formData.get('Name')
        };

        const res = await authFetch('/api/genres', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const messageDiv = document.getElementById('message');
        if (res.ok) {
            messageDiv.textContent = 'Gatunek dodany!';
            form.reset();
            setTimeout(() => window.location.href = "/", 1500);
        } else {
            const err = await res.json();
            messageDiv.textContent = err.message || 'Błąd dodawania gatunku';
        }
    });
});
