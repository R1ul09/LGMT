/********************************************
  FUNCION DE SUMAR PRECIOS DEL FORMULARIO
 ********************************************/
// Esta función se encarga de sumar todos los precios seleccionados del formulario
// Va sumando tanto radios como checkboxes y muestra el total abajo a la derecha
function calcularPrecio() {
  let total = 0;

  // Buscamos todos los radios seleccionados y sumamos sus precios
  // Obtenemos todos los radios seleccionados
  const radiosSeleccionados = document.querySelectorAll('input[type="radio"]:checked');
  // Recorremos cada radio seleccionado
  radiosSeleccionados.forEach(radio => {
    // Obtenemos el texto que está al lado del radio, en este caso el precio y eso lo haceos con nextElementSibling
    let precioTexto = radio.nextElementSibling.innerText;
    // A esa variable lo quitamos los símbolos y paréntesis para que solo nos quede el precio
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
    // Y se lo añadimos al total
    total += Number(precioTexto);
  });

  // Hacemos lo mismo pero para los checkboxes de extras
  const extrasSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');
  extrasSeleccionados.forEach(checkbox => {
    let precioTexto = checkbox.nextElementSibling.innerText;
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
    total += Number(precioTexto);
  });

  // Mostramos el total en su div correspondiente
  document.getElementById('precioTotal').innerText = 'Precio total: ' + total + '€';
  return total;
}

/********************************************
  FUNCION DE ENVIAR LOS DATOS A MAGIC LOOPS
 ********************************************/
// Esta función se ejecuta cuando se pulsa el botón "Mostrar motos recomendadas"
function enviar() {
  // Recogemos el tipo de vehículo seleccionado
  const vehiculo = document.getElementById('vehiculoSelect').value;

  // Definimos los grupos de opciones que obligatoriamente hay que seleccionar
  const gruposObligatorios = ['motor', 'transmision', 'traccion', 'color', 'seguro'];

  // Comprobamos que todos los grupos obligatorios tienen una opción marcada
  for (let i = 0; i < gruposObligatorios.length; i++) {
    // Creamos un nombre de grupo para recorrer
    const nombreGrupo = gruposObligatorios[i];
    // Obtenemos el elemento con ese nombre de grupo y con checked sabemos si está marcado
    const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
    // En caso de que no esté marcado, mostramos un alerta y devolvemos la función
    if (!seleccionado) {
      alert('Debes seleccionar una opción en ' + nombreGrupo);
      // Si falta algo, paramos la función
      return;
    }
  }

  // Si todo está correcto, recogemos los valores seleccionados
  // Con obtenerSeleccion() obtenemos el valor seleccionado en un grupo de opciones
  const motor = obtenerSeleccion('motor');
  const transmision = obtenerSeleccion('transmision');
  const traccion = obtenerSeleccion('traccion');
  const color = obtenerSeleccion('color');
  const seguro = obtenerSeleccion('seguro');

  // Cogemos el precio total que aparece abajo a la derecha
  const precioTotalTexto = document.getElementById('precioTotal').innerText;

  // Montamos la frase resumen con las elecciones
  let frase = 'Quiero las 3 mejores ' + vehiculo.toLowerCase() +
              's con motor ' + motor + ', transmisión ' + transmision +
              ', tracción ' + traccion + ', color ' + color +
              ' y seguro ' + seguro + '.\n' + precioTotalTexto;

  // Mostramos esa frase en el div de resultado
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerText = frase;
  resultadoDiv.style.display = 'block';

  // URL de tu API de Magic Loops para motos
  const apiURL = 'https://magicloops.dev/api/loop/196f93ac-f4ab-44f2-a299-ef8bbcd54bae/run';

  // Creamos el objeto con los datos seleccionados
  const datos = {
    motor: motor,
    transmision: transmision,
    traccion: traccion,
    color: color,
    seguro: seguro
  };

  // Llamada POST a Magic Loops con los datos que hemos recogido
  // con fetch() llamamos a la API y le pasamos el método POST y el body con los datos
  // Que el POST basicamente es un envio de datos a una URL, de manera simple, una llamada a una API
  fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  // El .then() es una función que se ejecutará cuando la llamada a la API se complete
  // y devuelve el resultado de la llamada
  .then(res => res.json())
  // Y datos es el resultado de la llamada a la API
  .then(data => {
    console.log("Respuesta Magic Loops:", data);
  
    // Número total de motos recomendadas
    const totalMotos = data.recommendations.length;
    let recibidos = 0;
  
    // Título de la sección de recomendaciones
    let listaHTML = '<h3 style="margin-top:20px;">Motos recomendadas por Magic Loops:</h3>';
    resultadoDiv.innerHTML += listaHTML;
  
    // Recorremos cada recomendación
    data.recommendations.forEach(moto => {
      let precioEuros = moto.precio.replace('$', '€');
      let html = `<p><strong>${moto.modelo}</strong> (${precioEuros})</p>`;
  
      buscarImagen(moto.modelo, function(imagenUrl) {
        if (imagenUrl) {
          html += `<img src="${imagenUrl}" alt="${moto.modelo}" class="recomendacion-imagen" style="max-width:100%; border-radius:10px; margin-bottom:15px;">`;
        } else {
          html += `<p style="color:red;">(Imagen no disponible)</p>`;
        }
  
        // Añadimos el bloque de cada moto
        resultadoDiv.innerHTML += html;
        recibidos++;
  
        // Cuando ya han llegado todas las imágenes, metemos la nota
        if (recibidos === totalMotos) {
          resultadoDiv.innerHTML += '<p style="margin-top:15px; color:#555; font-style:italic;">Nota: El precio total del configurador es orientativo. Los precios de las recomendaciones pueden variar.</p>';
        }
      });
    });
  })  
  }

  function buscarImagen(modelo, callback) {
    const apiKey = 'NblVDVoS1e3YW51akW5QhmWgClpCtaQAW78GrPuBdOnjJqKfGnseofQe';
    fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(modelo)}&per_page=1`, {
      headers: { Authorization: apiKey }
    })
    .then(response => response.json())
    .then(data => {
      const imagenUrl = data.photos.length > 0 ? data.photos[0].src.medium : null;
      callback(imagenUrl);
    })
    .catch(err => {
      console.error('Error buscando imagen en Pexels:', err);
      callback(null);
    });
  }

/********************************************
    FUNCION DE OBTENER EL VALOR DEL GRUPO
 ********************************************/
  // Esta función devuelve el valor seleccionado en un grupo de opciones (motor, tracción…)
  function obtenerSeleccion(nombreGrupo) {
    // Obtenemos el elemento con ese nombre de grupo y con checked sabemos si está marcado
    const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
    // Si está marcado, devolvemos el valor, si no, devolvemos sin seleccionar
    return seleccionado ? seleccionado.value : 'sin seleccionar';
  }

  // Cuando cambia cualquier opción del formulario, recalculamos el precio total automáticamente
  document.getElementById('formulario').addEventListener('change', () => {
    calcularPrecio();
  });

  // Cuando se cambia el desplegable de vehículo y se selecciona "Coche", redirige al configurador de coches
  document.getElementById('vehiculoSelect').addEventListener('change', () => {
    const tipoVehiculo = document.getElementById('vehiculoSelect').value;
    if (tipoVehiculo === 'Coche') {
    window.location.href = 'coches.html';
    }
});

  // Al cargar la página dejamos calculado el precio inicial en 0€
  calcularPrecio();