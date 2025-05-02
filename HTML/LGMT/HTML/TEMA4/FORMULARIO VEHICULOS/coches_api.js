// Función para calcular el precio total basado en las opciones seleccionadas
function calcularPrecio() {
  // Inicializamos una variable que almacenará el total del precio
  let total = 0;

  // Seleccionamos todos los botones de radio (radios) que están marcados
  const radiosSeleccionados = document.querySelectorAll('input[type="radio"]:checked');

  // Recorremos uno por uno los radios seleccionados
  radiosSeleccionados.forEach(radio => {
    // Obtenemos el texto del precio que está al lado del radio button
    let precioTexto = radio.nextElementSibling.innerText;

    // Limpiamos el texto eliminando símbolos como €, ( y )
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');

    // Convertimos ese texto limpio a número y lo sumamos al total
    total += Number(precioTexto);
  });

  // Seleccionamos todos los checkboxes que están marcados
  const extrasSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');

  // Recorremos uno por uno los checkboxes seleccionados
  extrasSeleccionados.forEach(checkbox => {
    // Obtenemos el texto del precio que está al lado del checkbox
    let precioTexto = checkbox.nextElementSibling.innerText;

    // Limpiamos el texto igual que antes
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');

    // Lo convertimos a número y lo sumamos al total
    total += Number(precioTexto);
  });

  // Actualizamos el contenido del elemento HTML donde mostramos el precio total
  document.getElementById('precioTotal').innerText = 'Precio total: ' + total + '€';

  // Devolvemos el total calculado (por si queremos usarlo después)
  return total;
}

// Función para mostrar u ocultar ciertos campos del formulario según el tipo de vehículo
function actualizarFormulario() {
  // Obtenemos el valor seleccionado del menú desplegable de vehículo
  const tipoVehiculo = document.getElementById('vehiculoSelect').value;

  // Seleccionamos los grupos "carroceria" y "puertas" del formulario
  const grupoCarroceria = document.querySelector('div.grupo:nth-of-type(5)');
  const grupoPuertas = document.querySelector('div.grupo:nth-of-type(6)');

  // Si el vehículo es un coche, mostramos esos campos
  if (tipoVehiculo === 'Coche') {
    grupoCarroceria.style.display = 'block';
    grupoPuertas.style.display = 'block';
  } else {
    // Si no es coche (es moto), ocultamos esos campos
    grupoCarroceria.style.display = 'none';
    grupoPuertas.style.display = 'none';

    // Además, desmarcamos cualquier opción seleccionada en esos campos
    grupoCarroceria.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    grupoPuertas.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
  }

  // Finalmente, recalculamos el precio total (por si algo cambió)
  calcularPrecio();
}

// Función que se ejecuta al enviar el formulario
function enviar() {
  // Obtenemos el tipo de vehículo seleccionado (coche o moto)
  const vehiculo = document.getElementById('vehiculoSelect').value;

  // Definimos los nombres de los grupos obligatorios que siempre deben tener una opción seleccionada
  const gruposObligatorios = ['motor', 'transmision', 'traccion', 'color', 'seguro'];

  // Si el vehículo es coche, también agregamos los grupos adicionales como obligatorios
  if (vehiculo === 'Coche') gruposObligatorios.push('carroceria', 'puertas');

  // Comprobamos que haya una opción seleccionada en cada grupo obligatorio
  for (let i = 0; i < gruposObligatorios.length; i++) {
    const nombreGrupo = gruposObligatorios[i];
    const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');

    // Si no hay ninguna opción seleccionada, mostramos un mensaje de error y detenemos la función
    if (!seleccionado) {
      alert('Debes seleccionar una opción en ' + nombreGrupo);
      return;
    }
  }

  // Obtenemos los valores seleccionados de cada grupo usando otra función auxiliar
  const motor = obtenerSeleccion('motor');
  const transmision = obtenerSeleccion('transmision');
  const traccion = obtenerSeleccion('traccion');
  const color = obtenerSeleccion('color');
  const seguro = obtenerSeleccion('seguro');
  const carroceria = obtenerSeleccion('carroceria');
  const puertas = obtenerSeleccion('puertas');

  // Obtenemos el precio total mostrado en pantalla
  const precioTotalTexto = document.getElementById('precioTotal').innerText;

  // Creamos una frase con toda la información seleccionada por el usuario
  let frase = 'Quiero los 3 mejores ' + vehiculo.toLowerCase() + 's con motor ' + motor +
              ', transmisión ' + transmision + ', tracción ' + traccion +
              ', color ' + color + ' y seguro ' + seguro;

  // Si es un coche, añadimos carrocería y número de puertas a la frase
  if (vehiculo === 'Coche') frase += ', carrocería ' + carroceria + ' y ' + puertas + ' puertas';

  // Al final, añadimos el precio total
  frase += '.\n' + precioTotalTexto;

  // Mostramos esa frase en un div llamado "resultado"
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '<p>' + frase + '</p>';
  resultadoDiv.style.display = 'block';

  // URL de la API externa a la que vamos a enviar los datos
  const apiURL = 'https://magicloops.dev/api/loop/a5a7e8bc-2ab5-4bf9-95cd-9cc1980af979/run';

  // Datos que vamos a enviar a la API
  const datos = { motor, transmision, traccion, carroceria, puertas, color, seguro };

  // Hacemos una petición POST a la API con esos datos
  fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json()) // Convertimos la respuesta a formato JSON
  .then(data => { // Aquí recibimos los datos devueltos por la API

    console.log('Respuesta Magic Loops:', data); // Mostramos en consola la respuesta

    const totalCoches = data.recommendations.length; // Contamos cuántas recomendaciones vinieron
    let recibidos = 0; // Variable para llevar cuenta de cuántas imágenes ya llegaron

    // Creamos el encabezado de la lista de recomendaciones
    let listaHTML = '<h3 style="margin-top:20px;">Coches recomendados por Magic Loops:</h3>';
    resultadoDiv.innerHTML += listaHTML;

    // Para cada coche recomendado...
    data.recommendations.forEach(coche => {

      // Reemplazamos el símbolo $ por € en el precio
      let precioEuros = coche.precio.replace('$', '€');

      // Creamos el HTML básico del coche (modelo y precio)
      let html = `<p style="margin:8px 0; margin-top:10px;"><strong>${coche.modelo}</strong> (${precioEuros})</p>`;

      // Llamamos a una función para buscar una imagen del modelo del coche
      buscarImagen(coche.modelo, function(imagenUrl) {

        // Si encontramos una imagen, la añadimos al HTML
        if (imagenUrl) {
          html += `<img src="${imagenUrl}" alt="${coche.modelo}" class="recomendacion-imagen" style="max-width:100%; border-radius:10px; margin-bottom:15px;">`;
        } else {
          // Si no hay imagen disponible, mostramos un mensaje
          html += `<p style="color:red;">(Imagen no disponible)</p>`;
        }

        // Agregamos todo el HTML del coche al div de resultados
        resultadoDiv.innerHTML += html;
        recibidos++; // Aumentamos el contador de coches procesados

        // Cuando ya hemos procesado todas las recomendaciones...
        if (recibidos === totalCoches) {
          // Añadimos una nota final sobre los precios
          resultadoDiv.innerHTML += '<p style="margin-top:15px; color:#555; font-style:italic;">Nota: El precio total del configurador es orientativo. Los precios de las recomendaciones pueden variar.</p>';
        }
      });
    });
  })  
}

// Función para buscar una imagen de un modelo de coche usando la API de Pexels
function buscarImagen(modelo, callback) {
  // Clave de acceso a la API de Pexels
  const apiKey = 'NblVDVoS1e3YW51akW5QhmWgClpCtaQAW78GrPuBdOnjJqKfGnseofQe';

  // Hacemos una solicitud a la API de Pexels buscando fotos del modelo del coche
  fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(modelo)}&per_page=1`, {
    headers: { Authorization: apiKey } // Incluimos la clave en la cabecera
  })
  .then(response => response.json()) // Convertimos la respuesta a formato JSON
  .then(data => {
    // Si hay fotos, tomamos la primera y obtenemos su URL
    const imagenUrl = data.photos.length > 0 ? data.photos[0].src.medium : null;

    // Llamamos a la función de devolución (callback) con la URL de la imagen
    callback(imagenUrl);
  })
  .catch(err => {
    // Si hay un error, mostramos un mensaje en consola y devolvemos null
    console.error('Error buscando imagen en Pexels:', err);
    callback(null);
  });
}

// Función auxiliar para obtener el valor seleccionado de un grupo dado
function obtenerSeleccion(nombreGrupo) {
  // Buscamos el input con el nombre del grupo que esté marcado
  const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');

  // Si hay uno seleccionado, devolvemos su valor, si no, devolvemos 'sin seleccionar'
  return seleccionado ? seleccionado.value : 'sin seleccionar';
}

// Cada vez que algo cambie en el formulario, recalculamos el precio
document.getElementById('formulario').addEventListener('change', () => {
  calcularPrecio();
});

// Cuando cambie la selección del tipo de vehículo...
document.getElementById('vehiculoSelect').addEventListener('change', () => {
  const tipoVehiculo = document.getElementById('vehiculoSelect').value;

  // Si es moto, redirigimos a otra página
  if (tipoVehiculo === 'Moto') {
    window.location.href = 'motos.html';
  } else {
    // Si es coche, actualizamos el formulario
    actualizarFormulario();
  }
});

// Ejecutamos estas funciones al cargar la página para preparar todo desde el principio
actualizarFormulario();
calcularPrecio();