const url = 'https://xqkozqxrvoypqmbewsvp.supabase.co';

const key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const database = supabase.createClient(url, key);

// register.js
document
  .getElementById('registro_form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('registro_email').value;
    const password = document.getElementById('registro_password').value;

    const { data, error } = await database.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert('Error en el registro: ' + error.message);
    } else {
      alert('Registro exitoso. Por favor, verifica tu email.');
    }
  });
