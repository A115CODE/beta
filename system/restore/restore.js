const url = 'https://xqkozqxrvoypqmbewsvp.supabase.co';
const key = 'tu_api_key';

const database = supabase.createClient(url, key);

document.getElementById('update-password-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const newPassword = document.getElementById('new-password').value;

    try {
        const { error } = await database.auth.updateUser({ password: newPassword });

        if (error) throw error;

        alert('Tu contraseña ha sido actualizada exitosamente.');
        // Redirigir o mostrar un mensaje adicional si es necesario
    } catch (error) {
        console.error('Error:', error.message);
        alert('Hubo un error al actualizar la contraseña: ' + error.message);
    }
});