// Activa las animaciones de la librería AOS (las transiciones de aparición)
AOS.init();

// Esta función se ejecuta cuando se pulsa el botón "Ver más info"
function mostrarInfo(boton) {
  // Busca el div que está justo debajo del botón (la descripción del coche)
  const info = boton.nextElementSibling;

  // Si ese div tiene la clase "show", se la quitamos
  if (info.classList.contains("show")) {
    info.classList.remove("show");
  } else {
    // Si no la tiene, la mostramos
    info.classList.add("show");
  }
}

// Funcion para volver arriba a la pagina
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cuando se cargue la pagina por completo hara lo de abajo 
document.addEventListener("DOMContentLoaded", () => {
  // Buscamos el contenedor donde irá el dato curioso
  const curiosidadesDiv = document.getElementById("datosCuriosos");

  // Y metemos dentro un botón para cargar curiosidades
  curiosidadesDiv.innerHTML = `
    <button class="datos-button" onclick="cargarCuriosidad()">Obtener dato curioso</button>
  `;
});

// Función que obtiene un dato curioso de la API
function cargarCuriosidad() {
  // Creamos una constante que almacena el elemento con el id "datosCuriosos"
  const curiosidadesDiv = document.getElementById("datosCuriosos");

  // Primero mostramos el loader (círculo girando)
  curiosidadesDiv.innerHTML = `<div class="loader"></div>`;

  // Llamamos a la API de Magic Loops para traer un dato curioso
  fetch("https://magicloops.dev/api/loop/568eb6f8-0b4d-4b76-9bfc-659f85e61b1c/run")
    // Convertimos la respuesta a JSON
    .then(response => response.json())
    // Entonces con el JSON que nos haya dado, haremos lo siguiente
    .then(data => {
      // Elegimos un dato al azar de todos los datos que nos  devuelve la API
      const aleatorio = data[Math.floor(Math.random() * data.length)];

      // Esperamos hast a que termine de cargar (para que se vea el loader) y lo mostramos
      setTimeout(() => {
        curiosidadesDiv.innerHTML = `
          <div class="dato-curioso show">${aleatorio}</div>
          <button class="datos-button" onclick="cargarCuriosidad()">Otro dato curioso</button>
        `;
      }, 800);
    })
    .catch(error => {
      // Si la API falla, mostramos un mensaje de error
      curiosidadesDiv.innerHTML = `<p style="text-align:center;">Error al cargar el dato curioso.</p>`;
      console.error("Error:", error);
    });
}

// Aquí configuramos el carrusel Swiper (el de los coches)
const swiper = new Swiper(".mySwiper", {
  // Número de coches visibles a la vez (en móvil es 1)
  slidesPerView: 1,
  // Separación entre coches 
  spaceBetween: 30, 
  // Hace que vuelva al principio al llegar al final
  loop: true, 
  // Velocidad de cambio entre slides
  speed: 900, 
  // Efecto de deslizamiento normal
  effect: "slide", 
  // Cambia el cursor a una mano al pasar por encima
  grabCursor: true, 
  // Centra la imagen activa
  centeredSlides: true, 
  // efecto parallax (movimiento de fondo)
  parallax: true, 
  // Botones de siguiente y anterior
  navigation: { 
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  // Número de slides visibles según tamaño de pantalla
  breakpoints: { 
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 3
    }
  }
});