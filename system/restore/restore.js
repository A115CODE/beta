// restore.js

// Primero, verificamos si el token está en los parámetros de consulta
let accessToken = new URLSearchParams(window.location.search).get(
  'access_token'
);

// Si no lo encontramos, lo buscamos en el fragmento de la URL
if (!accessToken) {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  accessToken =
    hashParams.get('access_token') ||
    hashParams.get('token') ||
    hashParams.get('auth_token');
}

const url = 'https://xqkozqxrvoypqmbewsvp.supabase.co';
const key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const database = supabase.createClient(url, key);

document
  .getElementById('reset-password-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPassword = document.getElementById('new-password').value;

    if (!accessToken) {
      alert('Token de acceso no encontrado en la URL.');
      return;
    }

    try {
      // Establece la nueva contraseña utilizando el token de acceso
      const { error } = await database.auth.verifyOTP({
        token: accessToken,
        type: 'recovery',
        password: newPassword,
      });

      if (error) throw error;

      alert(
        'Contraseña restablecida con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.'
      );
      window.location.href = '/login.html'; // Redirige al login después de restablecer la contraseña
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error.message);
      alert('Hubo un error al restablecer la contraseña.');
    }
  });
