// Función la cual va a servir para resetear el formulario
function ResetearFormulario() {
    // Limpiamos el formulario desmarcando todas las materias
    document.getElementById("mat1").checked = false;
    document.getElementById("mat2").checked = false;
    document.getElementById("his").checked = false;
    document.getElementById("fis").checked = false;

    // Limpiamos el número de horas
    document.getElementById("horas").value = "";

    // Quitamos las opciones de antiguo alumno y beca
    document.getElementById("antiguo").checked = false;
    document.getElementById("beca").checked = false;

    // Limpiamos el div de resultado
    document.getElementById("resultado").innerHTML = "";
}

// Función que se ejecuta al pulsar el botón de calcular precio
function calcularPrecio() {
    // Obtener los valores de los checkboxes de las asignaturas
    let mat1 = document.getElementById("mat1").checked;
    let mat2 = document.getElementById("mat2").checked;

    // Obtener las horas semanales que ha escrito el usuario
    let horas = parseInt(document.getElementById("horas").value);

    // Saber si es antiguo alumno
    let antiguo = document.getElementById("antiguo").checked;

    // Saber si tiene beca
    let beca = document.getElementById("beca").checked;

    // Div donde se mostrará el resultado
    let resultado = document.getElementById("resultado");

    // Si el usuario ha marcado Matemáticas II sin marcar Matemáticas I
    if (mat2 && !mat1) {
        // Mostramos mensaje de error y detenemos la función
        resultado.innerHTML = "❌ No puedes elegir Matemáticas II sin cursar Matemáticas I.";
        return;
    }

    // Comprobamos si ha puesto horas válidas
    if (isNaN(horas) || horas <= 0) {
        resultado.innerHTML = "❌ Por favor, indica cuántas horas semanales vas a cursar.";
        return;
    }

    // Precio base: 20€ por cada hora semanal
    let precioBase = horas * 20;

    // Si es antiguo alumno, se le aplica un 35% de descuento
    if (antiguo) {
        // 100% - 35% = 65%
        precioBase *= 0.65;
    }

    // Guardamos el precio final normal
    let precioFinal = precioBase;

    // Variable donde vamos a guardar el mensaje que se mostrará al usuario
    let mensaje = `💶 Total mensual: <strong>${precioFinal.toFixed(2)} €</strong>`;

    // Si tiene beca, calculamos el precio con beca y lo añadimos al mensaje
    if (beca) {
        // Se queda en un 20% del precio final
        let precioConBeca = precioFinal * 0.20;

        // Añadimos la línea de precio con beca al mensaje
        mensaje += `<br>🎓 Con beca: <strong>${precioConBeca.toFixed(2)} €</strong>`;
    }

    // Mostramos el mensaje final en el div resultado
    resultado.innerHTML = mensaje;
}