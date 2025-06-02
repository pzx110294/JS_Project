document.getElementById("book-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch("/api/books", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        const msg = document.getElementById("message");

        if (response.ok) {
            msg.textContent = "Książka została dodana pomyślnie!";
            msg.style.color = "green";
            form.reset();
        } else {
            msg.textContent = `Błąd: ${result.error || "nieznany"}`;
        }
    } catch (err) {
        console.error(err);
        document.getElementById("message").textContent = "Wystąpił błąd podczas wysyłki.";
    }
});