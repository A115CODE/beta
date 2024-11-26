// DataBase
const urlcoments = 'https://xqkozqxrvoypqmbewsvp.supabase.co';
const keycoments =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxa296cXhydm95cHFtYmV3c3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NzIyOTUsImV4cCI6MjAzODQ0ODI5NX0.LZ1rbBgmyRatXcavq_oQuqqxucfLXn_WtMYnJC7zys4';

const forumDb = supabase.createClient(urlcoments, keycoments);

// User
const getUser = async () => {
  const {
    data: { user },
    error,
    
  } = await forumDb.auth.getUser();
  if (error) {
    alert('Error al obtener el usuario: ' + error.message);
    return null;
  }
  return user;
};

// Aplicación
const HELP_APP = document.createElement('section');
HELP_APP.id = 'HELP_APP';

document.body.appendChild(HELP_APP);

const HELP = document.createElement('div');
HELP.id = 'HELP';
HELP.innerHTML = `

  <form id="HELP_FORM">
    <textarea id="MASSAGE" placeholder="Escribe tu comentario aquí" required></textarea>
    <button id="SAVE_MASSAGE" type="submit">Enviar</button>
  </form>

  <div id="HELP_CONTAINER">
    <h2>Foro de ayuda</h2>
    <div id="HELP_LIST"></div> <!--Data of DB-->
  </div>

`;
HELP_APP.appendChild(HELP);

// Guardar mensaje en base de datos con ID y correo del usuario
document.getElementById('SAVE_MASSAGE').addEventListener('click', async (e) => {
  e.preventDefault();

  const MASSAGE = document.getElementById('MASSAGE').value;
  const SAVE_MASSAGE = document.getElementById('SAVE_MASSAGE');

  SAVE_MASSAGE.innerText = 'Guardando...';
  SAVE_MASSAGE.setAttribute('disabled', true);

  try {
    const user = await getUser();

    if (!user) {
      alert('Error: No se pudo obtener la información del usuario.');
      SAVE_MASSAGE.innerText = 'Enviar';
      SAVE_MASSAGE.removeAttribute('disabled');
      return;
    }

    const { error } = await forumDb.from('comments').insert({
      usuario_id: user.id,
      usuario_email: user.email,
      massage: MASSAGE,
    });

    if (error) {
      alert('No se agregó correctamente: ' + error.message);
    } else {
      alert('Comentario agregado exitosamente');
      document.getElementById('HELP_FORM').reset();
      await loadMassagesWithReplies(); // Actualiza comentarios y entradas
    }
  } catch (error) {
    alert('Error al conectarse a la base de datos: ' + error.message);
  }

  SAVE_MASSAGE.innerText = 'Enviar';
  SAVE_MASSAGE.removeAttribute('disabled');
});

// Función para cargar los comentarios con datos del usuario
async function loadMassagesWithReplies() {
  const HELP_LIST = document.getElementById('HELP_LIST');
  HELP_LIST.innerHTML = 'Cargando comentarios...';

  try {
    const { data: comments, error } = await forumDb
      .from('comments')
      .select('*'); // Seleccionar todos los campos

    if (error) {
      alert('Error al cargar comentarios: ' + error.message);
    } else {
      HELP_LIST.innerHTML = '';

      comments.forEach((comment) => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        const responseList = document.createElement('ul');
        responseList.className = 'responses';

        const responseInput = document.createElement('input');
        responseInput.className = 'response_input';
        responseInput.placeholder = 'Comentar';
        responseInput.required = true;

        const responseButton = document.createElement('button');
        responseButton.classList = 'response_button';

        const sendImage = document.createElement('img');
        sendImage.classList = 'response_image';
        sendImage.src = '..../../assets/send.svg';
        responseButton.appendChild(sendImage);

        const LINE_LIMIT = document.createElement('div');
        LINE_LIMIT.id = 'LINE_LIMIT';


        responseButton.addEventListener('click', async () => {
          const responseText = responseInput.value;
          if (responseText.trim() !== '') {
            await saveAndShowResponse(comment.id, responseText, responseList);
            responseInput.value = '';
          } else {
            alert('El campo no puede estar vacío.');
          }
        });

        // Mostrar el correo del usuario que comentó junto con el comentario
        commentDiv.innerHTML = `
          <h3>${comment.massage}</h3>
          <h6>Por: ${comment.usuario_email || 'Desconocido'}</h6>
        `;

        commentDiv.appendChild(responseList);
        commentDiv.appendChild(responseInput);
        commentDiv.appendChild(responseButton);
        commentDiv.appendChild(LINE_LIMIT);

        HELP_LIST.appendChild(commentDiv);

        // Cargar respuestas asociadas
        loadReplies(comment.id, responseList);
      });
    }
  } catch (error) {
    alert('Error al conectar con la base de datos: ' + error.message);
  }
}

// Función para cargar los comentarios
async function loadMassages() {
  let LIST = document.getElementById('HELP_LIST');
  LIST.innerHTML = '';

  try {
    const { data, error } = await forumDb.from('comments').select('*');

    if (error) {
      alert('Error al cargar comentarios: ' + error.message);
    } else {
      data.forEach((comment) => {
        let commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `
          <h3>${comment.massage}</h3>
        `;
        LIST.appendChild(commentDiv);
      });
    }
  } catch (error) {
    alert('Error al conectar con la base de datos: ' + error.message);
  }
}

// Función para guardar respuesta en la tabla comment_replies
async function saveAndShowResponse(commentId, responseText, responseList) {
  try {
    const user = await getUser(); // Obtén el usuario actual

    if (!user) {
      alert('No se pudo obtener la información del usuario.');
      return;
    }

    const { data, error } = await forumDb.from('comment_replies').insert({
      comment_id: commentId,
      reply: responseText,
      usuario_email: user.email, // Guarda el correo del usuario
    });

    if (error) {
      alert('Error al guardar la respuesta: ' + error.message);
    } else {
      const responseItem = document.createElement('li');
      responseItem.className = "respuesta";
      responseItem.innerHTML = `
        <strong>${user.email}:</strong> ${responseText}
      `;
      responseList.appendChild(responseItem);
    }
  } catch (error) {
    alert('Error al conectar con la base de datos: ' + error.message);
  }
}



// Función para cargar respuestas desde la tabla comment_replies
async function loadReplies(commentId, responseList) {
  try {
    const { data: replies, error } = await forumDb
      .from('comment_replies')
      .select('*')
      .eq('comment_id', commentId);

    if (error) {
      alert('Error al cargar las respuestas: ' + error.message);
    } else {
      responseList.innerHTML = '';
      replies.forEach((reply) => {
        const responseItem = document.createElement('li');
        responseItem.className = "respuesta";
        responseItem.innerHTML = `
          <strong>${reply.usuario_email || 'Anónimo'}:</strong> ${reply.reply}
        `;
        responseList.appendChild(responseItem);
      });
    }
  } catch (error) {
    alert('Error al conectar con la base de datos: ' + error.message);
  }
}

// Inicializar al cargar la página
loadMassagesWithReplies();