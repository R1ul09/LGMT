// Esta función calcula el precio total sumando lo que hay seleccionado
function calcularPrecio() {
    let total = 0;
  
    // Sumamos precios de los radio seleccionados
    const radiosSeleccionados = document.querySelectorAll('input[type="radio"]:checked');
    radiosSeleccionados.forEach(radio => {
      let precioTexto = radio.nextElementSibling.innerText;
      precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
      let precioNumero = Number(precioTexto);
      total = total + precioNumero;
    });
  
    // Sumamos precios de los checkbox seleccionados
    const extrasSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');
    extrasSeleccionados.forEach(checkbox => {
      let precioTexto = checkbox.nextElementSibling.innerText;
      precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
      let precioNumero = Number(precioTexto);
      total = total + precioNumero;
    });
  
    // Actualizamos el div del precio total
    document.getElementById('precioTotal').innerText = 'Precio total: ' + total + '€';
  }
  
  // Esta función muestra u oculta las secciones según el tipo de vehículo
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
  
      // Desmarcamos las opciones de carrocería y puertas
      grupoCarroceria.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
      grupoPuertas.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    }
  
    // Calculamos el precio cada vez que se cambia el tipo de vehículo
    calcularPrecio();
  }
  
  // Esta función genera la frase final con las opciones seleccionadas y el precio total
  function enviar() {
    const vehiculo = document.getElementById('vehiculoSelect').value;
    const motor = obtenerSeleccion('motor');
    const transmision = obtenerSeleccion('transmision');
    const traccion = obtenerSeleccion('traccion');
    const carroceria = obtenerSeleccion('carroceria');
    const puertas = obtenerSeleccion('puertas');
    const precioTexto = document.getElementById('precioTotal').innerText;
  
    let frase = 'Quiero los 3 mejores ' + vehiculo.toLowerCase() + 's con motor ' + motor +
                ', transmisión ' + transmision + ', tracción ' + traccion;
  
    if (vehiculo === 'Coche') {
      frase += ', carrocería ' + carroceria + ' y ' + puertas + ' puertas.';
    } else {
      frase += '.';
    }
  
    frase += '\n' + precioTexto;
  
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerText = frase;
    resultadoDiv.style.display = 'block';
  }
  
  // Devuelve el valor seleccionado de un grupo de radios
  function obtenerSeleccion(nombreGrupo) {
    const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
    return seleccionado ? seleccionado.value : 'sin seleccionar';
  }
  
  // 🎯 Aquí el cambio: escuchamos TODO el formulario entero
  document.getElementById('formulario').addEventListener('change', () => {
    calcularPrecio();
  });
  
  // Y también al cambiar de coche a moto
  document.getElementById('vehiculoSelect').addEventListener('change', actualizarFormulario);
  
  // Al cargar la página, actualizamos para ocultar lo que toque y calcular el precio inicial
  actualizarFormulario();  