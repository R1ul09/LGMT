// Esta función se encarga de sumar todos los precios seleccionados del formulario
// Va sumando tanto radios como checkboxes y muestra el total abajo a la derecha
function calcularPrecio() {
  let total = 0;

  // Buscamos todos los radios seleccionados y sumamos sus precios
  const radiosSeleccionados = document.querySelectorAll('input[type="radio"]:checked');
  radiosSeleccionados.forEach(radio => {
    let precioTexto = radio.nextElementSibling.innerText;
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
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

// Esta función se ejecuta cuando se pulsa el botón "Mostrar motos recomendadas"
function enviar() {
  // Recogemos el tipo de vehículo seleccionado
  const vehiculo = document.getElementById('vehiculoSelect').value;

  // Definimos los grupos de opciones que obligatoriamente hay que seleccionar
  const gruposObligatorios = ['motor', 'transmision', 'traccion', 'color', 'seguro'];

  // Comprobamos que todos los grupos obligatorios tienen una opción marcada
  for (let i = 0; i < gruposObligatorios.length; i++) {
    const nombreGrupo = gruposObligatorios[i];
    const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
    if (!seleccionado) {
      alert('Debes seleccionar una opción en ' + nombreGrupo);
      return; // Si falta algo, paramos la función
    }
  }

  // Si todo está correcto, recogemos los valores seleccionados
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

  // URL de tu API de Magic Loops para motos ✅
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
  fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {
    console.log("Respuesta Magic Loops:", data);

    // Creamos una variable con HTML para añadir las recomendaciones
    let listaHTML = '<h3 style="margin-top:20px;">Motos recomendadas por Magic Loops:</h3>';

    // Recorremos cada recomendación que devuelve la API
    data.recommendations.forEach(moto => {
      // Cambiamos $ por € si lo hubiera
      let precioEuros = moto.precio.replace('$', '€');

      // Añadimos modelo y precio
      listaHTML += `<p><strong>${moto.modelo}</strong> (${precioEuros})</p>`;

      // Si tiene imagen, la mostramos
      if (moto.imagen) {
        listaHTML += `<img src="${moto.imagen}" alt="${moto.modelo}" style="max-width:250px; display:block; margin-bottom:10px;">`;
      }
    });

    // Añadimos la nota aclaratoria
    listaHTML += '<p style="margin-top:15px; color:#555; font-style:italic;">Nota: El precio total del configurador es orientativo. Los precios de las recomendaciones pueden variar según características reales.</p>';

    // Mostramos todo en el div de resultado
    resultadoDiv.innerHTML += listaHTML;
  })
  .catch(error => {
    console.error('Error conectando con Magic Loops:', error);
    resultadoDiv.innerHTML += '<p style="color:red;">(No se pudo conectar con Magic Loops)</p>';
  });
}

// Esta función devuelve el valor seleccionado en un grupo de opciones (motor, tracción…)
function obtenerSeleccion(nombreGrupo) {
  const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
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