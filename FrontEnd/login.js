document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            const response = await fetch('http://127.0.0.1:3000/api/login', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('Login realizado com sucesso!');
                window.location.href = data.redirectUrl;
            } else {
               alert("Usuario ou senha invalido, tente novamente");
            }

        } catch (error) {
            console.error('Falha na requisição de login:', error);
            alert("Problemas tecnicos no servidor, tente novamente");
        }
    });
});