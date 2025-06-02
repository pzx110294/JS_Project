(async function verifyAdminAccess() {
    try {
        console.log(isAuthenticated());
        const user = await getCurrentUser();
        console.log(`user: `);
        console.log(user);
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
document.getElementById("book-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = {
        Title: e.target.Title.value,
        ISBN: e.target.ISBN.value,
        PublicationDate: e.target.PublicationDate.value,
        AuthorId: e.target.Authors.value,
        GenreId: e.target.Authors.value
    };

    try {
        const response = await authFetch("/api/books", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
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