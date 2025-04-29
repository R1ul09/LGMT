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

  // Mostramos el precio total abajo a la derecha
  document.getElementById('precioTotal').innerText = 'Precio total: ' + total + '€';
  return total;
}

// Esta función muestra u oculta las secciones según si elige Coche o Moto
function actualizarFormulario() {
  // Obtenemos el tipo de vehículo seleccionado
  const tipoVehiculo = document.getElementById('vehiculoSelect').value;

  // Obtenemos los elementos que se encuentran en la página por su clase
  const grupoCarroceria = document.querySelector('div.grupo:nth-of-type(5)');
  const grupoPuertas = document.querySelector('div.grupo:nth-of-type(6)');

  // Si es coche, mostramos carrocería y puertas
  if (tipoVehiculo === 'Coche') {
    grupoCarroceria.style.display = 'block';
    grupoPuertas.style.display = 'block';
  } else {
    // Si es moto, los ocultamos y desmarcamos sus radios
    grupoCarroceria.style.display = 'none';
    grupoPuertas.style.display = 'none';

    // Como hemos dicho, los desmarcamos
    grupoCarroceria.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    grupoPuertas.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
  }

  // Calculamos el precio después de cambiar el tipo de vehículo
  calcularPrecio();
}

/********************************************
  FUNCION DE ENVIAR LOS DATOS A MAGIC LOOPS
 ********************************************/
// Esta función se ejecuta cuando se pulsa el botón "Mostrar coches recomendados"
function enviar() {
  // Recogemos el tipo de vehículo seleccionado
  const vehiculo = document.getElementById('vehiculoSelect').value;

  // Definimos los grupos de opciones que obligatoriamente hay que seleccionar
  const gruposObligatorios = ['motor', 'transmision', 'traccion', 'color', 'seguro'];
  
  // Si es coche, añadimos carrocería y puertas
  if (vehiculo === 'Coche') {
    gruposObligatorios.push('carroceria', 'puertas');
  }

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
  const carroceria = obtenerSeleccion('carroceria');
  const puertas = obtenerSeleccion('puertas');

  // Cogemos el precio total que aparece abajo a la derecha
  const precioTotalTexto = document.getElementById('precioTotal').innerText;

  // Montamos la frase de resumen de lo que se ha elegido
  let frase = 'Quiero los 3 mejores ' + vehiculo.toLowerCase() + 's con motor ' + motor +
              ', transmisión ' + transmision + ', tracción ' + traccion +
              ', color ' + color + ' y seguro ' + seguro;

  // Si es coche, añadimos carrocería y puertas
  if (vehiculo === 'Coche') {
    frase += ', carrocería ' + carroceria + ' y ' + puertas + ' puertas';
  }

  // Añadimos el precio total a la frase
  frase += '.\n' + precioTotalTexto;

  // Mostramos el resultado final en su div
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerText = frase;
  resultadoDiv.style.display = 'block';

  // URL de tu API de Magic Loops para coches
  const apiURL = 'https://magicloops.dev/api/loop/a5a7e8bc-2ab5-4bf9-95cd-9cc1980af979/run';

  // Creamos el objeto con los datos seleccionados
  const datos = {
    motor: motor,
    transmision: transmision,
    traccion: traccion,
    carroceria: carroceria,
    puertas: puertas,
    color: color,
    seguro: seguro
  };

  // Llamada POST a Magic Loops con los datos que hemos recogido
  // con fetch() llamamos a la API y le pasamos el método POST y el body con los datos
  // Que el POST basicamente es un envio de datos a una URL, de manera simple, una llamada a una API
  fetch(apiURL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(datos)
  })
  // El .then() es una función que se ejecutará cuando la llamada a la API se complete
  // y devuelve el resultado de la llamada
  .then(res => res.json())
  // Y datos es el resultado de la llamada a la API
  .then(data => {

    // Esto lo ponemos en la consola para ver que nos devuelve la API
    console.log('Respuesta Magic Loops :', data);

    // Creamos una variable con HTML para añadir las recomendaciones
    let listaHTML = '<h3 style="margin-top:20px;">Coches recomendados por Magic Loops:</h3>';

    // Recorremos cada recomendación que devuelve la API
    data.recommendations.forEach(vehiculo => {
      // Añadimos modelo y precio
      listaHTML += '<p style="margin:5px 0;"><strong>' + vehiculo.modelo + '</strong> (' + vehiculo.precio + ')</p>';
    });

    // Nota aclaratoria abajo
    listaHTML += '<p style="margin-top:15px; color:#555; font-style:italic;">Nota: El precio total del configurador es orientativo. Los precios de los modelos recomendados pueden variar según características reales.</p>';

    // Mostramos todo en el div de resultado
    resultadoDiv.innerHTML += listaHTML;
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

  // Detecta cualquier cambio en los inputs del formulario para recalcular el precio
  document.getElementById('formulario').addEventListener('change', () => {
    calcularPrecio();
  });

  // Detecta cuando cambias de tipo de vehículo en el desplegable
  document.getElementById('vehiculoSelect').addEventListener('change', () => {
    const tipoVehiculo = document.getElementById('vehiculoSelect').value;

    // Si elige Moto, lo mandamos a moto.html
    if (tipoVehiculo === 'Moto') {
      window.location.href = 'motos.html';
    } else {
    
      // Si elige Coche, actualizamos visibilidad
      actualizarFormulario();
    }
});

  // Al cargar la página, dejamos todo listo y mostramos precio inicial 0€
  actualizarFormulario();
  calcularPrecio();