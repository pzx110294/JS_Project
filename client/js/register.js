function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            document.getElementById('message').textContent = "Passwords don't match!";
            return;
        }

        try {
            const { token } = await register(username, password);
            localStorage.setItem('authToken', token);
            window.location.href = '/';
        } catch (err) {
            document.getElementById('message').textContent = err.message;
        }
    });
}

document.addEventListener('DOMContentLoaded', setupRegisterForm);