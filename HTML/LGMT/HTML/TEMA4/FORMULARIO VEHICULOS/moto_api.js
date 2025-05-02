/********************************************
  FUNCION DE SUMAR PRECIOS DEL FORMULARIO
 ********************************************/
// Esta función se encarga de sumar todos los precios seleccionados del formulario.
// Va sumando tanto radios como checkboxes y muestra el total abajo a la derecha.
function calcularPrecio() {
  // Variable donde iremos acumulando el total del precio
  let total = 0;

  // Buscamos todos los botones de radio que estén seleccionados
  const radiosSeleccionados = document.querySelectorAll('input[type="radio"]:checked');

  // Recorremos uno por uno los radios seleccionados
  radiosSeleccionados.forEach(radio => {
    // Obtenemos el texto que está al lado del botón de radio (el precio)
    let precioTexto = radio.nextElementSibling.innerText;

    // Limpiamos ese texto quitando símbolos como €, ( y )
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');

    // Convertimos el texto limpio a número y lo sumamos al total
    total += Number(precioTexto);
  });

  // Hacemos lo mismo para los checkboxes de extras
  const extrasSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');

  // Recorremos uno por uno los checkboxes seleccionados
  extrasSeleccionados.forEach(checkbox => {
    // Obtenemos el texto que está al lado del checkbox (el precio)
    let precioTexto = checkbox.nextElementSibling.innerText;

    // Limpiamos el texto igual que antes
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');

    // Lo convertimos a número y lo sumamos al total
    total += Number(precioTexto);
  });

  // Mostramos el precio total en el elemento HTML correspondiente
  document.getElementById('precioTotal').innerText = 'Precio total: ' + total + '€';

  // Devolvemos el total (por si necesitamos usarlo después)
  return total;
}

/********************************************
  FUNCION DE ENVIAR LOS DATOS A MAGIC LOOPS
 ********************************************/
// Esta función se ejecuta cuando se pulsa el botón "Mostrar motos recomendadas"
function enviar() {
  // Obtenemos el tipo de vehículo seleccionado (en este caso siempre será Moto)
  const vehiculo = document.getElementById('vehiculoSelect').value;

  // Definimos los nombres de los grupos obligatorios que deben tener una opción seleccionada
  const gruposObligatorios = ['motor', 'transmision', 'traccion', 'color', 'seguro'];

  // Comprobamos que haya una opción seleccionada en cada grupo obligatorio
  for (let i = 0; i < gruposObligatorios.length; i++) {
    // Creamos un nombre de grupo para recorrerlos uno por uno
    const nombreGrupo = gruposObligatorios[i];

    // Buscamos el input de ese grupo que esté marcado
    const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');

    // Si no hay ninguna opción seleccionada, mostramos un mensaje de error y detenemos la función
    if (!seleccionado) {
      alert('Debes seleccionar una opción en ' + nombreGrupo);
      return;
    }
  }

  // Si todo está bien, obtenemos los valores seleccionados usando otra función auxiliar
  const motor = obtenerSeleccion('motor');
  const transmision = obtenerSeleccion('transmision');
  const traccion = obtenerSeleccion('traccion');
  const color = obtenerSeleccion('color');
  const seguro = obtenerSeleccion('seguro');

  // Obtenemos el precio total mostrado en pantalla
  const precioTotalTexto = document.getElementById('precioTotal').innerText;

  // Creamos una frase con toda la información seleccionada por el usuario
  let frase = 'Quiero las 3 mejores ' + vehiculo.toLowerCase() +
              's con motor ' + motor + ', transmisión ' + transmision +
              ', tracción ' + traccion + ', color ' + color +
              ' y seguro ' + seguro + '.\n' + precioTotalTexto;

  // Mostramos esa frase en el div llamado "resultado"
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerText = frase;
  resultadoDiv.style.display = 'block';

  // URL de la API externa a la que vamos a enviar los datos
  const apiURL = 'https://magicloops.dev/api/loop/196f93ac-f4ab-44f2-a299-ef8bbcd54bae/run';

  // Datos que vamos a enviar a la API
  const datos = {
    motor: motor,
    transmision: transmision,
    traccion: traccion,
    color: color,
    seguro: seguro
  };

  // Hacemos una petición POST a la API con esos datos
  fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json()) // Convertimos la respuesta a formato JSON
  .then(data => { // Aquí recibimos los datos devueltos por la API

    console.log("Respuesta Magic Loops:", data); // Mostramos en consola la respuesta

    const totalMotos = data.recommendations.length; // Contamos cuántas recomendaciones vinieron
    let recibidos = 0; // Variable para llevar cuenta de cuántas imágenes ya llegaron

    // Creamos el encabezado de la lista de recomendaciones
    let listaHTML = '<h3 style="margin-top:20px;">Motos recomendadas por Magic Loops:</h3>';
    resultadoDiv.innerHTML += listaHTML;

    // Para cada moto recomendada...
    data.recommendations.forEach(moto => {

      // Reemplazamos el símbolo $ por € en el precio
      let precioEuros = moto.precio.replace('$', '€');

      // Creamos el HTML básico de la moto (modelo y precio)
      let html = `<p><strong>${moto.modelo}</strong> (${precioEuros})</p>`;

      // Llamamos a una función para buscar una imagen del modelo de la moto
      buscarImagen(moto.modelo, function(imagenUrl) {

        // Si encontramos una imagen, la añadimos al HTML
        if (imagenUrl) {
          html += `<img src="${imagenUrl}" alt="${moto.modelo}" class="recomendacion-imagen" style="max-width:100%; border-radius:10px; margin-bottom:15px;">`;
        } else {
          // Si no hay imagen disponible, mostramos un mensaje
          html += `<p style="color:red;">(Imagen no disponible)</p>`;
        }

        // Agregamos todo el HTML de la moto al div de resultados
        resultadoDiv.innerHTML += html;
        recibidos++; // Aumentamos el contador de motos procesadas

        // Cuando ya hemos procesado todas las recomendaciones...
        if (recibidos === totalMotos) {
          // Añadimos una nota final sobre los precios
          resultadoDiv.innerHTML += '<p style="margin-top:15px; color:#555; font-style:italic;">Nota: El precio total del configurador es orientativo. Los precios de las recomendaciones pueden variar.</p>';
        }
      });
    });
  })  
}

// Función para buscar una imagen de un modelo de moto usando la API de Pexels
function buscarImagen(modelo, callback) {
  // Clave de acceso a la API de Pexels
  const apiKey = 'NblVDVoS1e3YW51akW5QhmWgClpCtaQAW78GrPuBdOnjJqKfGnseofQe';

  // Hacemos una solicitud a la API de Pexels buscando fotos del modelo de la moto
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

/********************************************
    FUNCION DE OBTENER EL VALOR DEL GRUPO
 ********************************************/
// Esta función devuelve el valor seleccionado en un grupo de opciones (motor, tracción…)
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

// Cuando se cambia la selección del tipo de vehículo...
document.getElementById('vehiculoSelect').addEventListener('change', () => {
  const tipoVehiculo = document.getElementById('vehiculoSelect').value;

  // Si es coche, redirigimos a otra página
  if (tipoVehiculo === 'Coche') {
    window.location.href = 'coches.html';
  }
});

// Al cargar la página, dejamos calculado el precio inicial en 0€
calcularPrecio();