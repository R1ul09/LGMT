// Esta función calcula el precio total sumando todos los precios de las opciones seleccionadas
function calcularPrecio() {
  // Creamos una variable donde guardaremos el precio total
  let total = 0;

  // Buscamos todos los botones de opción (input radio) que estén seleccionados
  const radiosSeleccionados = document.querySelectorAll('input[type="radio"]:checked');

  // Recorreremos uno por uno todos esos botones de opción marcados
  radiosSeleccionados.forEach(radio => {
    // Cogemos el texto que está justo al lado del botón, que es donde está el precio (en el span)
    let precioTexto = radio.nextElementSibling.innerText;

    // Limpiamos ese texto, quitándole símbolos € y paréntesis
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');

    // Convertimos el texto a número y se lo sumamos a total
    total += Number(precioTexto);
  });

  // Ahora buscamos todos los checkbox que estén marcados (opciones extra)
  const extrasSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');

  // Recorremos cada extra y sumamos su precio al total igual que antes
  extrasSeleccionados.forEach(checkbox => {
    let precioTexto = checkbox.nextElementSibling.innerText;
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
    total += Number(precioTexto);
  });

  // Mostramos el total actualizado en el recuadro fijo de abajo a la derecha
  document.getElementById('precioTotal').innerText = 'Precio total: ' + total + '€';

  // Devolvemos el total por si en algún momento necesitamos usarlo
  return total;
}

// Esta función se encarga de recoger los valores seleccionados,
// llamar a la API y mostrar el resumen en pantalla
function enviar() {
  // Cogemos el tipo de vehículo seleccionado en el desplegable (aunque aquí sería moto)
  const vehiculo = document.getElementById('vehiculoSelect').value;

  // Creamos una lista con los nombres de los grupos obligatorios que deben tener una opción marcada
  const gruposObligatorios = ['motor', 'transmision', 'traccion', 'color', 'seguro'];

  // Recorremos esa lista para comprobar uno a uno que tengan algo seleccionado
  for (let i = 0; i < gruposObligatorios.length; i++) {
    const nombreGrupo = gruposObligatorios[i];
    const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
    if (!seleccionado) {
      // Si falta alguno, mostramos un aviso y salimos de la función
      alert('Debes seleccionar una opción en ' + nombreGrupo);
      return;
    }
  }

  // Si todo está correcto, recogemos las opciones elegidas con nuestra función de abajo
  const motor = obtenerSeleccion('motor');
  const transmision = obtenerSeleccion('transmision');
  const traccion = obtenerSeleccion('traccion');
  const color = obtenerSeleccion('color');
  const seguro = obtenerSeleccion('seguro');

  // Guardamos el precio total que hemos calculado antes
  const precioTotalTexto = document.getElementById('precioTotal').innerText;

  // Montamos la frase resumen con todas las elecciones
  let frase = 'Quiero las 3 mejores ' + vehiculo.toLowerCase() + 's con motor ' + motor +
              ', transmisión ' + transmision + ', tracción ' + traccion +
              ', color ' + color + ' y seguro ' + seguro + '.\n' + precioTotalTexto;

  // Buscamos el div donde se mostrará ese texto y lo metemos dentro
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerText = frase;
  resultadoDiv.style.display = 'block';

  // Preparamos la URL de la API para hacer la petición
  const apiURL = 'https://magicloops.dev/api/loop/7a49c592-9b5e-43c8-81fe-5a40d7bfc13b/run';

  // Creamos el objeto con los datos seleccionados para enviarlo en la petición
  const datos = {
    motor: motor,
    transmision: transmision,
    traccion: traccion,
    color: color,
    seguro: seguro
  };

  // Enviamos la petición a Magic Loops usando fetch
  fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {
    // Mostramos en consola para depurar la respuesta
    console.log("Respuesta Magic Loops:", data);

    // Montamos el HTML con las recomendaciones recibidas
    let listaHTML = '<h3 style="margin-top:20px;">Vehículos recomendados por Magic Loops:</h3>';

    // Recorreremos cada recomendación y la añadimos al HTML
    data.recommendations.forEach(moto => {
      // Sustituimos cualquier $ por € en los precios
      let precioEuros = moto.precio.replace('$', '€');
      listaHTML += `<p><strong>${moto.modelo}</strong> (${precioEuros})</p>`;
    });

    // Añadimos una nota final informativa
    listaHTML += '<p style="margin-top:15px; color:#555; font-style:italic;">Nota: El precio total del configurador es orientativo. Los precios de las recomendaciones pueden variar según características reales.</p>';

    // Mostramos todo en el div de resultado
    resultadoDiv.innerHTML += listaHTML;
  })
  .catch(error => {
    // Si falla la conexión mostramos un mensaje en rojo
    console.error('Error conectando con Magic Loops:', error);
    resultadoDiv.innerHTML += '<p style="color:red;">(No se pudo conectar con Magic Loops)</p>';
  });
}

// Esta función obtiene el valor seleccionado de un grupo de botones de opción
function obtenerSeleccion(nombreGrupo) {
  const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
  return seleccionado ? seleccionado.value : 'sin seleccionar';
}

// Este trozo detecta cualquier cambio en los inputs del formulario y recalcula el precio
document.getElementById('formulario').addEventListener('change', () => {
  calcularPrecio();
});

// Este detecta si cambias el tipo de vehículo y si es coche te manda a vehiculos.html
document.getElementById('vehiculoSelect').addEventListener('change', () => {
  const tipoVehiculo = document.getElementById('vehiculoSelect').value;
  if (tipoVehiculo === 'Coche') {
    window.location.href = 'coches.html';
  }
});

// Al cargar la página, dejamos el precio inicial actualizado
calcularPrecio();
