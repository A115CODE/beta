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
      usuario_id: user.id, // Guardar el id del usuario
      usuario_email: user.email,
      fecha_creacion: TIEMPO_LOCAL, // Guardar la fecha de creación
      fecha_fin: TIEMPO_FIN,
      //tiempo_finalizacion: INPUT_TIMER, // Guardar el tiempo en minutos
    });

    if (error) {
      alert('No se agregó correctamente: ' + error.message);
    } else {
      alert('Agregado exitosamente');
      document.getElementById('TASK_FORM').reset();
      loadTask(); // Recargar la lista de tareas después de agregar una
    }
  } catch (error) {
    alert('Error al conectarse a la base de datos de tasapp: ' + error.message);
  }

  SAVE_TASK.innerText = 'Guardar';
  SAVE_TASK.removeAttribute('disabled');
});

// Traer datos de la DB Task filtradas

// Función para calcular los días faltantes
const calcularDiasRestantes = (fechaFin) => {
  const fechaActual = new Date(); // Fecha actual
  const fechaLimite = new Date(fechaFin); // Fecha de finalización

  // Calcular la diferencia en milisegundos
  const diferenciaTiempo = fechaLimite - fechaActual;

  // Convertir la diferencia de milisegundos a días
  const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

  return diasRestantes >= 0 ? diasRestantes : 0; // Retorna 0 si la fecha ya pasó
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
    .eq('usuario_id', user.id) // Filtrar por el id del usuario
    .order('id', { ascending: false }); // Orden descendente

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
      // Calcular los días restantes usando la fecha de creación y el tiempo de finalización
      const diasRestantes = calcularDiasRestantes(datos.fecha_fin);

      taskResults += `
        <li id="TASK">
          <div id="PRIORITY"></div>
          <div id="TASK_ITEM">
            <h3>${datos.tarea}</h3>
            <p>Fecha de creación: ${datos.fecha_creacion}</p>
            <p>Fecha de finalizacion: ${datos.fecha_fin}</p>
            <p>Días restantes: ${diasRestantes} días</p>
          </div>
          <button class="finish_task" data-id="${datos.id}">Finalizar
            <img src="..../../assets/finish.svg" />
          </button>
        </li>
      `;
    }
    document.getElementById('TASKS').innerHTML = taskResults;

    // Añadir event listener a todos los botones de finalizar
    document.querySelectorAll('.finish_task').forEach((button) => {
      button.addEventListener('click', deleteTask);
    });
  }
};

loadTask();

// Función para eliminar una tarea
const deleteTask = async (e) => {
  const taskId = e.target.closest('.finish_task').getAttribute('data-id');

  try {
    let { data, error } = await taskDB
      .from('TASK_DB')
      .delete()
      .eq('id', taskId); // Eliminar por el id de la tarea

    if (error) {
      alert('Error al eliminar la tarea: ' + error.message);
    } else {
      alert('¡Tarea finalizada exitosamente!');
      loadTask(); // Recargar la lista de tareas después de eliminar
    }
  } catch (error) {
    alert('Error al conectarse a la base de datos de tasapp: ' + error.message);
  }
};
