// Auth
// Verificación de autenticación en Dashboard
if (sessionStorage.getItem('authenticated') !== 'true') {
  // Si el usuario no está autenticado, redirigir al login
  window.location.href = '../login/login.html';
}

function DEPLOY_SCRIPT(SRC) {
  const SCRIPT = document.createElement('script');
  SCRIPT.type = 'module';
  SCRIPT.src = SRC;
  document.body.appendChild(SCRIPT);
}
function DEPLOY_CSS(URL) {
  const CSS = document.createElement('link');
  CSS.rel = 'stylesheet';
  CSS.href = URL;
  document.head.appendChild(CSS);
}

// APPs
//  SOLVER
DEPLOY_SCRIPT('./apps/solver/solver.js');
DEPLOY_CSS('./apps/solver/solver.css');

//  TONER
DEPLOY_SCRIPT('./apps/toner/toner.js');
DEPLOY_CSS('./apps/toner/toner.css');

//  TASK
DEPLOY_SCRIPT('./apps/task/task.js');
DEPLOY_CSS('./apps/task/task.css');

//  HELP
DEPLOY_SCRIPT('./apps/help/help.js');
DEPLOY_CSS('./apps/help/help.css');

// Components
// NAVBAR
DEPLOY_SCRIPT('./components/navbar/navbar.js');
DEPLOY_SCRIPT('./components/navbar/launch.js');
DEPLOY_CSS('./components/navbar/navbar.css');
// MOVILE DETECT
DEPLOY_SCRIPT('./components/lock/lock.js');
DEPLOY_CSS('./components/lock/lock.css');
