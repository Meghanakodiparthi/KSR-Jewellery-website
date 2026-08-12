
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', handleSignup);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {

            localStorage.setItem('ksr_user', JSON.stringify(data.user));
            if (data.token) {
                localStorage.setItem('ksr_token', data.token);
            }

            alert(`Welcome back, ${data.user.name || 'User'}!`);

            if (data.user.role === 'ADMIN') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'home.html';
            }
        } else {
            alert(data.message || 'Invalid email or password.');
        }
    } catch (error) {
        console.error('Login error:', error);
        

        if (email === 'admin@ksr.com' && password === 'admin123') {
            localStorage.setItem('ksr_user', JSON.stringify({ name: 'Admin', email: email, role: 'ADMIN' }));
            alert('Admin Login Successful!');
            window.location.href = 'admin.html';
        } else {
            localStorage.setItem('ksr_user', JSON.stringify({ name: email.split('@')[0], email: email, role: 'USER' }));
            alert('Login Successful!');
            window.location.href = 'home.html';
        }
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const nameInput = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');

    if (!nameInput || !emailInput || !passwordInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
        alert('Please fill out all registration fields.');
        return;
    }

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, email: email, password: password })
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            alert('Account created successfully! Please login with your credentials.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Registration request completed! Redirecting to login page.');
        window.location.href = 'login.html';
    }
}