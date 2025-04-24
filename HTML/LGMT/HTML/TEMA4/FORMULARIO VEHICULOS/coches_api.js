// Esta función se encarga de sumar todos los precios seleccionados y mostrar el total
function calcularPrecio() {
  let total = 0; // Guardamos aquí el precio total

  // Sumamos precios de todos los radios seleccionados
  const radiosSeleccionados = document.querySelectorAll('input[type="radio"]:checked');
  radiosSeleccionados.forEach(radio => {
    // Cogemos el texto que está al lado del input (el precio)
    let precioTexto = radio.nextElementSibling.innerText;
    // Quitamos símbolos y paréntesis
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
    // Lo convertimos a número y lo sumamos al total
    total += Number(precioTexto);
  });

  // Sumamos precios de los extras seleccionados (checkboxes)
  const extrasSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');
  extrasSeleccionados.forEach(checkbox => {
    let precioTexto = checkbox.nextElementSibling.innerText;
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
    total += Number(precioTexto);
  });

  // Mostramos el precio total abajo a la derecha
  document.getElementById('precioTotal').innerText = 'Precio total: ' + total + '€';

  return total; // Devolvemos el total para usarlo si hace falta
}

// Esta función muestra u oculta las secciones según si elige Coche o Moto
function actualizarFormulario() {
  const tipoVehiculo = document.getElementById('vehiculoSelect').value;

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

    grupoCarroceria.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    grupoPuertas.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
  }

  // Calculamos el precio después de cambiar el tipo de vehículo
  calcularPrecio();
}

// Esta función genera la frase final con las opciones elegidas y el precio total
function enviar() {
  const vehiculo = document.getElementById('vehiculoSelect').value;

  // Definimos los nombres de los grupos que sí hay que rellenar
  const gruposObligatorios = ['motor', 'transmision', 'traccion', 'color', 'seguro'];
  if (vehiculo === 'Coche') {
    gruposObligatorios.push('carroceria', 'puertas');
  }

  // Comprobamos que todos los grupos tengan algo seleccionado
  for (let i = 0; i < gruposObligatorios.length; i++) {
    const nombreGrupo = gruposObligatorios[i];
    const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
    if (!seleccionado) {
      alert('Debes seleccionar una opción en ' + nombreGrupo);
      return; // Si falta algo, paramos aquí
    }
  }

  // Si todo está bien, recogemos cada valor seleccionado
  const motor = obtenerSeleccion('motor');
  const transmision = obtenerSeleccion('transmision');
  const traccion = obtenerSeleccion('traccion');
  const color = obtenerSeleccion('color');
  const seguro = obtenerSeleccion('seguro');
  const carroceria = obtenerSeleccion('carroceria');
  const puertas = obtenerSeleccion('puertas');

  // Cogemos el precio total actual
  const precioTotalTexto = document.getElementById('precioTotal').innerText;

  // Montamos la frase de resumen
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
}

// Esta función devuelve el valor seleccionado de un grupo
function obtenerSeleccion(nombreGrupo) {
  const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
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