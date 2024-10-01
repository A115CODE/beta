alert('salida');
// logout.js
const url = 'https://xqkozqxrvoypqmbewsvp.supabase.co';

const key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const database = supabase.createClient(url, key);

document.addEventListener('DOMContentLoaded', async () => {
  const { data: sessionData, error } = await database.auth.getSession();

  if (sessionData.session) {
    document.getElementById('logout-button');
  } else {
    // Si no hay sesión válida, redirigir al usuario a la página de inicio de sesión
    window.location.href = './system/login/loging.html';
  }
});

document.getElementById('logout-button').addEventListener('click', async () => {
  const { error } = await database.auth.signOut();

  if (error) {
    alert('Error al cerrar sesión: ' + error.message);
  } else {
    // Redirigir al usuario a la página de inicio de sesión u otra página

    window.location.href = './system/login/loging.html';
  }
});
