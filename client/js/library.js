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
            const bookElement = await Book.renderBook(book, {
                showStatus: isAuthenticated()
            });
            librarySection.appendChild(bookElement);

        }
        
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
           window.location.href = '/library';
       } catch (err) {
           console.error("Błąd aktualizacji statusu:", err);
       }
}

async function handleBookDelete(e) {
    const bookId = e.target.dataset.id;
    try {
        const response = await authFetch(`/api/library/${bookId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const error = await response.json();
            throw error;
        }
        window.location.href = '/library';
    }
    catch (error) {
        console.error("Bląd usunięcia: ", error)
    }
}