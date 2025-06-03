document.addEventListener('DOMContentLoaded', async () => {
    await fetchUserLibrary();
});

async function fetchUserLibrary() {
    const isUserAuthenticated = isAuthenticated();
    if (!isUserAuthenticated) {
        window.location.href = '/login';
    }
    const librarySection = document.getElementById('user-library');
    try {
        const response = await authFetch('/api/library');
        const data = await response.json();
        const library = data.Library;
        if (library.length === 0) {
                librarySection.innerHTML = "<p>Brak książek w bibliotece</p>";
                return;
        }
        const user = await getCurrentUser();
        const isAdmin = user?.role === 'admin';
        librarySection.innerHTML = "";
        for (const book of library) {
            const bookElement = await Book.renderBook(book, {
                isUserAuthenticated, isAdmin
            });
            librarySection.appendChild(bookElement);

        }
        
        

    } catch (error) {
        librarySection.innerHTML = "<p>Wystąpił błąd podczas ładowania biblioteki</p>";
        console.error("Błąd:", error);
    }
}

   