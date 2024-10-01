// DataBase
const urlSBtoner = 'https://xqkozqxrvoypqmbewsvp.supabase.co';
const keySBtoner =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const tonerDB = supabase.createClient(urlSBtoner, keySBtoner);

// Función para obtener el usuario autenticado
const getUser = async () => {
  const {
    data: { user },
    error,
  } = await tonerDB.auth.getUser();
  if (error) {
    alert('Error al obtener el usuario: ' + error.message);

    return null;
  }
  return user;
};

// Aplicación
const TONER_APP = document.createElement('section');
TONER_APP.id = 'TONER_APP';

document.body.appendChild(TONER_APP);

const TONER = document.createElement('div');
TONER.id = 'TONER';
TONER.innerHTML = `

  <form id="TONER_FORM">
    <h3>Agregar</h3>

    <input placeholder="IM C2500" type="text" id="MODELO">
  
    <select id="COLOR">

      <option value="">Seleccione un color</option> 
      <option value="#000000">Negro</option>
      <option value="#ff00ff">Magenta</option>
      <option value="#00ffff">Cian</option>       
      <option value="#Ffff00">Amarillo</option>
    
    </select>

    <input placeholder="EDP Code" type="text" id="CODIGO">
    <input placeholder="Cantidad" type="text" id="CANTIDAD">

    <input type="date" id="FECHA">

    <input placeholder="Area" id="COMENTARIO">
    <button type="submit" id="SAVE_TONER">Guardar</button>

  </form>

  <div id="TONER_LIST">

    <h2>TONER DISPONIBLE</h2>

    <div id="CONTAINER_COUNT">
      <h2 class="count"></h2>
      <h4>Unidades Disponibles</h4>
    </div>

    <div id="LIST"></div>

  </div>

`;
TONER_APP.appendChild(TONER);

// Guardar toner en db
SAVE_TONER.addEventListener('click', async (e) => {
  e.preventDefault();

  let MODELO = document.getElementById('MODELO').value;
  let COLOR = document.getElementById('COLOR').value;
  let CODIGO = document.getElementById('CODIGO').value;
  let CANTIDAD = document.getElementById('CANTIDAD').value;
  let FECHA = document.getElementById('FECHA').value;
  let COMENTARIO = document.getElementById('COMENTARIO').value;

  SAVE_TONER.innerText = 'Guardando...';
  SAVE_TONER.setAttribute('disabled', true);

  const user = await getUser();
  if (!user) {
    alert('Usuario no autenticado');
    SAVE_TONER.innerText = 'Guardar';
    SAVE_TONER.removeAttribute('disabled');
    return;
  }

  try {
    let { data, error } = await tonerDB.from('TONER_DB').insert({
      usuario_id: user.id, // Guardar el id del usuario
      usuario_email: user.email,
      modelo: MODELO,
      color: COLOR,
      codigo: CODIGO,
      cantidad: CANTIDAD,
      fecha: FECHA,
      comentario: COMENTARIO,
    });

    if (error) {
      alert('No se agregó correctamente: ' + error.message);
    } else {
      alert('Agregado exitosamente');
      document.getElementById('TONER_FORM').reset();
      loadToner(); // Recargar la lista de tareas después de agregar una
    }
  } catch (error) {
    alert(
      'Error al conectarse a la base de datos de TONER APP: ' + error.message
    );
  }

  SAVE_TONER.innerText = 'Guardar';
  SAVE_TONER.removeAttribute('disabled');
});

// Traer datos de la DB toner filtrados y agregar botón de eliminar
const loadToner = async () => {
  const user = await getUser();
  if (!user) {
    alert('Usuario no autenticado');
    return;
  }

  let tonerResults = '';
  let totalUnidades = 0; // Para contar el total de unidades disponibles

  const { data, error } = await tonerDB
    .from('TONER_DB')
    .select('*')
    .eq('usuario_id', user.id) // filtrar data por el id
    .order('id', { ascending: false }); // orden descendente

  if (error) {
    alert('A Ocurrido Un Problema: ' + error.message);
  } else {
    for (let datos of data) {
      // Sumar la cantidad de toners disponibles
      totalUnidades += datos.cantidad;

      tonerResults += `
        <div class="toner_item" data-id="${datos.id}"> <!-- Agregamos data-id aquí -->
          <img src="..../../assets/check.svg" />

          <div class="data_item">
            <div class="data">
              <h3>Modelo</h3>
              <p>${datos.modelo}</p>
            </div>

            <div class="test"></div>

            <div class="data">
              <h3>Color</h3>
              <div class="color_cube" 
              style="
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background-color: ${datos.color};
              ">
            </div>
            </div>

            <div class="test"></div>

            <div class="data">
              <h3>Codigo</h3>
              <p>${datos.codigo}</p>
            </div>

            <div class="test"></div>

            <div class="data">
              <h3>Cantidad</h3>
              <p>${datos.cantidad}</p>
            </div>

            <div class="test"></div>

            <div class="data fecha">
              <h3>Fecha</h3>
              <p>${datos.fecha}</p>
            </div>

            <div class="test"></div>

            <div class="data">
              <h3>Area</h3>
              <p>${datos.comentario}</p>
            </div>

            <div class="test"></div>
            
            <div class="action">
              <img class="delete_toner" src="..../../assets/install.svg" />
            </div>
            
          </div>
        </div>
      `;
    }

    document.getElementById('LIST').innerHTML = tonerResults;

    // Actualizar el h4 con el número de unidades totales
    document.querySelector('.count').textContent = ` ${totalUnidades} `;

    // Añadir evento click a los botones de eliminar
    const deleteButtons = document.querySelectorAll('.delete_toner');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', deleteToner);
    });
  }
};

loadToner();

// Función para eliminar un toner
const deleteToner = async (e) => {
  const tonerId = e.target.closest('.toner_item').getAttribute('data-id');

  try {
    let { data, error } = await tonerDB
      .from('TONER_DB')
      .delete()
      .eq('id', tonerId); // Eliminar por el id del toner

    if (error) {
      alert('Error al eliminar el toner: ' + error.message);
    } else {
      alert('¡Toner eliminado exitosamente!');
      loadToner(); // Recargar la lista de toners después de eliminar
    }
  } catch (error) {
    alert(
      'Error al conectarse a la base de datos de TONER APP: ' + error.message
    );
  }
};
