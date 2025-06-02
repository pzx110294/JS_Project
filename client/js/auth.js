document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const token = await login(username, password);
        localStorage.setItem('authToken', token);
        window.location.href = '/';
    } catch (error) {
        document.getElementById('message').textContent = error.message;
    }
});
async function login(username, password) {
    const response = await fetch(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username: username, 
            password: password 
        })
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    const { token } = await response.json();
    return token;
}
function isAuthenticated() {
    return localStorage.getItem('authToken') !== null;
}

async function authFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Not authenticated');
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(url, options);

    if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Session expired');
    }

    return response;
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/';
}


async function  getCurrentUser() {
    const response = await authFetch('/api/me');
    return response.json();
}


async function register(username, password) {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }
    return await response.json();
}

async function updateNavbar(user) {
    document.getElementById('login-btn').style.display = 'none';
    document.getElementById('register-btn').style.display = 'none';
    document.getElementById('library-btn').style.display = 'inline-block';
    document.getElementById('logout-btn').style.display = 'inline-block';
    document.getElementById('admin-btn').style.display = user.role === 'admin' ? 'inline-block' : 'none';
    document.getElementById('user').textContent = user.username;
    document.getElementById('logout-btn')?.addEventListener('click', logout);
}



window.initializeAuth = async function() {
    if (!isAuthenticated()) return;

    try {
        const user = await getCurrentUser();
        await updateNavbar(user);
    } catch (error) {
        console.error('Auth initialization error:', error);
    }
};
