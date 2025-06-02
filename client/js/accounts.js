document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
    }
    try {
        const user = await getCurrentUser();
        document.getElementById('username').textContent = user.username;
        document.getElementById('role').textContent = user.role;

        document.getElementById('logoutBtn').addEventListener('click', logout);
    } catch (error) {
        throw new Error('Failed to load user data');
    }
    // Example protected API call
    loadProtectedData();
});


async function loadProtectedData() {
    try {
        const response = await authFetch(`/protected-route`);
        const data = await response.json();
        document.getElementById('protectedContent').textContent = JSON.stringify(data);
    } catch (error) {
        console.error('Failed to load data:', error);
    }
}