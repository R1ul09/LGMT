function calcularPrecio() {
  let total = 0;
  const radiosSeleccionados = document.querySelectorAll('input[type="radio"]:checked');
  radiosSeleccionados.forEach(radio => {
    let precioTexto = radio.nextElementSibling.innerText;
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
    total += Number(precioTexto);
  });
  const extrasSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');
  extrasSeleccionados.forEach(checkbox => {
    let precioTexto = checkbox.nextElementSibling.innerText;
    precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
    total += Number(precioTexto);
  });
  document.getElementById('precioTotal').innerText = 'Precio total: ' + total + '€';
  return total;
}

function actualizarFormulario() {
  const tipoVehiculo = document.getElementById('vehiculoSelect').value;
  const grupoCarroceria = document.querySelector('div.grupo:nth-of-type(5)');
  const grupoPuertas = document.querySelector('div.grupo:nth-of-type(6)');
  if (tipoVehiculo === 'Coche') {
    grupoCarroceria.style.display = 'block';
    grupoPuertas.style.display = 'block';
  } else {
    grupoCarroceria.style.display = 'none';
    grupoPuertas.style.display = 'none';
    grupoCarroceria.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    grupoPuertas.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
  }
  calcularPrecio();
}

function enviar() {
  const vehiculo = document.getElementById('vehiculoSelect').value;
  const gruposObligatorios = ['motor', 'transmision', 'traccion', 'color', 'seguro'];
  if (vehiculo === 'Coche') gruposObligatorios.push('carroceria', 'puertas');

  for (let i = 0; i < gruposObligatorios.length; i++) {
    const nombreGrupo = gruposObligatorios[i];
    const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
    if (!seleccionado) {
      alert('Debes seleccionar una opción en ' + nombreGrupo);
      return;
    }
  }

  const motor = obtenerSeleccion('motor');
  const transmision = obtenerSeleccion('transmision');
  const traccion = obtenerSeleccion('traccion');
  const color = obtenerSeleccion('color');
  const seguro = obtenerSeleccion('seguro');
  const carroceria = obtenerSeleccion('carroceria');
  const puertas = obtenerSeleccion('puertas');
  const precioTotalTexto = document.getElementById('precioTotal').innerText;

  let frase = 'Quiero los 3 mejores ' + vehiculo.toLowerCase() + 's con motor ' + motor +
              ', transmisión ' + transmision + ', tracción ' + traccion +
              ', color ' + color + ' y seguro ' + seguro;
  if (vehiculo === 'Coche') frase += ', carrocería ' + carroceria + ' y ' + puertas + ' puertas';
  frase += '.\n' + precioTotalTexto;

  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '<p>' + frase + '</p>';
  resultadoDiv.style.display = 'block';

  const apiURL = 'https://magicloops.dev/api/loop/a5a7e8bc-2ab5-4bf9-95cd-9cc1980af979/run';
  const datos = { motor, transmision, traccion, carroceria, puertas, color, seguro };

  fetch(apiURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  .then(res => res.json())
  .then(data => {
    console.log('Respuesta Magic Loops:', data);
    const totalCoches = data.recommendations.length;
    let recibidos = 0;
  
    let listaHTML = '<h3 style="margin-top:20px;">Coches recomendados por Magic Loops:</h3>';
    resultadoDiv.innerHTML += listaHTML;
  
    data.recommendations.forEach(coche => {
      let precioEuros = coche.precio.replace('$', '€');
      let html = `<p style="margin:8px 0;"><strong>${coche.modelo}</strong> (${precioEuros})</p>`;
  
      buscarImagen(coche.modelo, function(imagenUrl) {
        if (imagenUrl) {
          html += `<img src="${imagenUrl}" alt="${coche.modelo}" class="recomendacion-imagen" style="max-width:100%; border-radius:10px; margin-bottom:15px;">`;
        } else {
          html += `<p style="color:red;">(Imagen no disponible)</p>`;
        }
  
        resultadoDiv.innerHTML += html;
        recibidos++;
  
        // Cuando ya han llegado todas las imágenes, metemos la nota
        if (recibidos === totalCoches) {
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

function obtenerSeleccion(nombreGrupo) {
  const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
  return seleccionado ? seleccionado.value : 'sin seleccionar';
}

document.getElementById('formulario').addEventListener('change', () => {
  calcularPrecio();
});

document.getElementById('vehiculoSelect').addEventListener('change', () => {
  const tipoVehiculo = document.getElementById('vehiculoSelect').value;
  if (tipoVehiculo === 'Moto') {
    window.location.href = 'motos.html';
  } else {
    actualizarFormulario();
  }
});

actualizarFormulario();
calcularPrecio();
