document.addEventListener("DOMContentLoaded", () => {
  cargarCatalogo();
});

function cargarCatalogo() {
  fetch("../../JSON/coches.json")
    .then(response => response.json())
    .then(data => {
      mostrarCatalogo(data);
    })
    .catch(error => {
      console.error("Error al cargar el catálogo:", error);
    });
}

function mostrarCatalogo(coches) {
  const contenedor = document.getElementById("catalogoCoches");

  coches.forEach(coche => {
    const cardFlip = document.createElement("div");
    cardFlip.classList.add("card-flip");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");

    const img = document.createElement("img");
    img.src = coche.imagen;
    img.alt = coche.nombre;

    // Cuando haces click en la imagen → se gira
    cardFront.addEventListener("click", () => {
      cardFlip.classList.toggle("flipped"); // Esta línea es la clave
    });

    const nombre = document.createElement("h3");
    nombre.textContent = coche.nombre;

    const precio = document.createElement("div");
    precio.classList.add("precio");
    precio.textContent = coche.precio;

    const botonFront = document.createElement("button");
    botonFront.classList.add("comprar-button");
    botonFront.textContent = "Comprar";
    botonFront.onclick = () => window.location.href = "contacto.html";

    cardFront.appendChild(img);
    cardFront.appendChild(nombre);
    cardFront.appendChild(precio);
    cardFront.appendChild(botonFront);

    // Parte trasera
    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");

    // Cuando haces click en la parte trasera → se gira de nuevo
    cardBack.addEventListener("click", () => {
      cardFlip.classList.toggle("flipped"); // Esta línea es la clave para la vuelta
    });

    const nombreBack = document.createElement("h3");
    nombreBack.textContent = coche.nombre;

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

    cardBack.appendChild(nombreBack);
    cardBack.appendChild(descripcion);
    cardBack.appendChild(potencia);
    cardBack.appendChild(velocidadMax);
    cardBack.appendChild(motor);
    cardBack.appendChild(transmision);
    cardBack.appendChild(traccion);
    cardBack.appendChild(precioBack);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardFlip.appendChild(cardInner);
    contenedor.appendChild(cardFlip);
  });
}