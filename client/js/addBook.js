document.getElementById("book-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = {
        Title: e.target.Title.value,
        ISBN: e.target.ISBN.value,
        PublicationDate: e.target.PublicationDate.value,
        AuthorId: e.target.Authors.value,
        GenreId: e.target.Authors.value
    };

    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ4ODU4MTQ0LCJleHAiOjE3NDg5MDEzNDR9.Wv8NsF5L9OexXJfme8zV9hWZtW_6iSYRDFm7CZ6kP1I';
    try {
        const response = await fetch("/api/books", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        const msg = document.getElementById("message");

        if (response.ok) {
            msg.textContent = "Book added successfully!";
            msg.style.color = "green";
            e.target.reset();
        } else {
            msg.textContent = `Error: ${result.error || "Unknown error"}`;
            msg.style.color = "red";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("message").textContent = "Request failed";
        document.getElementById("message").style.color = "red";
    }
});