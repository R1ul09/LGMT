document.addEventListener("DOMContentLoaded", () => {
  // aqui pillamos los elementos del dom que vamos a usar mas tarde
  const tipoSolicitud = document.getElementById("tipoSolicitud");
  const modeloContainer = document.getElementById("modeloContainer");
  const modeloSelect = document.getElementById("modeloSelect");
  const form = document.getElementById("formContacto");
  const enviarButton = form.querySelector(".enviar-button");
  const buttonText = enviarButton.querySelector(".button-text");
  const buttonSpinner = enviarButton.querySelector(".button-spinner");

  function mostrarToast(mensaje, tipo = "success") {
    let backgroundColor;
    // aqui decido el color de fondo del mensajito segun el tipo (success, error, warning)
    if (tipo === "success") {
      backgroundColor = "linear-gradient(to right, #5cb85c, #4CAF50)";
    } else if (tipo === "error") {
      backgroundColor = "linear-gradient(to right, #d9534f, #dc3545)";
    } else if (tipo === "warning") {
      backgroundColor = "linear-gradient(to right, #f0ad4e, #ffc107)";
    } else {
      backgroundColor = "linear-gradient(to right, #007bff, #0056b3)";
    }

    Toastify({
      text: mensaje,
      duration: 5000,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: backgroundColor,
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
      },
    }).showToast();
  }

  // aqui escucho cuando la gente cambia la opcion de "tipo de solicitud"
  tipoSolicitud.addEventListener("change", () => {
    // si eligen "compra", les muestro el campo para elegir el modelo de coche
    if (tipoSolicitud.value === "compra") {
      // quito la case 'oculto' para que se vea
      modeloContainer.classList.remove("oculto");
      // y llamo a mi funcion para cargar los modelos de coches
      cargarModelos(); 
    } else {
      // si eligen otra cosa, oculto el campo del modelo
      modeloContainer.classList.add("oculto"); 
      // y vacio el selector de modelos
      modeloSelect.innerHTML = ""; 
    }
  });

  // esta es mi funcion para cargar los modelos de coches desde el JSON
  function cargarModelos() {
    // hago una peticion pa pillar el archivo JSON de coches
    fetch("../../JSON/coches.json")
      .then(response => {
        // si la respuesta es distinta de ok, lanzo un error (no deberia de pasa)
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        // si todo va bien, convierto la respuesta a JSON
        return response.json();
      })
      .then(data => {
        // primero pongo una opcion por defecto en el selector
        modeloSelect.innerHTML = "<option value=''>Selecciona un modelo</option>";
        // luego recorro todos los coches que he pillado del JSON
        data.forEach(coche => {
          // creo una nueva opcion
          const option = document.createElement("option"); 
          // el valor de la opcion es el nombre del coche
          option.value = coche.nombre; 
          // el texto que se ve es el nombre del coche
          option.textContent = coche.nombre; 
          // y añado la opcion al selector
          modeloSelect.appendChild(option); 
        });
      })
      .catch(error => {
        // si hay algun error al cargar los modelos, lo muestro en la consola
        console.error("Error al cargar modelos:", error);
        // y tambien muestro un mensajito de error al usuario
        mostrarToast('No se pudieron cargar los modelos de coches. Intenta de nuevo mas tarde.', 'error');
      });
  }

  // aqui empieza la logica para guardar la cita (lo simulamos en el navegador con localstorage)
  // escucho cuando se envia el formulario
  form.addEventListener("submit", async (e) => {
    // evito que el formulario se envie de la forma normal (par que no se recargue la pagina)
    e.preventDefault(); 

    // aqui empiezo a hacer las validaciones antes de enviar nada
    const nombreInput = form.querySelector('input[name="nombre"]');
    const emailInput = form.querySelector('input[name="email"]');
    const telefonoInput = form.querySelector('input[name="telefono"]');
    const mensajeInput = form.querySelector('textarea[name="mensaje"]');

    // validacion de que los campos obligatorios no esten vacios
    // aunque el html tenga 'required', esto da un control extra en js
    if (!nombreInput.value.trim()) {
      mostrarToast('El campo Nombre completo es obligatorio', 'warning');
      return;
    }
    if (!emailInput.value.trim()) {
      mostrarToast('El campo Email es obligatorio', 'warning');
      return;
    }
    if (!telefonoInput.value.trim()) {
      mostrarToast('El campo Telefono es obligatorio, porfa.', 'warning');
      return;
    }
    if (!mensajeInput.value.trim()) {
      mostrarToast('El campo Mensaje es obligatorio, ¡escribenos algo para saber!', 'warning');
      return;
    }

    // validacion del telefono: solo numeros
    // uso una expresion regular pa ver si son digitos
    // esto significa qe empieza y termina con uno o mas digitos
    const phonePattern = /^\d+$/; 
    if (!phonePattern.test(telefonoInput.value.trim())) {
      mostrarToast('El telefono solo puede contener numeros', 'warning');
      return;
    }

    if (!emailInput.value.trim().includes("@") || !emailInput.value.trim().includes(".")) {
      mostrarToast('El formato del email no es correcto, revisalo.', 'warning');
      return;
    }

    // validacion para el campo de modelo si la solicitud es de "compra"
    if (tipoSolicitud.value === "compra" && modeloSelect.value === "") {
        mostrarToast('Por favor, selecciona un modelo deseado para la compra.', 'warning');
        return;
    }

    // si hemos llegado hasta aqui, es que todas las validaciones han pasado
    // aqui desactivo el boton para que no lo pulsen mas de una vez
    enviarButton.disabled = true;
    // oculto el texto del boton y muestro el spinner de carga
    buttonText.classList.add("oculto");
    buttonSpinner.classList.remove("oculto");

    try {
      // pillo todos los datos del formulario
      const formData = new FormData(form); 
      // los convierto a un objeto
      const nuevaCita = Object.fromEntries(formData.entries()); 

      // le doy un id unico con la fecha y hora actual
      nuevaCita.id = Date.now(); 
      // y guardo la fecha de envio
      nuevaCita.fechaEnvio = new Date().toLocaleString(); 

      // intento pillar las citas que ya tengo guardadas en el navegador (si no hay, creo una lista vacia)
      let citas = JSON.parse(localStorage.getItem("citas") || "[]");
      // añado la nueva cita a la lista (para que salga en el navegador)
      citas.push(nuevaCita); 
      // y guardo la lista actualizada en el navegador
      localStorage.setItem("citas", JSON.stringify(citas)); 

      // espero un poquito (1.5 segundos) pa simular que hay una operacion de red de verdad
      await new Promise(resolve => setTimeout(resolve, 1500));

      // si todo va bien, muestro un mensajito de exito
      mostrarToast('¡Tu solicitud se ha enviado correctamente! Te contactaremos pronto.', 'success');

      // limpio el formulario
      form.reset(); 
      // y oculto el campo del modelo otra vez
      modeloContainer.classList.add("oculto"); 

    } catch (error) {
      // si pasa algo mal, lo muestro en la consola
      console.error("Error al guardar la cita en localStorage:", error);
      // y muestro un mensajito de error al usuario
      mostrarToast('Hubo un error al enviar tu solicitud. Intenta de nuevo.', 'error');
    } finally {
      // esto siempre se ejecuta, pase lo que pase (exito o error)
      // vuelvo a activar el boton
      enviarButton.disabled = false; 
      // vuelvo a mostrar el texto del boton
      buttonText.classList.remove("oculto"); 
      // y oculto el spinner
      buttonSpinner.classList.add("oculto"); 
    }
  });
});