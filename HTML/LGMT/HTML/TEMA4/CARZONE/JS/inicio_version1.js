AOS.init();

function mostrarInfo(btn) {
  const info = btn.nextElementSibling;
  if (!info.classList.contains("show")) {
    info.classList.add("show");
  } else {
    info.classList.remove("show");
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

function cargarCuriosidad() {
  const curiosidadesDiv = document.getElementById("datosCuriosos");
  // Aquí pondremos la llamada a la API real en cuanto la tengas
  curiosidadesDiv.innerHTML = "¿Sabías que el primer coche eléctrico se fabricó en 1884?";
}
