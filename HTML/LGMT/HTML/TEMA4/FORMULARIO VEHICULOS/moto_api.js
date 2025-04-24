// Esta función se encarga de sumar todos los precios de las opciones seleccionadas
function calcularPrecio() {
    // Guardamos aquí el precio total
    let total = 0;
  
    // Buscamos todos los input de tipo radio que estén seleccionados, cuando ponemos
    // querySelectorAll('input[type="radio"]:checked') nos devuelve todos los input de tipo radio
    // que estén seleccionados, pero no los que no estén seleccionados, y ponemos forEach
    // nos devuelve cada uno de los input de tipo radio que estén seleccionados
    const radiosSeleccionados = document.querySelectorAll('input[type="radio"]:checked');
    radiosSeleccionados.forEach(radio => {
      // Leemos el precio que está justo al lado del input, sibling significa que nos
      // estamos buscando el elemento que está a la derecha del elemento actual
      let precioTexto = radio.nextElementSibling.innerText;
      // Quitamos los símbolos € y los paréntesis para dejar solo el número
      precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
      // Convertimos ese texto a número y ya estaria hecho
      total += Number(precioTexto);
    });
  
    // Hacemos lo mismo con los checkboxes que estén seleccionados
    const extrasSeleccionados = document.querySelectorAll('input[type="checkbox"]:checked');
    extrasSeleccionados.forEach(checkbox => {
      let precioTexto = checkbox.nextElementSibling.innerText;
      precioTexto = precioTexto.replace('€', '').replace('(', '').replace(')', '');
      total += Number(precioTexto);
    });
  
    // Mostramos el precio total abajo a la derecha
    document.getElementById('precioTotal').innerText = 'Precio total: ' + total + '€';
  
    return total; // Devolvemos el total para poder usarlo después
  }
  
  // Esta función genera la frase final con las opciones elegidas y el precio total
  function enviar() {
    // Definimos los nombres de los grupos obligatorios (los que sí hay que elegir)
    const gruposObligatorios = ['motor', 'transmision', 'traccion', 'color', 'seguro'];
  
    // Comprobamos que todos los grupos tienen una opción seleccionada
    for (let i = 0; i < gruposObligatorios.length; i++) {
      const nombreGrupo = gruposObligatorios[i];
      const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
      if (!seleccionado) {
        alert('Debes seleccionar una opción en ' + nombreGrupo);
        // Si falta algo, paramos la función
        return;
      }
    }
  
    // Si todo está bien, recogemos el valor de cada grupo
    const motor = obtenerSeleccion('motor');
    const transmision = obtenerSeleccion('transmision');
    const traccion = obtenerSeleccion('traccion');
    const color = obtenerSeleccion('color');
    const seguro = obtenerSeleccion('seguro');
  
    // Recogemos el precio total actual
    const precioTotalTexto = document.getElementById('precioTotal').innerText;
  
    // Montamos la frase con las opciones elegidas y el precio
    let frase = 'Quiero las 3 mejores motos con motor ' + motor +
                ', transmisión ' + transmision + ', tracción ' + traccion +
                ', color ' + color + ' y seguro ' + seguro + '.\n' + precioTotalTexto;
  
    // Mostramos la frase en el div de resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerText = frase;
    resultadoDiv.style.display = 'block';
  }
  
  // Esta función devuelve el valor de la opción seleccionada en un grupo
  function obtenerSeleccion(nombreGrupo) {
    const seleccionado = document.querySelector('input[name="' + nombreGrupo + '"]:checked');
    if (seleccionado) {
      return seleccionado.value; // Devolvemos el valor elegido
    } else {
      return 'sin seleccionar'; // Si no hay nada, devolvemos ese texto
    }
  }
  
  // Esta función sirve para volver al configurador de coches
  function volverACoche() {
    // Cambiamos de página a index.html
    window.location.href = 'index.html';
  }
  
  // Este bloque se ejecuta cuando cambias cualquier input (radio o checkbox)
  document.getElementById('formulario').addEventListener('change', () => {
    // Cada vez que cambias algo, recalculamos el precio total
    calcularPrecio();
  });
  
  // Al cargar la página, mostramos el precio inicial (que será 0€)
  calcularPrecio();

  // Esta función detecta cuando se cambia el tipo de vehículo en el desplegable
    document.getElementById('vehiculoSelect').addEventListener('change', () => {
    const tipoVehiculo = document.getElementById('vehiculoSelect').value;
  
    // Si elige Coche, lo mandamos al index.html (configurador de coches)
    if (tipoVehiculo === 'Coche') {
      window.location.href = 'coches.html';
    }
    // Si elige Moto, no hace nada porque ya está en esta página
  });
  