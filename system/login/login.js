const url = 'https://xqkozqxrvoypqmbewsvp.supabase.co';

const key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const database = supabase.createClient(url, key);

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { data, error } = await database.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    alert('Error en el inicio de sesión: ' + error.message);
  } else {
    alert('Inicio de sesión exitoso');

    // Almacena un valor en sessionStorage para indicar que el usuario está autenticado
    sessionStorage.setItem('authenticated', 'true');

    // Redirige al dashboard
    window.location.href = '../dashboard/dashboard.html';
  }
});
