// LAUNCH
function display(btn, app) {
  const APLICATION = document.getElementById(app);

  // Ocultar todas las aplicaciones al inicio
  APLICATION.style.display = 'none';

  // Agregar listener al botón para mostrar/ocultar solo la aplicación correspondiente
  document.getElementById(btn).addEventListener('click', () => {
    if (APLICATION.style.display === 'block') {
      APLICATION.style.display = 'none';
    } else {
      APLICATION.style.display = 'block';
    }
  });
}

// Llamada a la función display para cada botón y aplicación
display('SOLVER_BTN', 'SOLVER_APP');
display('TASK_BTN', 'TASK_APP');
display('TONER_BTN', 'TONER_APP');
display('HELP_BTN', 'HELP_APP');
