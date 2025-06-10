document.addEventListener("DOMContentLoaded", () => {
  const tipoSolicitud = document.getElementById("tipoSolicitud");
  const modeloContainer = document.getElementById("modeloContainer");
  const modeloSelect = document.getElementById("modeloSelect");
  const form = document.getElementById("formContacto");
  const enviarButton = form.querySelector(".enviar-button");
  const buttonText = enviarButton.querySelector(".button-text"); // Nuevo: el span con el texto
  const buttonSpinner = enviarButton.querySelector(".button-spinner"); // Nuevo: el span con el spinner

  // Función auxiliar para mostrar mensajes con Toastify
  function mostrarToast(mensaje, tipo = "success") {
    let backgroundColor;
    if (tipo === "success") {
      backgroundColor = "linear-gradient(to right, #5cb85c, #4CAF50)"; // Verde
    } else if (tipo === "error") {
      backgroundColor = "linear-gradient(to right, #d9534f, #dc3545)"; // Rojo
    } else if (tipo === "warning") {
      backgroundColor = "linear-gradient(to right, #f0ad4e, #ffc107)"; // Naranja
    } else {
      backgroundColor = "linear-gradient(to right, #007bff, #0056b3)"; // Azul por defecto
    }

    Toastify({
      text: mensaje,
      duration: 3000, // Duración en milisegundos (3 segundos)
      close: true, // Mostrar botón de cerrar
      gravity: "top", // 'top' o 'bottom'
      position: "right", // 'left', 'center' o 'right'
      stopOnFocus: true, // Permite que el toast permanezca si el usuario hace foco en él
      style: {
        background: backgroundColor,
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      },
    }).showToast();
  }

  // Mostrar selector de modelos si seleccionas "compra"
  tipoSolicitud.addEventListener("change", () => {
    if (tipoSolicitud.value === "compra") {
      modeloContainer.classList.remove("oculto");
      cargarModelos();
    } else {
      modeloContainer.classList.add("oculto");
      modeloSelect.innerHTML = "";
    }
  });

  // Cargar modelos desde JSON de coches
  function cargarModelos() {
    fetch("../../JSON/coches.json")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        modeloSelect.innerHTML = "<option value=''>Selecciona un modelo</option>";
        data.forEach(coche => {
          const option = document.createElement("option");
          option.value = coche.nombre;
          option.textContent = coche.nombre;
          modeloSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error al cargar modelos:", error);
        mostrarToast('No se pudieron cargar los modelos de coches. Intenta de nuevo más tarde.', 'error');
      });
  }

  // --- Lógica para guardar la cita en JSON local simulado (en localStorage) ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validación básica adicional
    if (tipoSolicitud.value === "compra" && modeloSelect.value === "") {
        mostrarToast('Por favor, selecciona un modelo deseado para la compra.', 'warning');
        return;
    }

    // Deshabilita el botón
    enviarButton.disabled = true;
    // Oculta el texto y muestra el spinner
    buttonText.classList.add("oculto");
    buttonSpinner.classList.remove("oculto");

    try {
      const formData = new FormData(form);
      const nuevaCita = Object.fromEntries(formData.entries());

      nuevaCita.id = Date.now();
      nuevaCita.fechaEnvio = new Date().toLocaleString();

      let citas = JSON.parse(localStorage.getItem("citas") || "[]");
      citas.push(nuevaCita);
      localStorage.setItem("citas", JSON.stringify(citas));

      // Esperar un poco para simular una operación de red real (opcional)
      await new Promise(resolve => setTimeout(resolve, 1500));

      mostrarToast('¡Tu solicitud se ha enviado correctamente! Te contactaremos pronto.', 'success');

      form.reset();
      modeloContainer.classList.add("oculto");

    } catch (error) {
      console.error("Error al guardar la cita en localStorage:", error);
      mostrarToast('Hubo un error al enviar tu solicitud. Intenta de nuevo.', 'error');
    } finally {
      // Siempre re-habilita el botón después del intento de envío
      enviarButton.disabled = false;
      // Muestra el texto y oculta el spinner
      buttonText.classList.remove("oculto");
      buttonSpinner.classList.add("oculto");
    }
  });
});