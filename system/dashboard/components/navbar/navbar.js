// Crear y configurar la barra de navegación
const NAV_BAR = document.createElement('nav');
NAV_BAR.id = 'NAV_BAR';
NAV_BAR.innerHTML = `

<div id="SOLVER_BTN" class="btn_nav">
    <img class="icons_navbar" src="./assets/solver.svg">
    <p class="txt_btn_nav">Solver</p>
</div>

<div id="TONER_BTN" class="btn_nav">
    <img class="icons_navbar" src="./assets/toner.svg">
    <p class="txt_btn_nav">Toner</p>
</div>

<div id="TASK_BTN" class="btn_nav">
    <img class="icons_navbar" src="./assets/task.svg">
    <p class="txt_btn_nav">Task</p>
</div>

<div id="HELP_BTN" class="btn_nav">
    <img class="icons_navbar" src="./assets/help.svg">
    <p class="txt_btn_nav">Help</p>
</div>

<!-- -->

<div id="logout_button" class="btn_nav">
    <img class="icons_navbar" src="./assets/logout.svg">
</div>

`;
document.body.appendChild(NAV_BAR);

// logout.js
const url = 'https://xqkozqxrvoypqmbewsvp.supabase.co';

const key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const database = supabase.createClient(url, key);

document.addEventListener('DOMContentLoaded', async () => {
  const { data: sessionData, error } = await database.auth.getSession();

  if (sessionData.session) {
    // Usuario está autenticado, mostrar el botón de logout
    document.getElementById('logout_button').style.display = 'block';
  } else {
    // Si no hay sesión válida, redirigir al usuario a la página de inicio de sesión
    window.location.href = '../../system/login/login.html';
  }
});

document.getElementById('logout_button').addEventListener('click', async () => {
  const { error } = await database.auth.signOut();

  if (error) {
    alert('Error al cerrar sesión: ' + error.message);
  } else {
    // Eliminar el indicador de autenticación de sessionStorage
    sessionStorage.removeItem('authenticated');

    // Redirigir al usuario a la página de inicio de sesión u otra página
    window.location.href = '../../system/login/login.html';
  }
});
