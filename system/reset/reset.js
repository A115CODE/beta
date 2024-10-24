// reset.js
const url = 'https://xqkozqxrvoypqmbewsvp.supabase.co';

const key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const database = supabase.createClient(url, key);

document
  .getElementById('reset_password_form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;

    try {
      // Solicita un enlace de restablecimiento de contraseña
      const { error } = await database.auth.reset_password_for_email(email, {
        redirectTo:
          'https://a115code.github.io/ricoh/system/restore/restore.html',
      });

      if (error) throw error;

      alert(
        'Revisa tu correo para continuar el restablecimiento de la contraseña.'
      );

      // Puedes redirigir al usuario o mostrar un mensaje de éxito aquí
    } catch (error) {
      console.error('Error:', error.message);
      alert('Hubo un error al restablecer la contraseña.' + error.message);
    }
  });
