const url = 'https://xqkozqxrvoypqmbewsvp.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const database = supabase.createClient(url, key);

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session }, error } = await database.auth.getSession();

  if (error || !session) {
      alert('¡Sesión de autenticación faltante o inválida!');
      return;
  }

  // El usuario está autenticado, puedes continuar con el restablecimiento de la contraseña.
  document.getElementById('update-password-form').addEventListener('submit', async (event) => {
      event.preventDefault();

      const newPassword = document.getElementById('new-password').value;

      try {
          const { error } = await database.auth.updateUser({ password: newPassword });

          if (error) throw error;

          alert('Tu contraseña ha sido actualizada exitosamente.');
      } catch (error) {
          console.error('Error:', error.message);
          alert('Hubo un error al actualizar la contraseña: ' + error.message);
      }
  });
});