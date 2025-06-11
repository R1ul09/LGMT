// Creamos un array para almacenar todos los coches una vez que se carguen del archivo JSON
// Esto nos permite filtrar y ordenar los datos sin tener que volver a cargarlos cada vez (eso no seria eficiete)
let todosLosCoches = [];

// Esperamos a qe el documento HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Llama a la función para cargar el catálogo de coches
  cargarCatalogo();

  // Añade un "escuchador de eventos" (event listener) al elemento select de filtro
  // Cada vez que el valor seleccionado en el filtro cambie, se ejecutará una función
  document.getElementById("filtroSelect").addEventListener("change", (event) => {
    // Llama a la función 'filtrarYCargarCatalogo' pasando el valor de la opción seleccionada
    // 'event.target.value' obtiene el 'value' del <option> que se acaba de seleccionar
    // Aquí es donde se obtiene el valor de la opción seleccionada por el usuario:
    // 'event' es el objeto que contiene informacion sobre el evento (el cambio en el select)
    // 'event.target' se refiere al elemento HTML que disparó el evento, que en este caso es el <select>
    // 'event.target.value' es el valor actual de ese elemento <select>, que es el 'value' del <option> elegido (mas caro o lo que dea)
    // Por ejemplo, si el usuario selecciona "Más caro", 'event.target.value' será la cadena "masCaros"
    filtrarYCargarCatalogo(event.target.value);
  });
});

// Función asíncrona para cargar los datos del catálogo desde un archivo JSON local
function cargarCatalogo() {
  // Realiza una petición (fetch) al archivo coches.json
  fetch("../../JSON/coches.json")
    // Cuando la respuesta de la petición llega la convierte a formato JSON
    .then(response => response.json())
    // Una vez que los datos JSON están disponibles hace lo siguiente
    .then(data => {
      // Guarda todos los datos de los coches en la variable global todosLosCoches
      todosLosCoches = data; 
      // Mostramos el catálogo inicial con todos los coches sin filtrar
      mostrarCatalogo(todosLosCoches); 
    })
    // Si ocurre un error durante la carga (ej. el archivo no existe), lo captura y lo muestra en la consola
    .catch(error => {
      console.error("Error al cargar el catálogo:", error);
    });
}

// Funcion para extraer solo el número de una cadena de texto de precio
// Por ejemplo: "€120.000" -> 120000 o "120,50€" -> 120.50
function extraerNumero(texto) {
  // Elimina el símbolo del euro (€), los puntos de miles (.) y reemplaza las comas (,) por puntos para los decimales
  // Esto limpia la cadena para que solo quede el humero 
  let numeroLimpio = texto.replace(/€/g, '').replace(/\./g, '').replace(/,/g, '.');
  // Intenta convertir la cadena limpia a un número decimal
  let soloNumeros = parseFloat(numeroLimpio);
  // Si la conversión resulta en 'NaN' (Not a Number), devuelve 0; de lo contrario, devuelve el número
  return isNaN(soloNumeros) ? 0 : soloNumeros;
}

// Funcin para extraer solo el número de una cadena de texto de velocidad (lo mismo que la de arriba)
// Por ejemplo: "300 km/h" pues es 300
function extraerVelocidad(texto) {
  // Busca el primer grupo de uno o más dígitos (\d+) en la cadena
  // 'match()' devuelve un array si encuentra una coincidencia, o null si no
  const match = texto.match(/\d+/);
  // Si se encontro una coincidencia (match no es null), convierte el primer elemento (el número) a entero
  // Si no se encontro, devuelve 0 para evitar errores
  return match ? parseInt(match[0]) : 0;
}

// Funcion para filtrar y luego mostrar el catálogo de coches
// criterio es el nombre temporal que le damos dentro de esta funcion
function filtrarYCargarCatalogo(criterio) {
  // Crea una copia del array 'todosLosCoches'. Es importante usar una copia ([...])
  // para no modificar el array original y poder volver a filtrar desde los datos base del JSON
  let cochesOrdenados = [...todosLosCoches];

  // Utilizamos switch para aplicar diferentes logicas de ordenacion
  // basándose en el criterio
  switch (criterio) {
    case "masCaros":
      // Ordena los coches de más caros a más baratos
      // El metodo sort() compara pares de elementos (a y b). Si (b - a) es positivo, 
      // a se mueve después de b (orden descendente); si es negativo, a permanece antes de b (orden ascendente)
      // 'b - a' ordena de forma descendente (el mayor primero)
      cochesOrdenados.sort((a, b) => extraerNumero(b.precio) - extraerNumero(a.precio));
      break;
    case "masBarato":
      // Ordena los coches de más baratos a más caros
      // 'a - b' ordena de forma ascendente (el menor primero)
      cochesOrdenados.sort((a, b) => extraerNumero(a.precio) - extraerNumero(b.precio));
      break;
    case "masRapido":
      // Ordena los coches de más rápidos a más lentos
      // 'extraerVelocidad' se usa para obtener los valores numéricos de la velocidad máxima
      // 'b - a' ordena de forma descendente
      cochesOrdenados.sort((a, b) => extraerVelocidad(b.velocidadMax) - extraerVelocidad(a.velocidadMax));
      break;
    case "masLento":
      // Ordena los coches de más lentos a más rápidos
      // 'a - b' ordena de forma ascendente
      cochesOrdenados.sort((a, b) => extraerVelocidad(a.velocidadMax) - extraerVelocidad(b.velocidadMax));
      break;
    default:
      // Si no es ninguna de las ociones pues entonces nos salimos
      break;
  }
  // Después de ordenar (o no), llama a 'mostrarCatalogo' para actualizar
  mostrarCatalogo(cochesOrdenados);
}

// Función para mostrar las "cards" (tarjetas) de los coches en la pantalla
function mostrarCatalogo(coches) {

  const contenedor = document.getElementById("catalogoCoches");
  // Limpia completamente el contenido actual del contenedor
  // Esto es importante para que si vas cambiandoel filtro pues que s e vaya limpiando y mostrando
  contenedor.innerHTML = "";

  // Iteramos sobre cada objeto 'coche' en el array 'coches' proporcionado
  // 'index' es la posición del coche en el array, esto es para las animaciones
  coches.forEach((coche, index) => {
    // Crea un nuevo elemento <div> para la tarjeta que "gira" (flip card).
    const cardFlip = document.createElement("div");
    // Añade CSS y la Animate.css.
    cardFlip.classList.add("card-flip", "animate__animated", "animate__fadeInUp");
    // Establece un retraso en la animación para que las tarjetas aparezcan mas lenta la primera que la siguiente
    cardFlip.style.animationDelay = `${index * 0.1}s`;

    // Crea un nuevo elemento <div> para el "contenedor interno" de la tarjeta giratoria
    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    // --- PARTE FRONTAL DE LA TARJETA ---
    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    // Crea un elemento <img> para la imagen del coche
    const img = document.createElement("img");
    img.src = coche.imagen;
    img.alt = coche.nombre;

    // Añade un escuchador de eventos a la imagen: cuando se haga click alternara entre la clase flipped y la clase front
    img.addEventListener("click", () => {
      cardFlip.classList.toggle("flipped");
    });

    // Crea un elemento <h3> para el nombre del coche
    const nombre = document.createElement("h3");
    nombre.textContent = coche.nombre;

    // Crea un elemento <div> para el precio
    const precio = document.createElement("div");
    // Añadimos una clase para aplicar estilos específicos al precio
    precio.classList.add("precio"); 
    precio.textContent = coche.precio;

    // Crea un elemento <button> para el botón "Comprar"
    const botonFront = document.createElement("button");
     // Añade la clase CSS para el botón
    botonFront.classList.add("comprar-button");
    botonFront.textContent = "Comprar";
    botonFront.onclick = () => window.location.href = "contacto.html";

    // Añade todos los elementos creados a la parte frontal de la tarjeta
    cardFront.appendChild(img);
    cardFront.appendChild(nombre);
    cardFront.appendChild(precio);
    cardFront.appendChild(botonFront);

    // --- PARTE TRASERA DE LA TARJETA ---
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    cardBack.addEventListener("click", () => {
      cardFlip.classList.toggle("flipped");
    });

    // Crea un elemento <h3> para el nombre del coche en la parte trasera
    const nombreBack = document.createElement("h3");
    nombreBack.textContent = coche.nombre;

    // Crea elementos <p> para la descripción y las especificaciones del coche
    const descripcion = document.createElement("p");
    descripcion.textContent = coche.descripcion;

    const potencia = document.createElement("p");
    potencia.textContent = `Potencia: ${coche.potencia}`;

    const velocidadMax = document.createElement("p");
    velocidadMax.textContent = `Velocidad máxima: ${coche.velocidadMax}`;

    const motor = document.createElement("p");
    motor.textContent = `Motor: ${coche.motor}`;

    const transmision = document.createElement("p");
    transmision.textContent = `Transmisión: ${coche.transmision}`;

    const traccion = document.createElement("p");
    traccion.textContent = `Tracción: ${coche.traccion}`;

    const precioBack = document.createElement("p");
    precioBack.textContent = `Precio: ${coche.precio}`;

    // Añade todos los elementos de especificaciones a la parte trasera de la tarjeta.
    cardBack.appendChild(nombreBack);
    cardBack.appendChild(descripcion);
    cardBack.appendChild(potencia);
    cardBack.appendChild(velocidadMax);
    cardBack.appendChild(motor);
    cardBack.appendChild(transmision);
    cardBack.appendChild(traccion);
    cardBack.appendChild(precioBack);

    // --- ENSAMBLAR LA TARJETA COMPLETA ---
    // Añade la parte frontal y trasera al contenedor interno de la tarjeta.
    // AppendChild() es una función de DOM (Document Object Model) que agrega un elemento hijo a otro elemento padre
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    // Añade el contenedor interno al div principal de la tarjeta que gira
    cardFlip.appendChild(cardInner);
    // Finalmente, añade la tarjeta completa al contenedor general del catálogo en el HTML
    contenedor.appendChild(cardFlip);
  });
}