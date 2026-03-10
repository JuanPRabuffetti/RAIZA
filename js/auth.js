// auth.js - Registro, login y sesión usando localStorage

class AuthManager {
    constructor() {
        this.usersKey = 'raiza_users';
        this.sessionKey = 'raiza_session';
        this.currentUser = null;
        this.loadSession();
    }

    loadUsers() {
        const raw = localStorage.getItem(this.usersKey);
        if (!raw) return [];

        try {
            const users = JSON.parse(raw);
            return Array.isArray(users) ? users : [];
        } catch {
            return [];
        }
    }

    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    saveSession(user) {
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        localStorage.setItem(this.sessionKey, JSON.stringify(safeUser));
        this.currentUser = safeUser;
    }

    loadSession() {
        const raw = localStorage.getItem(this.sessionKey);
        if (!raw) {
            this.currentUser = null;
            return;
        }

        try {
            this.currentUser = JSON.parse(raw);
        } catch {
            this.currentUser = null;
        }
    }

    clearSession() {
        localStorage.removeItem(this.sessionKey);
        this.currentUser = null;
    }

    emailExists(email) {
        const users = this.loadUsers();
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    register(name, email, password) {
        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedName || !normalizedEmail || !password) {
            return { ok: false, message: 'Completa todos los campos' };
        }

        if (password.length < 6) {
            return { ok: false, message: 'La contraseña debe tener al menos 6 caracteres' };
        }

        if (this.emailExists(normalizedEmail)) {
            return { ok: false, message: 'Ese correo ya está registrado' };
        }

        const users = this.loadUsers();
        const newUser = {
            id: Date.now(),
            name: normalizedName,
            email: normalizedEmail,
            password
        };

        users.push(newUser);
        this.saveUsers(users);
        this.saveSession(newUser);

        return { ok: true, user: this.currentUser };
    }

    login(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const users = this.loadUsers();
        const user = users.find(u => u.email === normalizedEmail && u.password === password);

        if (!user) {
            return { ok: false, message: 'Correo o contraseña incorrectos' };
        }

        this.saveSession(user);
        return { ok: true, user: this.currentUser };
    }

    logout() {
        this.clearSession();
    }

    isLoggedIn() {
        return Boolean(this.currentUser);
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

const auth = new AuthManager();

function updateAuthUI() {
    const controls = document.getElementById('authControls');
    const userMenu = document.getElementById('userMenu');
    const userGreeting = document.getElementById('userGreeting');

    if (!controls || !userMenu || !userGreeting) {
        return;
    }

    if (auth.isLoggedIn()) {
        const user = auth.getCurrentUser();
        userGreeting.textContent = `Hola, ${user.name}`;
        controls.style.display = 'none';
        userMenu.style.display = 'flex';
    } else {
        controls.style.display = 'flex';
        userMenu.style.display = 'none';
        userGreeting.textContent = '';
    }
}

function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;

    modal.classList.add('active');
    switchAuthTab(mode);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;

    modal.classList.remove('active');
}

function switchAuthTab(mode) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const authTitle = document.getElementById('authTitle');

    if (!loginForm || !registerForm || !loginTab || !registerTab || !authTitle) {
        return;
    }

    const isLogin = mode === 'login';

    loginForm.classList.toggle('auth-hidden', !isLogin);
    registerForm.classList.toggle('auth-hidden', isLogin);
    loginTab.classList.toggle('active', isLogin);
    registerTab.classList.toggle('active', !isLogin);
    authTitle.textContent = isLogin ? 'Ingresar' : 'Crear cuenta';
}

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const result = auth.register(name, email, password);
    if (!result.ok) {
        showNotification(result.message, 'error');
        return;
    }

    updateAuthUI();
    if (typeof cart !== 'undefined') {
        cart.loadFromStorage();
        updateCartUI();
    }
    closeAuthModal();
    event.target.reset();
    showNotification('Cuenta creada correctamente', 'success');
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const result = auth.login(email, password);
    if (!result.ok) {
        showNotification(result.message, 'error');
        return;
    }

    updateAuthUI();
    if (typeof cart !== 'undefined') {
        cart.loadFromStorage();
        updateCartUI();
    }
    closeAuthModal();
    event.target.reset();
    showNotification('Sesión iniciada correctamente', 'success');
}

function logoutUser() {
    auth.logout();
    updateAuthUI();
    if (typeof cart !== 'undefined') {
        cart.loadFromStorage();
        updateCartUI();
    }
    showNotification('Sesión cerrada', 'info');
}

// Cerrar modal auth al hacer clic en el fondo
document.addEventListener('click', function(event) {
    const authModal = document.getElementById('authModal');
    if (!authModal || !authModal.classList.contains('active')) {
        return;
    }

    if (event.target === authModal) {
        closeAuthModal();
    }
});
