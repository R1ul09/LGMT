AOS.init();

function mostrarInfo(boton) {
  const info = boton.nextElementSibling;
  
  // Si está oculta, la mostramos
  if (info.classList.contains("show")) {
    info.classList.remove("show");
  } else {
    info.classList.add("show");
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Cargar datos curiosos con botón (placeholder)
document.addEventListener("DOMContentLoaded", () => {
  const curiosidadesDiv = document.getElementById("datosCuriosos");
  curiosidadesDiv.innerHTML = `<button class="datos-button" onclick="cargarCuriosidad()">Obtener dato curioso</button>`;
});

function scrollSlider(value) {
  document.getElementById("sliderModelos").scrollBy({
    left: value,
    behavior: 'smooth'
  });
}

function cargarCuriosidad() {
  const curiosidadesDiv = document.getElementById("datosCuriosos");

  // Mostrar loader y ocultar contenido previo
  curiosidadesDiv.innerHTML = `<div class="loader"></div>`;

  fetch("https://magicloops.dev/api/loop/568eb6f8-0b4d-4b76-9bfc-659f85e61b1c/run")
    .then(response => response.json())
    .then(data => {
      const aleatorio = data[Math.floor(Math.random() * data.length)];

      setTimeout(() => {
        curiosidadesDiv.innerHTML = `
          <div class="dato-curioso show">${aleatorio}</div>
          <button class="datos-button" onclick="cargarCuriosidad()">Otro dato curioso</button>
        `;
      }, 800);
    })
    .catch(error => {
      curiosidadesDiv.innerHTML = `<p style="text-align:center;">Error al cargar el dato curioso.</p>`;
      console.error("Error:", error);
    });
}

const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  speed: 900,
  effect: "slide",
  grabCursor: true,
  centeredSlides: true,
  parallax: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  breakpoints: {
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 3
    }
  }
});