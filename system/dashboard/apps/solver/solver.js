// DataBase
const urlSBsolver = 'https://xqkozqxrvoypqmbewsvp.supabase.co';
const keySBsolver =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const solverDB = supabase.createClient(urlSBsolver, keySBsolver);

// Función para obtener el usuario autenticado
const getUser = async () => {
  const {
    data: { user },
    error,
  } = await solverDB.auth.getUser();
  if (error) {
    alert('Error al obtener el usuario: ' + error.message);
    return null;
  }
  return user;
};

// Aplicación
const SOLVER_APP = document.createElement('section');
SOLVER_APP.id = 'SOLVER_APP';

document.body.appendChild(SOLVER_APP);

//subir un nivel, es decir cambiar el solver app por solo solver
const SOLVER = document.createElement('div');
SOLVER.id = 'SOLVER';
SOLVER.innerHTML = `

  <div id="LISTA_REPORTES">

    <h2>LISTA DE REPORTES</h2>
    <h4>Estos son los reportes mas recientes</h4>

    <ul id="REPORTES"></ul>

  </div>

  <form id="SOLVER_FORM">

    <h3>Agregar Reporte</h3>

    <input type="text" id="descripcion" placeholder="Descripción" required >
    <input type="text"  id="categoria" placeholder="Categoría" required >
    <input type="text"  id="impresora" placeholder="Impresora" required>
    <input type="text"  id="medidas" placeholder="Medidas" required>
    <input type="text"  id="solucion" placeholder="Solución">

    <button type="submit" id="GUARDAR"> Guardar
      <img src="..../../assets/save.svg" />
    </button>

  </form>


  <div id="OPEN_SEARCH" class="toggle-search">
    <img src="..../../assets/search.svg" />
    <p>Abrir Buscador</p>
  </div>

  <div id="SEARCH">

    <button id="CLOSE_SEARCH" class="toggle-search">Close</button>

    <form id="FORM_SEARCH">
      <input type="text" id="PALABRA" class="input_form_search" placeholder="Buscar..." required>
      <input type="text" id="CATEGORIA" class="input_form_search" placeholder="Categoría">
      <button id="BT_SEARCH">Buscar</button>
    </form>

    <div id="FRAME_SEARCH">
      <h2>Resultados de la búsqueda:</h2>
      <ul id="SEARCH_RESULTS"></ul>

    </div>

  </div> 
  
`;

SOLVER_APP.appendChild(SOLVER);

// Expanded Search
// Asignar evento de clic a todos los elementos con la clase 'toggle-search'
document.querySelectorAll('.toggle-search').forEach((button) => {
  button.addEventListener('click', function () {
    toggleVisibility('SEARCH');
  });
});

function toggleVisibility(elementId) {
  // Obtener el elemento por su ID
  var element = document.getElementById(elementId);

  // Verificar si el elemento existe
  if (element) {
    // Cambiar la visibilidad del elemento
    if (element.style.display === 'flex' || element.style.display === '') {
      element.style.display = 'none';
    } else {
      element.style.display = 'flex';
    }
  } else {
    alert('Elemento con ID ' + elementId + ' no encontrado.');
  }
}

// Guardar reporte en db con usuario
let save = document.getElementById('GUARDAR');
save.addEventListener('click', async (e) => {
  e.preventDefault();

  let descripcion = document.getElementById('descripcion').value;
  let categoria = document.getElementById('categoria').value;
  let impresora = document.getElementById('impresora').value;
  let medidas = document.getElementById('medidas').value;
  let solucion = document.getElementById('solucion').value;

  save.innerText = 'Guardando...';
  save.setAttribute('disabled', true);

  const user = await getUser();
  if (!user) {
    alert('Usuario no autenticado');
    save.innerText = 'Guardar';
    save.removeAttribute('disabled');
    return;
  }

  try {
    let { data, error } = await solverDB.from('SOLVER_DB').insert({
      descripcion: descripcion,
      categoria: categoria,
      impresora: impresora,
      medidas: medidas,
      solucion: solucion,
      usuario_id: user.id, // Guardar el ID del usuario
      usuario_email: user.email, // Guardar el email del usuario
    });

    if (error) {
      alert('No se agregó correctamente: ' + error.message);
    } else {
      alert('Agregado exitosamente');
      document.getElementById('SOLVER_FORM').reset();
      loadTickets(); // Recargar el Solver después de agregar uno
    }
  } catch (error) {
    alert('Error al conectarse a la base de datos: ' + error.message);
  }

  save.innerText = 'Guardar';
  save.removeAttribute('disabled');
});

// Traer datos de la DB
const loadTickets = async () => {
  let containerResults = '';
  const { data, error } = await solverDB
    .from('SOLVER_DB')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    alert('A Ocurrido Un Problema: ' + error.message);
  } else {
    for (let datos of data) {
      containerResults += `
      <li id="REPORTE">

          <h2>Problema</h2>
          <p>${datos.descripcion}</p>

          <h2>Categoria</h2>
          <p>${datos.categoria}</p>

          <h2>Equipo</h2>
          <p>${datos.impresora}</p>

          <h2>Medidas</h2>
          <p>${datos.medidas}</p>

          <h2>Solución</h2>
          <p>${datos.solucion}</p>

          <h5>Reportado por</h5>
          <h6>${datos.usuario_email}</h6>

          <div id="LINE_LIMIT"></div>
          
      </li>
      `;
    }
    document.getElementById('REPORTES').innerHTML = containerResults;
  }
};
loadTickets();

// Buscador
const searchResults = async (e) => {
  e.preventDefault();

  const palabra = document.getElementById('PALABRA').value;
  const categoria = document.getElementById('CATEGORIA').value;

  // Vrerificar campos
  if (!palabra && !categoria) {
    alert('Por favor ingresa una palabra o una categoría para buscar.');
    return;
  }

  try {
    let query = solverDB.from('SOLVER_DB').select('*');

    // Condiciones de búsqueda
    if (palabra) {
      query = query.ilike('descripcion', `%${palabra}%`); // Buscar palabra en la descripción
    }
    if (categoria) {
      query = query.ilike('categoria', `%${categoria}%`); // Buscar en la categoría
    }

    // Ejecutar la consulta
    let { data, error } = await query;

    // Manejar errores
    if (error) {
      alert('Error en la búsqueda: ' + error.message);
      return;
    }

    // Limpiar los resultados anteriores
    let searchResultsContainer = document.getElementById('SEARCH_RESULTS');
    searchResultsContainer.innerHTML = '';

    // Verificar si hay resultados
    if (data.length === 0) {
      searchResultsContainer.innerHTML =
        '<li>No se encontraron resultados.</li>';
      return;
    }

    // Mostrar los resultados en la lista
    for (let result of data) {
      searchResultsContainer.innerHTML += `
        <li>
          <h3>${result.descripcion}</h3>
          <p>Categoría: ${result.categoria}</p>
          <p>Impresora: ${result.impresora}</p>
          <p>Medidas: ${result.medidas}</p>
          <p>Solución: ${result.solucion}</p>
        </li>
      `;
    }
  } catch (error) {
    alert('Error en la búsqueda: ' + error.message);
  }
};

// Agregar evento de clic al botón de búsqueda
document.getElementById('BT_SEARCH').addEventListener('click', searchResults);
