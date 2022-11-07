const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');
let perPage = '';
let pageNumber = 1;
let terminoABuscar = '';

formulario.addEventListener('submit', buscarImagenes);

function buscarImagenes(e) {
  e.preventDefault();
  terminoABuscar = document.querySelector('#termino').value;
  if (terminoABuscar === '') {
    mostrarMensaje('Error! Debe escribir un termino para buscar');
    return;
  }

  peticionAPI(terminoABuscar);
}

function peticionAPI(termino, pageNumber) {
  perPage = 48;
  const key = '31149397-4d98505f878a058f7ff4cc427';
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${perPage}&page=${pageNumber}`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      mostrarImagenesHTML(resultado.hits);
      cargarPaginacion(resultado.totalHits, perPage);
    });
}

function cargarPaginacion(imagenesTotales, perPage) {
  limpiarHTML(paginacionDiv);

  paginacionDiv.classList.add('flex', 'flex-wrap', 'justify-center');
  const totalPaginas = parseInt(Math.ceil(imagenesTotales / perPage));

  const iterador = paginacion(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();

    if (done) return;

    const botonSiguiente = document.createElement('a');
    botonSiguiente.href = '#';
    botonSiguiente.dataset.pagina = value;
    botonSiguiente.textContent = value;
    botonSiguiente.classList.add(
      'siguiente',
      'bg-yellow-400',
      'px-4',
      'py-1',
      'mr-2',
      'mb-2'
    );
    paginacionDiv.appendChild(botonSiguiente);
  }
}

function limpiarHTML(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

function* paginacion(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

paginacionDiv.addEventListener('click', pasarPaginar);

function pasarPaginar(e) {
  e.preventDefault();
  if (e.target.classList.contains('siguiente')) {
    const numeroPagina = e.target.dataset.pagina;

    peticionAPI(terminoABuscar, numeroPagina);
  }
}

function mostrarImagenesHTML(imagenes) {
  limpiarHTML(resultado);
  imagenes.forEach((imagen) => {
    const { largeImageURL, likes, previewURL, views } = imagen;

    resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
            <div class="bg-white ">
                <img class="w-full" style="height:160px;object-fit:cover" src=${previewURL} alt={tags} />
                <div class="p-4">
                    <p class="card-text"><span class="font-bold">${likes}</span> Me Gusta</p>
                    <p class="card-text"><span class="font-bold">${views}</span> Vistas </p>
                    <a href=${largeImageURL} 
                    rel="noopener noreferrer" 
                    target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                </div>
            </div>
        </div> 
        
        `;
  });
}

function mostrarMensaje(mensaje) {
  const mensajeDiv = document.createElement('DIV');
  mensajeDiv.classList.add(
    'text-center',
    'bg-red-100',
    'border-red-400',
    'px-3',
    'py-4',
    'rounded',
    'my-3'
  );
  const mensajeParrafo = document.createElement('P');
  mensajeParrafo.classList.add('text-red-700', 'font-bold');
  mensajeParrafo.textContent = mensaje;

  mensajeDiv.appendChild(mensajeParrafo);

  formulario.appendChild(mensajeDiv);

  setTimeout(() => {
    mensajeDiv.remove();
  }, 3000);
}
