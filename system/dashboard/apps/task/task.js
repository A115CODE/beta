// DataBase
const urlSBtask = 'https://xqkozqxrvoypqmbewsvp.supabase.co';
const keySBtask =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const taskDB = supabase.createClient(urlSBtask, keySBtask);

// Función para obtener el usuario autenticado
const getUser = async () => {
  const {
    data: { user },
    error,
  } = await taskDB.auth.getUser();
  if (error) {
    alert('Error al obtener el usuario: ' + error.message);
    return null;
  }
  return user;
};

// Aplicación
const TASK_APP = document.createElement('section');
TASK_APP.id = 'TASK_APP';

document.body.appendChild(TASK_APP);

const TASK = document.createElement('div');
TASK.id = 'TASK';
TASK.innerHTML = `

<form id="TASK_FORM">
  <input type="text" id="INPUT_TASK" placeholder="Ingresa La Tarea" required>
  <input type="date" id="TIEMPO_FIN" required >
  <button id="SAVE_TASK">Guardar
    <img src="..../../assets/save.svg" />
  </button>
</form>

<div id="TASK_LIST">

  <h2>TUS TAREAS</h2>
  <h4 id="COUNTER_TASKS">2 tareas por finalizar</h4>

  <ul id="TASKS"></ul>

</div>

`;
TASK_APP.appendChild(TASK);

// Guardar tarea en db con usuario y fecha de creación
SAVE_TASK.addEventListener('click', async (e) => {
  e.preventDefault();

  let INPUT_TASK = document.getElementById('INPUT_TASK').value;
  let TIEMPO_LOCAL = new Date().toLocaleDateString();
  let TIEMPO_FIN = document.getElementById('TIEMPO_FIN').value;

  SAVE_TASK.innerText = 'Guardando...';
  SAVE_TASK.setAttribute('disabled', true);

  const user = await getUser();
  if (!user) {
    alert('Usuario no autenticado');
    SAVE_TASK.innerText = 'Guardar';
    SAVE_TASK.removeAttribute('disabled');
    return;
  }

  try {
    let { data, error } = await taskDB.from('TASK_DB').insert({
      tarea: INPUT_TASK,
      usuario_id: user.id,
      usuario_email: user.email,
      fecha_creacion: TIEMPO_LOCAL,
      fecha_fin: TIEMPO_FIN,
      estado: '#a5092e' // Estado inicial
    });
  
    if (error) {
      alert('No se agregó correctamente: ' + error.message);
    } else {
      alert('Agregado exitosamente');
      document.getElementById('TASK_FORM').reset();
      loadTask();
    }
  } catch (error) {
    alert('Error al conectarse a la base de datos de tasapp: ' + error.message);
  }

  SAVE_TASK.innerText = 'Guardar';
  SAVE_TASK.removeAttribute('disabled');
});

// Traer datos de la DB Task filtradas
// Función para calcular los días restantes o días de retraso
const calcularDiasRestantes = (fechaFin) => {
  const fechaActual = new Date(); // Fecha actual
  const fechaLimite = new Date(fechaFin); // Fecha de finalización

  // Calcular la diferencia en milisegundos
  const diferenciaTiempo = fechaLimite - fechaActual;

  // Convertir la diferencia de milisegundos a días
  const diasDiferencia = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

  // Si la diferencia es positiva, la fecha no ha pasado, mostrar días restantes
  if (diasDiferencia > 0) {
    return `${diasDiferencia} días restantes`;
  } else {
    // Si la diferencia es negativa, mostrar días de retraso
    const diasRetraso = Math.abs(diasDiferencia);
    return `${diasRetraso} días de retraso`;
  }
};

// Función para cargar las tareas y contar cuántas hay
const loadTask = async () => {
  const user = await getUser();
  if (!user) {
    alert('Usuario no autenticado');
    return;
  }

  let taskResults = '';
  const { data, error } = await taskDB
    .from('TASK_DB')
    .select('*')
    .eq('usuario_id', user.id)
    .order('id', { ascending: false });

  if (error) {
    alert('A Ocurrido Un Problema: ' + error.message);
  } else {
    // Contar las tareas
    const taskCount = data.length;
    document.getElementById(
      'COUNTER_TASKS'
    ).innerText = `${taskCount} tareas por finalizar`;

    // Mostrar las tareas en el HTML
    for (let datos of data) {
      const diasRestantesORetraso = calcularDiasRestantes(datos.fecha_fin);
      
      taskResults += `
        <li id="TASK">
          <div
            id="ESTADO"
            style="background-color: ${datos.estado};">
          </div>
    
          <div id="TASK_ITEM">
            <h3>${datos.tarea}</h3>
            <p>Fecha de creación: ${datos.fecha_creacion}</p>
            <p>Fecha de finalización: ${datos.fecha_fin}</p>
            <p>${diasRestantesORetraso}</p>
          </div>
    
          <div id="position">
            <button class="tooltip-btn" id="tooltipBtn">Click me</button>
            <div class="tooltip-text" id="tooltipText">
              <button class="postpone_task" data_id="${datos.id}">Posponer</button>
              <button class="finish_task" data_id="${datos.id}">Finalizar</button>
            </div>
          </div>
        </li>
      `;
    }
    
    document.getElementById('TASKS').innerHTML = taskResults;
    
    // Event listeners para los botones de posponer y finalizar
    document.querySelectorAll('.postpone_task').forEach((button) => {
      button.addEventListener('click', (e) => {
        const taskId = e.target.getAttribute('data_id');
        postponeTask(taskId); // Llama a la función de posponer
      });
    });
    
    document.querySelectorAll('.finish_task').forEach((button) => {
      button.addEventListener('click', (e) => {
        const taskId = e.target.getAttribute('data_id');
        finishTask(taskId); // Llama a la función de finalizar
      });
    });

    // Tooltip Functions
    document.querySelectorAll('.tooltip-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
    const tooltipText = btn.nextElementSibling; // Obtiene el div con clase 'tooltip-text' justo después del botón
    tooltipText.classList.toggle('visible'); // Alterna la clase 'visible' para mostrar u ocultar el tooltip
    });
    });

  }
};

loadTask();

// Función para posponer una tarea
const postponeTask = async (taskId) => {
  try {
    let { data, error } = await taskDB
      .from('TASK_DB')
      .update({ estado: '#ffa600' }) // Cambia el estado a 'pospuesto'
      .eq('id', taskId);

    if (error) {
      alert('Error al posponer la tarea: ' + error.message);
    } else {
      alert('¡Tarea pospuesta exitosamente!');
      loadTask(); // Recargar las tareas después de actualizar
    }
  } catch (error) {
    alert('Error al conectarse a la base de datos de tasapp: ' + error.message);
  }
};

// Función para finalizar una tarea
const finishTask = async (taskId) => {
  try {
    let { data, error } = await taskDB
      .from('TASK_DB')
      .update({ estado: '#00ff15' }) // Cambia el estado a 'finalizado'
      .eq('id', taskId);

    if (error) {
      alert('Error al finalizar la tarea: ' + error.message);
    } else {
      alert('¡Tarea finalizada exitosamente!');
      loadTask(); // Recargar las tareas después de actualizar
    }
  } catch (error) {
    alert('Error al conectarse a la base de datos de tasapp: ' + error.message);
  }
};